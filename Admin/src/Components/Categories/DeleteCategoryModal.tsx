import React from "react";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
} from "@mui/joy";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";

interface IProps {
  open: boolean;
  loading: boolean;
  onConfirm(): void;
  onCancel(): void;
}

const DeleteCategoryModal: React.FC<IProps> = ({
  open,
  loading,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal open={open} onClose={onCancel}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>Delete confirmation</DialogTitle>
        <Divider />
        <DialogContent>
          Are you sure you want to delete this category?
        </DialogContent>
        <DialogActions>
          <Button
            variant="solid"
            color="danger"
            onClick={onConfirm}
            loading={loading}
          >
            Delete
          </Button>
          <Button variant="plain" color="neutral" onClick={onCancel}>
            Cancel
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default DeleteCategoryModal;
