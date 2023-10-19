import { Card, DialogTitle, Modal, ModalDialog, Stack } from "@mui/joy";
import React, { useState } from "react";
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
  const [previewImage, setPreviewImage] = useState<string>();

  function closeModal() {
    setPreviewImage(undefined);
    onCancel();
  }

  async function createNewCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name")?.toString() || "";
    const image = data.get("image");
    await create({ variables: { name, image } });
    setPreviewImage(undefined);
    onCreated();
  }

  return (
    <Modal open={open} onClose={closeModal}>
      <ModalDialog>
        <DialogTitle>Create new category</DialogTitle>
        <form onSubmit={createNewCategory}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input autoFocus required name="name" />
            </FormControl>
            <Card size="sm" variant="outlined">
              <img
                src={previewImage}
                alt=""
                style={{ width: "100%", objectFit: "contain" }}
              />
              <input
                type="file"
                name="image"
                required
                accept="image/png, image/jpeg"
                onChange={(e: any) => {
                  setPreviewImage(URL.createObjectURL(e.target.files[0]));
                }}
              />
            </Card>
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
