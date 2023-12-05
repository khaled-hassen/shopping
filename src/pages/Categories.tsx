import React, { useMemo, useState } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import { useNavigate } from "react-router-dom";
import {
  GetCategoriesQuery,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "../__generated__/graphql.ts";
import { ButtonGroup, Stack } from "@mui/joy";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Link from "@mui/joy/Link";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteItemModal from "../Components/DeleteItemModal.tsx";
import CreateCategoryModal from "../Components/Categories/CreateCategoryModal.tsx";
import EditCategoryModal from "../Components/Categories/EditCategoryModal.tsx";

interface IProps {}

type Order = "asc" | "desc" | "none";

const Categories: React.FC<IProps> = () => {
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order>("none");
  const [search, setSearch] = useState("");
  const { data, refetch } = useGetCategoriesQuery();
  const [deleteCat, { loading: deleteLoading }] = useDeleteCategoryMutation();

  const categories = useMemo(() => {
    if (!data) return [];
    const regex = new RegExp(search, "i");
    const categories = data.categories.filter((cat) => regex.test(cat.name));

    if (order === "none") return categories;
    if (order === "asc")
      return categories.sort((a, b) => a.name.localeCompare(b.name));
    return categories.sort((a, b) => b.name.localeCompare(a.name));
  }, [data, order, search]);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [category, setCategory] = useState<
    GetCategoriesQuery["categories"][number] | null
  >(null);

  async function deleteCategory() {
    const { data } = await deleteCat({
      variables: { id: category?.id || "" },
    });
    if (data?.deleteCategory.deleted) await refetch();
    setOpenDeleteModal(false);
    setCategory(null);
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          my: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h2">Categories</Typography>
      </Box>

      <DeleteItemModal
        text="Are you sure you want to delete this category?"
        loading={deleteLoading}
        open={openDeleteModal}
        onConfirm={deleteCategory}
        onCancel={() => {
          setOpenDeleteModal(false);
          setCategory(null);
        }}
      />

      <EditCategoryModal
        category={category}
        open={openEditModal}
        onClose={() => {
          setOpenEditModal(false);
          setCategory(null);
        }}
      />

      <CreateCategoryModal
        open={openCreateModal}
        onCancel={() => setOpenCreateModal(false)}
        onCreated={async () => {
          setOpenCreateModal(false);
          await refetch();
        }}
      />

      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: {
              xs: "120px",
              md: "160px",
            },
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="end"
          spacing={2}
          sx={{ width: "100%" }}
        >
          <FormControl size="sm">
            <FormLabel>Search</FormLabel>
            <Input
              size="sm"
              placeholder="Search"
              startDecorator={<SearchIcon />}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FormControl>
          <Button onClick={() => setOpenCreateModal(true)}>
            Create new category
          </Button>
        </Stack>
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
          style={{ minWidth: 500 }}
        >
          <thead>
            <tr>
              <th style={{ padding: "12px 16px" }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                  fontWeight="lg"
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    "& svg": {
                      transition: "0.2s",
                      transform:
                        order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                    },
                  }}
                >
                  Category name
                </Link>
              </th>
              <th style={{ padding: "12px 16px" }}>Image</th>
              <th style={{ padding: "12px 16px" }}>Number of subcategories</th>
              <th style={{ padding: "12px 16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    paddingRight: 10,
                  }}
                >
                  Actions
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td style={{ padding: "12px 16px" }}>
                  <Typography level="body-xs">{cat.name}</Typography>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    height={60}
                    width={90}
                    style={{ objectFit: "contain" }}
                  />
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <Typography level="body-xs">
                    {cat.subcategoriesIds.length}
                  </Typography>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      justifyContent: "end",
                    }}
                  >
                    <ButtonGroup variant="soft">
                      <Button onClick={() => navigate(`/categories/${cat.id}`)}>
                        View
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => {
                          setOpenEditModal(true);
                          setCategory(cat);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        onClick={() => {
                          setOpenDeleteModal(true);
                          setCategory(cat);
                        }}
                      >
                        Delete
                      </Button>
                    </ButtonGroup>
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </>
  );
};

export default Categories;
