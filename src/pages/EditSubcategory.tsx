import React, { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { Alert, Card, Checkbox, Grid, Option, Select, Stack } from "@mui/joy";
import Button from "@mui/joy/Button";
import { Add, Delete } from "@mui/icons-material";
import IconButton from "@mui/joy/IconButton";
import { useNavigate, useParams } from "react-router-dom";
import {
  FilterInput,
  FilterType,
  GetSubcategoriesDocument,
  GetSubcategoriesQuery,
  useGetSubcategoryQuery,
  useUpdateSubcategoryMutation,
} from "../__generated__/graphql.ts";
import ReportIcon from "@mui/icons-material/Report";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";

interface IProps {}

const EditSubcategory: React.FC<IProps> = () => {
  const [name, setName] = useState("");
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterInput[]>([]);
  const [previewImage, setPreviewImage] = useState<string>();

  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useGetSubcategoryQuery({ variables: { id: id || "" } });
  const [update, { loading }] = useUpdateSubcategoryMutation();
  const [errors, setErrors] = useState<MutationErrors>([]);

  useEffect(() => {
    if (!data) return;
    const { subcategory } = data;
    if (subcategory === null || subcategory === undefined) {
      navigate("/404");
      return;
    }

    setName(subcategory.name);
    setProductTypes(subcategory.productTypes || []);
    setFilters(
      (subcategory.filters || []).map((f) => ({
        unit: f.unit,
        type: f.type,
        name: f.name,
        productTypes: f.productTypes,
      })),
    );
    setPreviewImage(subcategory.image || "");
  }, [data, navigate]);

  async function createSubcategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const image = formData.get("image") as File | null;
    const file = !image || image.size === 0 ? null : image;

    const { data: response } = await update({
      variables: { id: id || "", name, filters, productTypes, image: file },
      update(cache, { data: response }) {
        const updateSubcategoryErrors =
          response?.updateSubcategory.errors || [];
        const updateProductTypesErrors =
          response?.updateSubcategoryProductTypes.errors || [];
        const updateFiltersErrors =
          response?.updateSubcategoryFilters.errors || [];
        if (
          updateSubcategoryErrors.length ||
          updateProductTypesErrors.length ||
          updateFiltersErrors.length
        )
          return;

        cache.updateQuery<GetSubcategoriesQuery>(
          {
            query: GetSubcategoriesDocument,
            variables: { categoryId: data?.subcategory?.categoryId },
          },
          (data) => ({
            subcategories:
              data?.subcategories?.map((sub) => {
                if (sub.id === id) {
                  const image = file ? URL.createObjectURL(file) : sub.image;
                  return { ...sub, name, filters, productTypes, image };
                }
                return sub;
              }) || [],
          }),
        );
      },
    });

    const updateSubcategoryErrors = response?.updateSubcategory.errors || [];
    const updateProductTypesErrors =
      response?.updateSubcategoryProductTypes.errors || [];
    const updateFiltersErrors = response?.updateSubcategoryFilters.errors || [];
    if (
      updateSubcategoryErrors.length ||
      updateProductTypesErrors.length ||
      updateFiltersErrors.length
    ) {
      setErrors([
        ...updateSubcategoryErrors,
        ...updateProductTypesErrors,
        ...updateFiltersErrors,
      ]);
      return;
    }

    navigate(`/categories/${data?.subcategory?.categoryId}`);
  }

  return (
    <form onSubmit={createSubcategory} style={{ paddingBottom: 100 }}>
      <Stack
        spacing={2}
        justifyContent="space-between"
        sx={{
          py: 4,
          position: "sticky",
          top: -24,
          zIndex: 10,
          background: "black",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography level="h2">Edit Subcategory</Typography>
          </Box>
          <Button
            color="success"
            variant="soft"
            type="submit"
            loading={loading}
          >
            Save changes
          </Button>
        </Stack>
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
      </Stack>

      <Stack spacing={4}>
        <Grid container>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
        </Grid>

        <Grid container>
          <Card size="sm" variant="outlined">
            <img
              src={previewImage}
              alt=""
              style={{ width: 500, objectFit: "contain" }}
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
        </Grid>

        <Stack spacing={2}>
          <Box>
            <Typography level="h3">Product types</Typography>
          </Box>
          <Stack spacing={2}>
            {productTypes.map((_, i) => (
              <Stack key={i} spacing={1} direction="row" alignItems="end">
                <IconButton
                  disabled={productTypes.length === 1}
                  color="danger"
                  onClick={() =>
                    setProductTypes((val) =>
                      val.filter((_, index) => index !== i),
                    )
                  }
                >
                  <Delete />
                </IconButton>
                <FormControl>
                  <FormLabel>Type {i + 1}</FormLabel>
                  <Input
                    required
                    value={productTypes[i]}
                    onChange={(e) =>
                      setProductTypes((val) => {
                        const newProductTypes = [...val];
                        newProductTypes[i] = e.target.value;
                        return newProductTypes;
                      })
                    }
                  />
                </FormControl>
              </Stack>
            ))}
          </Stack>
          <Box>
            <Button
              variant="outlined"
              startDecorator={<Add />}
              onClick={() => setProductTypes([...productTypes, ""])}
            >
              Add
            </Button>
          </Box>
        </Stack>

        <Stack spacing={2}>
          <Box>
            <Typography level="h3">Filters</Typography>
          </Box>
          <Stack spacing={4}>
            {filters.map((_, i) => (
              <Stack key={i} spacing={2}>
                <Stack key={i} spacing={1} direction="row" alignItems="end">
                  <IconButton
                    disabled={filters.length === 1}
                    color="danger"
                    onClick={() =>
                      setFilters((val) => val.filter((_, index) => index !== i))
                    }
                  >
                    <Delete />
                  </IconButton>
                  <FormControl>
                    <FormLabel>Type</FormLabel>
                    <Select
                      value={filters[i].type}
                      required
                      onChange={(_, value) =>
                        setFilters((val) => {
                          const newFilters = [...val];
                          newFilters[i].type = value || FilterType.String;
                          return newFilters;
                        })
                      }
                    >
                      <Option value={FilterType.String}>String</Option>
                      <Option value={FilterType.Number}>Number</Option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      required
                      value={filters[i].name}
                      onChange={(e) =>
                        setFilters((val) => {
                          const newFilters = [...val];
                          newFilters[i].name = e.target.value;
                          return newFilters;
                        })
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Unit</FormLabel>
                    <Input
                      value={filters[i].unit}
                      onChange={(e) =>
                        setFilters((val) => {
                          const newFilters = [...val];
                          newFilters[i].unit = e.target.value;
                          return newFilters;
                        })
                      }
                    />
                  </FormControl>
                </Stack>
                <Stack spacing={1}>
                  <Typography fontSize={18}>
                    Product types with this filter:
                  </Typography>
                  <List
                    sx={{ "--List-gap": "8px" }}
                    orientation="horizontal"
                    wrap
                  >
                    {productTypes
                      .filter((p) => !!p)
                      .map((item) => (
                        <ListItem key={item}>
                          <Checkbox
                            overlay
                            disableIcon
                            variant="soft"
                            label={item}
                            checked={filters[i].productTypes.includes(item)}
                            onChange={(event) =>
                              setFilters((val) => {
                                const newFilters = [...val];
                                const checked = event.target.checked;
                                if (checked)
                                  newFilters[i].productTypes.push(item);
                                else {
                                  newFilters[i].productTypes = newFilters[
                                    i
                                  ].productTypes.filter((p) => p !== item);
                                }
                                return newFilters;
                              })
                            }
                          />
                        </ListItem>
                      ))}
                  </List>
                </Stack>
              </Stack>
            ))}
          </Stack>
          <Box>
            <Button
              variant="outlined"
              startDecorator={<Add />}
              onClick={() =>
                setFilters([
                  ...filters,
                  {
                    name: "",
                    type: FilterType.String,
                    unit: "",
                    productTypes: [],
                  },
                ])
              }
            >
              Add
            </Button>
          </Box>
        </Stack>
      </Stack>
    </form>
  );
};

export default EditSubcategory;
