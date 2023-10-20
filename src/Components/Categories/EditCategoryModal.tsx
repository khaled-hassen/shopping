import { Alert, Card, DialogTitle, Modal, ModalDialog, Stack } from "@mui/joy";
import React, { useState } from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import {
  GetCategoriesDocument,
  GetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../__generated__/graphql.ts";
import ReportIcon from "@mui/icons-material/Report";
import Typography from "@mui/joy/Typography";

interface IProps {
  category: GetCategoriesQuery["categories"][number] | null;
  open: boolean;
  onClose(): void;
}

const EditCategoryModal: React.FC<IProps> = ({ category, open, onClose }) => {
  const [previewImage, setPreviewImage] = useState<string>();
  const [updateCat, { loading }] = useUpdateCategoryMutation();
  const [errors, setErrors] = useState<MutationErrors>([]);

  async function updateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name")?.toString() || "";
    const image = formData.get("image") as File | null;
    const file = !image || image.size === 0 ? null : image;

    const { data } = await updateCat({
      variables: { id: category?.id || "", name, image: file },
      update(cache, { data }) {
        if (data?.updateCategory.errors?.length) return;
        cache.updateQuery<GetCategoriesQuery>(
          {
            query: GetCategoriesDocument,
          },
          (data) => ({
            categories: (data?.categories || []).map((cat) => {
              if (cat.id === category?.id) {
                const image = file ? URL.createObjectURL(file) : cat.image;
                return { ...cat, name, image };
              }
              return cat;
            }),
          }),
        );
      },
    });

    if (data?.updateCategory.errors?.length) {
      setErrors(data.updateCategory.errors);
      return;
    }

    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>Update category name</DialogTitle>
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
        <form onSubmit={updateCategory}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>New name</FormLabel>
              <Input
                autoFocus
                required
                defaultValue={category?.name}
                name="name"
              />
            </FormControl>
            <Card size="sm" variant="outlined">
              <img
                src={previewImage || category?.image}
                alt=""
                style={{ width: "100%", objectFit: "contain" }}
              />
              <input
                type="file"
                name="image"
                accept="image/png, image/jpeg"
                onChange={(e: any) => {
                  setPreviewImage(URL.createObjectURL(e.target.files[0]));
                }}
              />
            </Card>
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
