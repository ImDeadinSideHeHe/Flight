import {
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useAuthContext } from "app/contexts/auth/context";
import { Page } from "components/shared/Page";
import { Button, Card, GhostSpinner, Input } from "components/ui";
import { isSupabaseConfigured, supabase } from "supabaseClient";
import { normalizeAuthPassword } from "utils/authPassword";
import { normalizeUsername } from "utils/userEmail";
import { ChangePasswordModal } from "./ChangePasswordModal";

const emptyProfile = {
  id: null,
  Username: "",
  Email: "",
  Phone: "",
};

function getFallbackProfile(user) {
  const metadata = user?.raw?.user_metadata || {};
  const displayName =
    metadata.display_name ||
    metadata.name ||
    (user?.name && user.name !== user?.email ? user.name : "");

  return {
    ...emptyProfile,
    Username: displayName,
    Email: user?.email ?? "",
    Phone: metadata.phone || "",
  };
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [values, setValues] = useState(() => getFallbackProfile(user));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      const fallback = getFallbackProfile(user);
      setValues(fallback);
      setErrorMessage("");
      setSuccessMessage("");

      if (!isSupabaseConfigured || !supabase || !user?.email) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase
        .from("User")
        .select("id,Username,Email,Phone")
        .eq("IsDeleted", false)
        .eq("Email", user.email)
        .order("id", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!isMounted) return;

      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setValues((current) => ({
          ...current,
          id: data.id,
          Username: data.Username ?? current.Username,
          Email: data.Email ?? user.email,
          Phone: data.Phone ?? current.Phone,
        }));
      }

      setIsLoading(false);
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const updateField = (field) => (event) => {
    setValues((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.Username.trim()) {
      const message = "Username is required.";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      const message = "Missing Supabase URL or publishable key in .env";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const displayName = values.Username.trim();
      const phone = values.Phone.trim() || null;
      const payload = {
        Username: displayName,
        Email: values.Email || user?.email,
        Phone: phone,
        IsDeleted: false,
        modified_at: new Date().toISOString(),
      };

      const query = values.id
        ? supabase.from("User").update(payload).eq("id", values.id)
        : supabase.from("User").insert(payload);

      const { data, error } = await query.select().single();

      if (error) throw error;

      const { error: authError } = await supabase.auth.updateUser({
        data: {
          display_name: displayName,
          name: displayName,
          phone: phone || "",
          username: normalizeUsername(displayName),
        },
      });

      if (authError) throw authError;

      setValues({
        id: data.id,
        Username: data.Username ?? displayName,
        Email: data.Email ?? payload.Email,
        Phone: data.Phone ?? "",
      });
      setSuccessMessage("Profile updated.");
      toast.success("Profile updated successfully.");
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error("Missing Supabase URL or publishable key in .env");
    }

    const email = user?.email || values.Email;

    if (!email) {
      throw new Error("Unable to verify the signed-in user's email.");
    }

    setIsPasswordSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email,
        password: normalizeAuthPassword(currentPassword),
      });

      if (verifyError) {
        throw new Error("Current password is incorrect.");
      }

      const { error } = await supabase.auth.updateUser({
        password: normalizeAuthPassword(newPassword),
      });

      if (error) throw error;

      setSuccessMessage("Password updated.");
      toast.success("Password updated successfully.");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return (
    <Page title="Profile">
      <div className="px-(--margin-x) py-5">
        <Card className="mx-auto w-full max-w-5xl rounded-lg p-4 sm:p-5">
          <div>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-dark-50">
              General
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-200">
              Update your account settings.
            </p>
          </div>

          <div className="my-5 h-px bg-gray-200 dark:bg-dark-500" />

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Username"
                value={values.Username}
                onChange={updateField("Username")}
                prefix={<UserIcon className="size-4.5" />}
                placeholder="Enter Nickname"
                disabled={isLoading || isSaving}
              />
              <Input
                label="Email"
                value={values.Email}
                prefix={<EnvelopeIcon className="size-4.5" />}
                placeholder="Enter Email"
                readOnly
                disabled
              />
              <Input
                label="Phone Number"
                value={values.Phone}
                onChange={updateField("Phone")}
                prefix={<PhoneIcon className="size-4.5" />}
                placeholder="Phone Number"
                disabled={isLoading || isSaving}
              />
            </div>

            {(errorMessage || successMessage) && (
              <p
                className={
                  errorMessage
                    ? "mt-4 text-sm text-error dark:text-error-light"
                    : "mt-4 text-sm text-success dark:text-success-light"
                }
              >
                {errorMessage || successMessage}
              </p>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outlined"
                className="min-w-[10rem] gap-2"
                onClick={() => setIsPasswordOpen(true)}
                disabled={isLoading || isSaving}
              >
                <LockClosedIcon className="size-4.5" />
                <span>Change Password</span>
              </Button>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  className="min-w-[7rem]"
                  onClick={() => navigate("/flight")}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  className="min-w-[7rem] gap-2"
                  disabled={isLoading || isSaving}
                >
                  {isSaving && (
                    <GhostSpinner variant="soft" className="size-4 border-2" />
                  )}
                  <span>Save</span>
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordOpen}
        isSaving={isPasswordSaving}
        onClose={() => setIsPasswordOpen(false)}
        onSubmit={handleChangePassword}
      />
    </Page>
  );
}
