// Import Dependencies
import { useEffect, useReducer } from "react";
import PropTypes from "prop-types";

// Local Imports
import { isSupabaseConfigured, supabase } from "supabaseClient";
import { AuthContext } from "./context";
import { normalizeUsername, usernameToEmail } from "utils/userEmail";

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  errorMessage: null,
  user: null,
};

const reducerHandlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      isLoading: false,
      user,
    };
  },

  LOGIN_REQUEST: (state) => {
    return {
      ...state,
      isLoading: true,
      errorMessage: null,
    };
  },

  LOGIN_SUCCESS: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      isLoading: false,
      user,
    };
  },

  LOGIN_ERROR: (state, action) => {
    const { errorMessage } = action.payload;

    return {
      ...state,
      errorMessage,
      isLoading: false,
    };
  },

  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    isLoading: false,
    user: null,
  }),
};

const reducer = (state, action) => {
  const handler = reducerHandlers[action.type];
  if (handler) {
    return handler(state, action);
  }
  return state;
};

function normalizeUser(user) {
  if (!user) return null;

  const metadata = user.user_metadata || {};
  const name = metadata.display_name || metadata.name || user.email;

  return {
    id: user.id,
    email: user.email,
    name,
    avatar: metadata.avatar_url || null,
    role: metadata.role || "Authenticated User",
    raw: user,
  };
}

async function resolveLoginEmail(usernameOrEmail) {
  const input = String(usernameOrEmail ?? "").trim();
  const generatedEmail = usernameToEmail(input);

  if (!input || input.includes("@")) return generatedEmail;

  const normalizedInput = normalizeUsername(input);

  try {
    const { data, error } = await supabase
      .from("User")
      .select("Username,Email")
      .eq("IsDeleted", false)
      .limit(500);

    if (error) return generatedEmail;

    const user = data?.find((item) => {
      return (
        normalizeUsername(item.Username) === normalizedInput ||
        item.Email?.toLowerCase() === generatedEmail
      );
    });

    return user?.Email || generatedEmail;
  } catch (error) {
    console.error(error);
    return generatedEmail;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      window.localStorage.removeItem("authToken");
      dispatch({
        type: "INITIALIZE",
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
      return undefined;
    }

    let isMounted = true;

    const init = async () => {
      try {
        window.localStorage.removeItem("authToken");

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (isMounted) {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: Boolean(session?.user),
              user: normalizeUser(session?.user),
            },
          });
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      dispatch({
        type: "INITIALIZE",
        payload: {
          isAuthenticated: Boolean(session?.user),
          user: normalizeUser(session?.user),
        },
      });
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async ({ email, username, password }) => {
    dispatch({
      type: "LOGIN_REQUEST",
    });

    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error("Supabase is not configured. Check your .env file.");
      }

      const loginEmail = await resolveLoginEmail(email || username);

      if (!loginEmail) {
        throw new Error("Username is required.");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (error) {
        throw new Error(
          "Invalid login. Use the username from User Management, for example daniel tan, or the generated email daniel.tan@gmail.com.",
        );
      }

      if (!data.user) {
        throw new Error("Login failed. Please check your email and password.");
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: normalizeUser(data.user),
        },
      });
    } catch (err) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: {
          errorMessage: err,
        },
      });
    }
  };

  const logout = async () => {
    window.localStorage.removeItem("authToken");

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error(error);
      }
    }

    dispatch({ type: "LOGOUT" });
  };

  if (!children) {
    return null;
  }

  return (
    <AuthContext
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
