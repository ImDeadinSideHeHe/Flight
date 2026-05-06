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

export function ChangePasswordModal({
  isOpen,
  isSaving,
  onClose,
  onSubmit,
  user,
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setConfirmPassword("");
      setFormError("");
    }
  }, [isOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password.trim().length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setFormError("");
    await onSubmit(password);
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
          className="relative flex w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 dark:bg-dark-700"
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-dark-500 sm:px-5">
            <DialogTitle
              as="h3"
              className="text-base font-medium text-gray-800 dark:text-dark-50"
            >
              Change Password
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
            <div className="rounded-md bg-gray-100 px-3 py-2 text-xs text-gray-600 dark:bg-dark-600 dark:text-dark-200">
              {user?.Email || "-"}
            </div>

            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              autoComplete="new-password"
              disabled={isSaving}
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter password"
              autoComplete="new-password"
              disabled={isSaving}
            />

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
                className="h-9 min-w-[9rem] space-x-2"
                disabled={isSaving}
              >
                {isSaving && (
                  <GhostSpinner variant="soft" className="size-4 border-2" />
                )}
                <span>Change Password</span>
              </Button>
            </div>
          </form>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

ChangePasswordModal.propTypes = {
  isOpen: PropTypes.bool,
  isSaving: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  user: PropTypes.object,
};
