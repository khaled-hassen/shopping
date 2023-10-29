import React, { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import {
  Alert,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import ReportIcon from "@mui/icons-material/Report";
import {
  useGetConfigQuery,
  useUpdateConfigMutation,
} from "../__generated__/graphql.ts";

interface IProps {}

const Config: React.FC<IProps> = () => {
  const [config, setConfig] = useState({
    homeHeroCategoryId: "",
    heroCategoryId: "",
    heroTitle: "",
    heroSubtitle: "",
    heroBgColor: "",
    heroActionBgColor: "",
  });
  const [errors, setErrors] = useState<MutationErrors>([]);
  const { data } = useGetConfigQuery();
  const [update, { loading }] = useUpdateConfigMutation();
  async function updateConfig(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { data } = await update({ variables: config });
    setErrors(data?.updateConfig.errors || []);
  }

  useEffect(() => {
    if (!data?.config) return;
    setConfig(data.config);
  }, [data]);

  return (
    <form onSubmit={updateConfig} style={{ paddingBottom: 100 }}>
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
            <Typography level="h2">Edit config</Typography>
          </Box>
          <Button
            color="success"
            variant="soft"
            type="submit"
            loading={loading}
          >
            Save
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
        <Stack spacing={2}>
          <Typography fontSize={24} fontWeight={500}>
            Home page
          </Typography>
          <Stack spacing={2}>
            <Grid container>
              <FormControl>
                <FormLabel>Home hero category</FormLabel>
                <Select
                  required
                  sx={{ width: 240 }}
                  placeholder="Select a category"
                  value={config.homeHeroCategoryId}
                  onChange={(_, value) =>
                    setConfig((c) => ({
                      ...c,
                      homeHeroCategoryId: value || "",
                    }))
                  }
                >
                  {data?.categories.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Stack>
        </Stack>

        <Stack spacing={2}>
          <Typography fontSize={24} fontWeight={500}>
            Categories page
          </Typography>
          <Stack spacing={2}>
            <Grid container>
              <FormControl>
                <FormLabel>Hero category</FormLabel>
                <Select
                  required
                  sx={{ width: 240 }}
                  placeholder="Select a category"
                  value={config.heroCategoryId}
                  onChange={(_, value) =>
                    setConfig((c) => ({ ...c, heroCategoryId: value || "" }))
                  }
                >
                  {data?.categories.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Stack spacing={3} direction="row">
              <FormControl>
                <FormLabel>Hero title</FormLabel>
                <Input
                  required
                  value={config.heroTitle}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, heroTitle: e.target.value }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Hero subtitle</FormLabel>
                <Input
                  required
                  value={config.heroSubtitle}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, heroSubtitle: e.target.value }))
                  }
                />
              </FormControl>
            </Stack>
            <Stack spacing={3} direction="row">
              <FormControl>
                <FormLabel>Hero background color</FormLabel>
                <Input
                  required
                  value={config.heroBgColor}
                  onChange={(e) =>
                    setConfig((c) => ({ ...c, heroBgColor: e.target.value }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Hero action background color</FormLabel>
                <Input
                  required
                  value={config.heroActionBgColor}
                  onChange={(e) =>
                    setConfig((c) => ({
                      ...c,
                      heroActionBgColor: e.target.value,
                    }))
                  }
                />
              </FormControl>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
};

export default Config;
