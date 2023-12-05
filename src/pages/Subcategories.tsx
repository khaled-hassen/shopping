import React, { useMemo, useRef, useState } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteSubcategoryMutation,
  useGetSubcategoriesQuery,
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

interface IProps {}

type Order = "asc" | "desc" | "none";

const Subcategories: React.FC<IProps> = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState<Order>("none");
  const [search, setSearch] = useState("");
  const { data, refetch } = useGetSubcategoriesQuery({
    variables: { categoryId: id || "" },
  });

  const subcategories = useMemo(() => {
    if (!data) return [];
    if (data.subcategories === null || data.subcategories === undefined) {
      navigate("/404");
      return [];
    }

    const regex = new RegExp(search, "i");
    const subcategories = data.subcategories.filter((sub) =>
      regex.test(sub.name),
    );

    if (order === "none") return subcategories;
    if (order === "asc")
      return subcategories.sort((a, b) => a.name.localeCompare(b.name));
    return subcategories.sort((a, b) => b.name.localeCompare(a.name));
  }, [data, order, search, navigate]);

  const categoryId = useRef<string | null>();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteSub, { loading }] = useDeleteSubcategoryMutation();

  async function deleteSubcategory() {
    const { data } = await deleteSub({
      variables: { id: categoryId.current || "" },
    });
    if (data?.deleteSubcategory.deleted) await refetch();
    setOpenDeleteModal(false);
    categoryId.current = null;
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
        <Typography level="h2">Subcategories</Typography>
      </Box>

      <DeleteItemModal
        text="Are you sure you want to delete this subcategory?"
        loading={loading}
        open={openDeleteModal}
        onConfirm={deleteSubcategory}
        onCancel={() => {
          setOpenDeleteModal(false);
          categoryId.current = null;
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
          <Button onClick={() => navigate(`/subcategory/${id}/new`)}>
            Create new subcategory
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
                  Name
                </Link>
              </th>
              <th style={{ padding: "12px 16px" }}>Image</th>
              <th style={{ padding: "12px 16px" }}>Number of filters</th>
              <th style={{ padding: "12px 16px" }}>Number of product types</th>
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
            {subcategories.map((cat) => (
              <tr key={cat.id}>
                <td style={{ padding: "12px 16px" }}>
                  <Typography level="body-xs">{cat.name}</Typography>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <img
                    src={cat.image || ""}
                    alt={cat.name}
                    height={60}
                    width={90}
                    style={{ objectFit: "contain" }}
                  />
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <Typography level="body-xs">
                    {cat.filters?.length || 0}
                  </Typography>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <Typography level="body-xs">
                    {cat.productTypes?.length || 0}
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
                      <Button
                        color="primary"
                        onClick={() => navigate(`/subcategory/${cat.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        onClick={() => {
                          setOpenDeleteModal(true);
                          categoryId.current = cat.id;
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

export default Subcategories;
