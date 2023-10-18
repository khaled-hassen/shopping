import { DialogTitle, Modal, ModalDialog, Stack } from "@mui/joy";
import React from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { useCreateNewCategoryMutation } from "../../__generated__/graphql.ts";

interface IProps {
  open: boolean;
  onCreated(): void;
  onCancel(): void;
}

const EditCategoryModal: React.FC<IProps> = ({ open, onCreated, onCancel }) => {
  const [create, { loading }] = useCreateNewCategoryMutation();

  async function createNewCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name")?.toString() || "";
    await create({ variables: { name } });
    onCreated();
  }

  return (
    <Modal open={open} onClose={onCancel}>
      <ModalDialog>
        <DialogTitle>Create new category</DialogTitle>
        <form onSubmit={createNewCategory}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input autoFocus required name="name" />
            </FormControl>
            <Button type="submit" loading={loading}>
              Create
            </Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default EditCategoryModal;
