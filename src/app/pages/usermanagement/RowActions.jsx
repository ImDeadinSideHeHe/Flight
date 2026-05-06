import { KeyIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCallback, useState } from "react";
import PropTypes from "prop-types";

import { Button } from "components/ui";
import { ConfirmModal } from "components/shared/ConfirmModal";

const confirmMessages = {
  pending: {
    description:
      "Are you sure you want to delete this user record? Once deleted, it cannot be restored.",
  },
  success: {
    title: "User Deleted",
    description: "The user record has been removed.",
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
      console.error("Error deleting user:", error);
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
          className="size-8 rounded-full"
          title="Edit user"
          onClick={() => table.options.meta?.openEditModal(row.original)}
        >
          <PencilIcon className="size-4" />
        </Button>

        <Button
          isIcon
          variant="flat"
          className="size-8 rounded-full"
          title="Change password"
          onClick={() =>
            table.options.meta?.openChangePasswordModal(row.original)
          }
        >
          <KeyIcon className="size-4" />
        </Button>

        <Button
          isIcon
          color="error"
          variant="flat"
          className="size-8 rounded-full"
          title="Delete user"
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
