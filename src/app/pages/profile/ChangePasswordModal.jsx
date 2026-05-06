import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { LockClosedIcon, XMarkIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button, GhostSpinner, Input } from "components/ui";

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function ChangePasswordModal({ isOpen, isSaving, onClose, onSubmit }) {
  const [values, setValues] = useState(emptyPasswordForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setValues(emptyPasswordForm);
      setFormError("");
    }
  }, [isOpen]);

  const updateField = (field) => (event) => {
    setValues((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.currentPassword.trim()) {
      const message = "Current password is required.";
      setFormError(message);
      toast.error(message);
      return;
    }

    if (!values.newPassword.trim()) {
      const message = "New password is required.";
      setFormError(message);
      toast.error(message);
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      const message = "New password and confirm password do not match.";
      setFormError(message);
      toast.error(message);
      return;
    }

    try {
      setFormError("");
      await onSubmit(values);
      onClose();
    } catch (error) {
      setFormError(error.message);
      toast.error(error.message);
    }
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
          className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 dark:bg-dark-700"
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
            <Input
              label="Current password"
              type="password"
              value={values.currentPassword}
              onChange={updateField("currentPassword")}
              prefix={<LockClosedIcon className="size-4.5" />}
              autoComplete="current-password"
              disabled={isSaving}
            />
            <Input
              label="New password"
              type="password"
              value={values.newPassword}
              onChange={updateField("newPassword")}
              prefix={<LockClosedIcon className="size-4.5" />}
              autoComplete="new-password"
              disabled={isSaving}
            />
            <Input
              label="Confirm password"
              type="password"
              value={values.confirmPassword}
              onChange={updateField("confirmPassword")}
              prefix={<LockClosedIcon className="size-4.5" />}
              autoComplete="new-password"
              disabled={isSaving}
            />

            {formError && (
              <p
                role="alert"
                className="rounded-sm bg-error/10 px-3 py-2 text-sm text-error dark:bg-error/15 dark:text-error-light"
              >
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
                className="h-9 min-w-[9rem] gap-2"
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
};
