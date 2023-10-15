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
  text: string;
  onConfirm(): void;
  onCancel(): void;
}

const DeleteItemModal: React.FC<IProps> = ({
  open,
  loading,
  text,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal open={open} onClose={onCancel}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>Delete confirmation</DialogTitle>
        <Divider />
        <DialogContent>{text}</DialogContent>
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

export default DeleteItemModal;
