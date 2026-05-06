import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import PropTypes from "prop-types";

import { ConfirmModal } from "components/shared/ConfirmModal";
import { Button } from "components/ui";

const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to delete this flight? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Flight Deleted",
    description: "The flight record has been removed.",
  },
};

export function RowActions({ row, table }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const closeModal = () => setDeleteModalOpen(false);

  const openModal = () => {
    setDeleteModalOpen(true);
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const handleDeleteRow = useCallback(async () => {
    setConfirmDeleteLoading(true);

    try {
      await table.options.meta?.deleteRow(row);
      setDeleteSuccess(true);
    } catch (error) {
      console.error("Error deleting flight:", error);
      setDeleteError(true);
    } finally {
      setConfirmDeleteLoading(false);
    }
  }, [row, table]);

  const state = deleteError ? "error" : deleteSuccess ? "success" : "pending";

  return (
    <>
      <div className="flex justify-start space-x-1.5">
        <Button
          isIcon
          variant="flat"
          className="size-8 rounded-full"
          title="View flight details"
          onClick={() => table.options.meta?.openViewModal(row.original)}
        >
          <EyeIcon className="size-4" />
        </Button>

        <Button
          isIcon
          className="size-8 rounded-full"
          title="Edit flight"
          onClick={() => table.options.meta?.openEditModal(row.original)}
        >
          <PencilIcon className="size-4" />
        </Button>

        <Button
          isIcon
          color="error"
          variant="flat"
          className="size-8 rounded-full"
          title="Delete flight"
          onClick={openModal}
        >
          <TrashIcon className="size-4" />
        </Button>
      </div>

      <ConfirmModal
        show={deleteModalOpen}
        onClose={closeModal}
        messages={confirmMessages}
        onOk={handleDeleteRow}
        confirmLoading={confirmDeleteLoading}
        state={state}
      />
    </>
  );
}

RowActions.propTypes = {
  row: PropTypes.object,
  table: PropTypes.object,
};
