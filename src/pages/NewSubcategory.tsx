import React, { useState } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { Card, Grid, Stack } from "@mui/joy";
import Button from "@mui/joy/Button";
import { Add, Delete } from "@mui/icons-material";
import IconButton from "@mui/joy/IconButton";
import { useNavigate, useParams } from "react-router-dom";
import {
  GetSubcategoriesDocument,
  GetSubcategoriesQuery,
  useCreateSubcategoryMutation,
} from "../__generated__/graphql";

interface IProps {}

interface Filter {
  key: string;
  value: string[];
}

const Subcategories: React.FC<IProps> = () => {
  const { id } = useParams();
  const [create, { loading }] = useCreateSubcategoryMutation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [previewImage, setPreviewImage] = useState<string>();

  async function createSubcategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const image = data.get("image");

    await create({
      variables: {
        categoryId: id || "",
        name,
        productTypes,
        filters,
        image,
      },
      update(cache) {
        cache.updateQuery<GetSubcategoriesQuery>(
          {
            query: GetSubcategoriesDocument,
            variables: { categoryId: id || "" },
          },
          (data) => ({
            subcategories: [
              ...(data?.subcategories || []),
              { name, productTypes, filters },
            ],
          }),
        );
      },
    });
    navigate(`/categories/${id}`);
  }

  return (
    <form onSubmit={createSubcategory} style={{ paddingBottom: 100 }}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          py: 4,
          position: "sticky",
          top: -24,
          zIndex: 1,
          background: "black",
        }}
      >
        <Box>
          <Typography level="h2">New Subcategory</Typography>
        </Box>
        <Button color="success" variant="soft" type="submit" loading={loading}>
          Create
        </Button>
      </Stack>

      <Stack spacing={4}>
        <Grid container>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
        </Grid>

        <Grid container>
          <Card size="sm" variant="outlined">
            <img src={previewImage} alt="" style={{ width: 500 }} />
            <input
              type="file"
              name="image"
              required
              onChange={(e: any) => {
                setPreviewImage(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </Card>
        </Grid>

        <Stack spacing={2}>
          <Stack
            spacing={4}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography level="h3">Product types</Typography>
            </Box>
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
            {productTypes.map((_, i) => (
              <Stack key={i} spacing={1} direction="row" alignItems="end">
                <IconButton
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
        </Stack>

        <Stack spacing={2}>
          <Stack
            spacing={4}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography level="h3">Filters</Typography>
            </Box>
            <Box>
              <Button
                variant="outlined"
                startDecorator={<Add />}
                onClick={() =>
                  setFilters([...filters, { key: "", value: [""] }])
                }
              >
                Add
              </Button>
            </Box>
          </Stack>
          <Stack spacing={4}>
            {filters.map((_, i) => (
              <Stack key={i} spacing={10} direction="row" alignItems="start">
                <Stack spacing={1} direction="row" alignItems="end">
                  <IconButton
                    color="danger"
                    onClick={() =>
                      setFilters((val) => val.filter((_, index) => index !== i))
                    }
                  >
                    <Delete />
                  </IconButton>
                  <FormControl>
                    <FormLabel>Filter {i + 1}</FormLabel>
                    <Input
                      required
                      value={filters[i].key}
                      onChange={(e) =>
                        setFilters((val) => {
                          const newFilters = [...val];
                          newFilters[i].key = e.target.value;
                          return newFilters;
                        })
                      }
                    />
                  </FormControl>
                  <IconButton
                    onClick={() =>
                      setFilters((val) => {
                        const newFilters = [...val];
                        newFilters[i].value.push("");
                        return newFilters;
                      })
                    }
                  >
                    <Add />
                  </IconButton>
                </Stack>
                <Stack spacing={2}>
                  {filters[i].value.map((_, j) => (
                    <Stack key={j} spacing={1} direction="row" alignItems="end">
                      <IconButton
                        disabled={filters[i].value.length === 1}
                        color="danger"
                        onClick={() =>
                          setFilters((val) => {
                            const newFilters = [...val];
                            newFilters[i].value = newFilters[i].value.filter(
                              (_, index) => index !== j,
                            );
                            return newFilters;
                          })
                        }
                      >
                        <Delete />
                      </IconButton>
                      <FormControl>
                        <FormLabel>Value {j + 1}</FormLabel>
                        <Input
                          required
                          value={filters[i].value[j]}
                          onChange={(e) =>
                            setFilters((val) => {
                              const newFilters = [...val];
                              newFilters[i].value[j] = e.target.value;
                              return newFilters;
                            })
                          }
                        />
                      </FormControl>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
};

export default Subcategories;
