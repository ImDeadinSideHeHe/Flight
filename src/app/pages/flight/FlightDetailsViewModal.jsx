import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { Fragment } from "react";

import { Button } from "components/ui";
import { useAuthContext } from "app/contexts/auth/context";
import { formatFlightDuration } from "./store";

function formatDateTime(value) {
  if (!value) return "-";

  const date = dayjs(value);

  if (!date.isValid()) return "-";

  return date.format("DD MMM YYYY, hh:mm A");
}

function formatPerson(userId, currentUser) {
  if (!userId) return "-";

  if (currentUser?.id === userId) {
    return currentUser.name || "Current User";
  }

  return userId;
}

function DetailItem({ label, value, mono = false }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-dark-300">
        {label}
      </p>
      <p
        className={
          mono
            ? "mt-1 break-all font-mono text-sm text-gray-800 dark:text-dark-50"
            : "mt-1 text-sm-plus font-medium text-gray-800 dark:text-dark-50"
        }
      >
        {value || "-"}
      </p>
    </div>
  );
}

export function FlightDetailsViewModal({ flight, isOpen, onClose }) {
  const { user } = useAuthContext();
  const duration =
    flight?.Duration?.trim() ||
    formatFlightDuration(flight?.TakeOff_Time, flight?.Landing_Time);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden px-4 py-6 sm:px-5"
        onClose={onClose}
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
          className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 dark:bg-dark-700"
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-dark-500 sm:px-5">
            <DialogTitle
              as="h3"
              className="text-base font-medium text-gray-800 dark:text-dark-50"
            >
              Flight Details
            </DialogTitle>
            <Button
              isIcon
              variant="flat"
              className="size-8 rounded-full"
              onClick={onClose}
            >
              <XMarkIcon className="size-5" />
            </Button>
          </div>

          <div className="space-y-5 p-4 sm:p-5">
            <div className="grid gap-4 rounded-lg border border-gray-200 p-4 dark:border-dark-500 sm:grid-cols-2">
              <DetailItem label="Tail Number" value={flight?.TailNumber} />
              <DetailItem label="Flight ID" value={flight?.FlightID} />
              <DetailItem
                label="Takeoff"
                value={formatDateTime(flight?.TakeOff_Time)}
              />
              <DetailItem
                label="Landing"
                value={formatDateTime(flight?.Landing_Time)}
              />
              <DetailItem label="Duration" value={duration} />
            </div>

            <div className="grid gap-4 rounded-lg border border-gray-200 p-4 dark:border-dark-500 sm:grid-cols-2">
              <DetailItem
                label="Created By"
                value={formatPerson(flight?.Created_By, user)}
                mono={Boolean(flight?.Created_By && flight.Created_By !== user?.id)}
              />
              <DetailItem
                label="Created At"
                value={formatDateTime(flight?.Created_At)}
              />
              <DetailItem
                label="Modified By"
                value={formatPerson(flight?.Modified_By, user)}
                mono={Boolean(
                  flight?.Modified_By && flight.Modified_By !== user?.id,
                )}
              />
              <DetailItem
                label="Modified At"
                value={formatDateTime(flight?.Modified_At)}
              />
            </div>

            <div className="flex justify-end border-t border-gray-200 pt-4 dark:border-dark-500">
              <Button
                type="button"
                color="primary"
                className="h-9 min-w-[7rem]"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </TransitionChild>
      </Dialog>
    </Transition>
  );
}

DetailItem.propTypes = {
  label: PropTypes.string,
  mono: PropTypes.bool,
  value: PropTypes.node,
};

FlightDetailsViewModal.propTypes = {
  flight: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};
