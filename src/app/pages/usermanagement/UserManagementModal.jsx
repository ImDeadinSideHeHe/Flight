import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { Fragment, useEffect, useState } from "react";

import { Button, GhostSpinner, Input } from "components/ui";
import {
  emptyUserForm,
  getGeneratedUserEmail,
  getUserFormValues,
} from "./store";

export function UserManagementModal({
  isOpen,
  isSaving,
  mode,
  onClose,
  onSubmit,
  user,
}) {
  const [values, setValues] = useState(emptyUserForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValues(getUserFormValues(user));
      setFormError("");
    }
  }, [isOpen, user]);

  const title = mode === "edit" ? "Edit User" : "New User";
  const actionText = mode === "edit" ? "Save Changes" : "Create User";

  const updateUsername = (event) => {
    const username = event.target.value;

    setValues((current) => ({
      ...current,
      Username: username,
      Email: getGeneratedUserEmail(username),
    }));
  };

  const updateField = (field) => (event) => {
    setValues((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.Username.trim()) {
      setFormError("Username is required.");
      return;
    }

    const generatedEmail = getGeneratedUserEmail(values.Username);

    if (!generatedEmail) {
      setFormError("Username must include letters or numbers.");
      return;
    }

    if (mode === "create" && values.Password.trim().length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    setFormError("");
    await onSubmit({
      ...values,
      Email: generatedEmail,
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        onClose={isSaving ? () => {} : onClose}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-gray-900/50 transition-opacity dark:bg-black/40" />
        </TransitionChild>

        <TransitionChild
          as={DialogPanel}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 dark:bg-dark-700"
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-dark-500 sm:px-5">
            <DialogTitle
              as="h3"
              className="text-base font-medium text-gray-800 dark:text-dark-50"
            >
              {title}
            </DialogTitle>
            <Button
              isIcon
              variant="flat"
              className="size-8 rounded-full"
              onClick={onClose}
              disabled={isSaving}
            >
              <XMarkIcon className="size-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Username"
                value={values.Username}
                onChange={updateUsername}
                placeholder="Daniel Tan"
                disabled={isSaving}
              />
              <Input
                label="Email"
                value={values.Email || getGeneratedUserEmail(values.Username)}
                readOnly
                disabled={isSaving}
                classNames={{
                  input:
                    "bg-gray-50 text-gray-500 dark:bg-dark-600 dark:text-dark-200",
                }}
              />
              <Input
                label="Phone"
                value={values.Phone}
                onChange={updateField("Phone")}
                placeholder="+65 9123 4567"
                disabled={isSaving}
              />
              {mode === "create" && (
                <Input
                  label="Password"
                  type="password"
                  value={values.Password}
                  onChange={updateField("Password")}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  disabled={isSaving}
                />
              )}
            </div>

            {formError && (
              <p className="text-sm text-error dark:text-error-light">
                {formError}
              </p>
            )}

            <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4 dark:border-dark-500">
              <Button
                type="button"
                variant="outlined"
                className="h-9 min-w-[7rem]"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                className="h-9 min-w-[8rem] space-x-2"
                disabled={isSaving}
              >
                {isSaving && (
                  <GhostSpinner variant="soft" className="size-4 border-2" />
                )}
                <span>{actionText}</span>
              </Button>
            </div>
          </form>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

UserManagementModal.propTypes = {
  isOpen: PropTypes.bool,
  isSaving: PropTypes.bool,
  mode: PropTypes.oneOf(["create", "edit"]),
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  user: PropTypes.object,
};
