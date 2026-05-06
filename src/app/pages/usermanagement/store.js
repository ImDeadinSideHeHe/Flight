import { useCallback, useEffect, useState } from "react";

import {
  createSupabaseTransientClient,
  isSupabaseConfigured,
  supabase,
} from "supabaseClient";
import { normalizeAuthPassword } from "utils/authPassword";
import { normalizeUsername, usernameToEmail } from "utils/userEmail";

const TABLE_NAME = "User";
const missingConfigMessage = "Missing Supabase URL or publishable key in .env";

export const emptyUserForm = {
  Username: "",
  Email: "",
  Phone: "",
  Password: "",
};

function buildUserIdentity(usernameInput) {
  const username = String(usernameInput ?? "").trim();
  const normalizedUsername = normalizeUsername(username);

  return {
    username,
    normalizedUsername,
    email: usernameToEmail(normalizedUsername),
  };
}

function toPayload(values) {
  const { username, email } = buildUserIdentity(values.Username);

  return {
    Username: username,
    Email: email,
    Phone: values.Phone.trim() || null,
    IsDeleted: false,
  };
}

function assertSupabaseConfigured() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(missingConfigMessage);
  }
}

function normalizeSaveError(error) {
  if (
    error?.code === "over_email_send_rate_limit" ||
    error?.status === 429
  ) {
    return new Error(
      "Supabase email rate limit exceeded. Wait a few minutes, or turn off Confirm email in Supabase Authentication > Providers > Email while testing.",
    );
  }

  return error;
}

export function getGeneratedUserEmail(username) {
  return buildUserIdentity(username).email;
}

export function getUserFormValues(user) {
  if (!user) return emptyUserForm;

  return {
    Username: user.Username ?? "",
    Email: user.Email ?? "",
    Phone: user.Phone ?? "",
    Password: "",
  };
}

export function useUserManagementStore() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUsers = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setUsers([]);
      setErrorMessage(missingConfigMessage);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("id,Username,Email,Phone,created_at,IsDeleted")
      .eq("IsDeleted", false)
      .order("id", { ascending: true });

    if (error) {
      setErrorMessage(error.message);
      setUsers([]);
    } else {
      setUsers(data ?? []);
    }

    setIsLoading(false);
  }, []);

  const createUser = useCallback(async (values) => {
    assertSupabaseConfigured();
    setIsSaving(true);

    try {
      const payload = toPayload(values);
      const password = normalizeAuthPassword(values.Password);
      const authClient = createSupabaseTransientClient();

      if (!authClient) {
        throw new Error(missingConfigMessage);
      }

      const { error: authError } = await authClient.auth.signUp({
        email: payload.Email,
        password,
        options: {
          data: {
            display_name: payload.Username,
            name: payload.Username,
            phone: payload.Phone || "",
            username: normalizeUsername(payload.Username),
          },
        },
      });

      if (authError) throw normalizeSaveError(authError);

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      setUsers((current) => [...current, data]);
      return data;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateUser = useCallback(async (id, values) => {
    assertSupabaseConfigured();
    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({
          ...toPayload(values),
          modified_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setUsers((current) =>
        current.map((user) => (user.id === id ? data : user)),
      );
      return data;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const changeUserPassword = useCallback(async (user, password) => {
    assertSupabaseConfigured();
    setIsSaving(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const signedInEmail = session?.user?.email?.toLowerCase();
      const targetEmail = user?.Email?.toLowerCase();

      if (!signedInEmail || signedInEmail !== targetEmail) {
        throw new Error(
          "Only the signed-in user's password can be changed from this screen. Changing another user's Supabase Auth password needs an Edge Function with service-role access.",
        );
      }

      const { error } = await supabase.auth.updateUser({
        password: normalizeAuthPassword(password),
      });

      if (error) throw error;

      await supabase
        .from(TABLE_NAME)
        .update({
          modified_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const deleteUser = useCallback(async (id) => {
    assertSupabaseConfigured();
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({
        IsDeleted: true,
        modified_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;

    setUsers((current) => current.filter((user) => user.id !== id));
  }, []);

  const deleteUsers = useCallback(async (ids) => {
    assertSupabaseConfigured();
    if (!ids.length) return;

    const { error } = await supabase
      .from(TABLE_NAME)
      .update({
        IsDeleted: true,
        modified_at: new Date().toISOString(),
      })
      .in("id", ids);

    if (error) throw error;

    setUsers((current) => current.filter((user) => !ids.includes(user.id)));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    isSaving,
    errorMessage,
    fetchUsers,
    createUser,
    updateUser,
    changeUserPassword,
    deleteUser,
    deleteUsers,
  };
}
