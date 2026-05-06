import { Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import { Fragment, useState } from "react";

import { Button, GhostSpinner } from "components/ui";

export function SelectedRowsActions({ table }) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const selectedRows = table.getSelectedRowModel().rows;

  const handleDeleteRows = async () => {
    if (!selectedRows.length) return;

    setDeleteLoading(true);

    try {
      await table.options.meta?.deleteRows(selectedRows);
    } catch (error) {
      console.error("Error deleting selected flights:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Transition
      as={Fragment}
      show={table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()}
      enter="transition-all duration-200"
      enterFrom="opacity-0 translate-y-4"
      enterTo="opacity-100 translate-y-0"
      leave="transition-all duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-4"
    >
      <div className="pointer-events-none sticky inset-x-0 bottom-0 z-5 flex items-center justify-end">
        <div className="w-full max-w-xl px-2 py-4 sm:absolute sm:-translate-y-1/2 sm:px-4">
          <div className="pointer-events-auto flex items-center justify-between rounded-lg bg-gray-800 px-3 py-2 font-medium text-gray-100 dark:bg-dark-50 dark:text-dark-900 sm:px-4 sm:py-3">
            <p>
              <span>{selectedRows.length} Selected</span>
              <span className="max-sm:hidden">
                {" "}
                from {table.getCoreRowModel().rows.length}
              </span>
            </p>
            <div className="flex space-x-1.5">
              <Button
                onClick={handleDeleteRows}
                className="w-7 gap-1.5 rounded-full px-3 py-1.5 text-xs-plus sm:w-auto sm:rounded-sm"
                color="error"
                disabled={deleteLoading || selectedRows.length <= 0}
              >
                {deleteLoading ? (
                  <div className="flex size-4 items-center justify-center">
                    <GhostSpinner
                      className="size-3.5 shrink-0 border-2"
                      variant="soft"
                    />
                  </div>
                ) : (
                  <TrashIcon className="size-4 shrink-0" />
                )}
                <span className="max-sm:hidden">Delete</span>
              </Button>
              <Button
                onClick={() => table.resetRowSelection()}
                className="w-7 gap-1.5 rounded-full px-3 py-1.5 text-xs-plus sm:w-auto sm:rounded-sm"
              >
                <span>Cancel</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}

SelectedRowsActions.propTypes = {
  table: PropTypes.object,
};
