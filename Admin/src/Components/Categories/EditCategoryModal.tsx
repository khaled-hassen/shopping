import { DialogTitle, Modal, ModalDialog, Stack } from "@mui/joy";
import React from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";

interface IProps {
  open: boolean;
  loading: boolean;
  onUpdate(newName: string): void;
  onCancel(): void;
}

const EditCategoryModal: React.FC<IProps> = ({
  open,
  loading,
  onUpdate,
  onCancel,
}) => {
  return (
    <Modal open={open} onClose={onCancel}>
      <ModalDialog>
        <DialogTitle>Create category name</DialogTitle>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            onUpdate(data.get("name")?.toString() || "");
          }}
        >
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>New name</FormLabel>
              <Input autoFocus required name="name" />
            </FormControl>
            <Button type="submit" loading={loading}>
              Update
            </Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default EditCategoryModal;
