import { Alert, Card, DialogTitle, Modal, ModalDialog, Stack } from "@mui/joy";
import React, { useState } from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import ReportIcon from "@mui/icons-material/Report";
import { useCreateNewCategoryMutation } from "../../__generated__/graphql.ts";
import Typography from "@mui/joy/Typography";

interface IProps {
  open: boolean;
  onCreated(): void;
  onCancel(): void;
}

const EditCategoryModal: React.FC<IProps> = ({ open, onCreated, onCancel }) => {
  const [create, { loading }] = useCreateNewCategoryMutation();
  const [previewImage, setPreviewImage] = useState<string>();
  const [errors, setErrors] = useState<MutationErrors>([]);

  function closeModal() {
    setPreviewImage(undefined);
    onCancel();
  }

  async function createNewCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString() || "";
    const image = formData.get("image");
    const { data } = await create({ variables: { name, image } });
    if (data?.createCategory.errors?.length) {
      setErrors(data.createCategory.errors);
      return;
    }
    setPreviewImage(undefined);
    onCreated();
  }

  return (
    <Modal open={open} onClose={closeModal}>
      <ModalDialog>
        <DialogTitle>Create new category</DialogTitle>
        {!!errors.length && (
          <Alert
            sx={{ alignItems: "flex-start" }}
            startDecorator={<ReportIcon />}
            variant="soft"
            color="danger"
          >
            <div>
              <Typography>Error</Typography>
              {errors.map((error, i) => (
                <Typography key={i} level="body-sm" color="danger">
                  {error.message}
                </Typography>
              ))}
            </div>
          </Alert>
        )}
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
