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
  emptyFlightForm,
  formatFlightDuration,
  getFlightFormValues,
} from "./store";

export function FlightDetailsModal({
  flight,
  isOpen,
  isSaving,
  mode,
  onClose,
  onSubmit,
}) {
  const [values, setValues] = useState(emptyFlightForm);
  const [formError, setFormError] = useState("");
  const [isDurationManual, setIsDurationManual] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const formValues = getFlightFormValues(flight);
      const autoDuration = formatFlightDuration(
        formValues.TakeOff_Time,
        formValues.Landing_Time,
      );
      const savedDuration = formValues.Duration.trim();

      setValues({
        ...formValues,
        Duration: savedDuration || (autoDuration === "-" ? "" : autoDuration),
      });
      setIsDurationManual(
        Boolean(savedDuration && savedDuration !== autoDuration),
      );
      setFormError("");
    }
  }, [flight, isOpen]);

  const title = mode === "edit" ? "Edit Flight" : "New Flight";
  const actionText = mode === "edit" ? "Save Changes" : "Create Flight";
  const autoDuration = formatFlightDuration(
    values.TakeOff_Time,
    values.Landing_Time,
  );
  const durationPlaceholder =
    autoDuration === "-" ? "Enter duration" : autoDuration;

  const updateField = (field) => (event) => {
    const nextValue = event.target.value;

    setValues((current) => {
      const nextValues = {
        ...current,
        [field]: nextValue,
      };

      if (
        !isDurationManual &&
        (field === "TakeOff_Time" || field === "Landing_Time")
      ) {
        const nextDuration = formatFlightDuration(
          nextValues.TakeOff_Time,
          nextValues.Landing_Time,
        );

        nextValues.Duration = nextDuration === "-" ? "" : nextDuration;
      }

      return nextValues;
    });
  };

  const updateDuration = (event) => {
    setIsDurationManual(true);
    setValues((current) => ({
      ...current,
      Duration: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!values.TailNumber.trim() || !values.FlightID.trim()) {
      setFormError("Tail number and flight ID are required.");
      return;
    }

    if (values.TakeOff_Time && values.Landing_Time && autoDuration === "-") {
      setFormError("Landing time must be after takeoff time.");
      return;
    }

    setFormError("");
    await onSubmit(values);
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
                label="Tail Number"
                value={values.TailNumber}
                onChange={updateField("TailNumber")}
                disabled={isSaving}
              />
              <Input
                label="Flight ID"
                value={values.FlightID}
                onChange={updateField("FlightID")}
                disabled={isSaving}
              />
              <Input
                label="Takeoff Time"
                type="datetime-local"
                value={values.TakeOff_Time}
                onChange={updateField("TakeOff_Time")}
                disabled={isSaving}
              />
              <Input
                label="Landing Time"
                type="datetime-local"
                value={values.Landing_Time}
                onChange={updateField("Landing_Time")}
                disabled={isSaving}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Duration"
                  value={values.Duration}
                  onChange={updateDuration}
                  placeholder={durationPlaceholder}
                  disabled={isSaving}
                />
              </div>
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

FlightDetailsModal.propTypes = {
  flight: PropTypes.object,
  isOpen: PropTypes.bool,
  isSaving: PropTypes.bool,
  mode: PropTypes.oneOf(["create", "edit"]),
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};
