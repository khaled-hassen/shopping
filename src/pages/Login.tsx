import React, { useContext } from "react";
import Box from "@mui/joy/Box";
import { Alert, Card, Stack } from "@mui/joy";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { useLoginAdminLazyQuery } from "../__generated__/graphql.ts";
import ReportIcon from "@mui/icons-material/Report";
import Typography from "@mui/joy/Typography";
import { setToken } from "../utils.ts";
import { AuthContext } from "../store/auth.ts";

interface IProps {}

const Login: React.FC<IProps> = () => {
  const [loginAdmin, { loading }] = useLoginAdminLazyQuery();
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const { setLoggedIn } = useContext(AuthContext);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    const { data, error } = await loginAdmin({
      variables: { email, password },
    });
    setLoginError((error?.networkError as any)?.result?.errors?.[0]?.message);
    if (data?.loginAdmin.expires) {
      setToken(data.loginAdmin.value, data?.loginAdmin.expires);
      setLoggedIn(true);
    }
  }

  return (
    <Box sx={{ display: "grid", placeContent: "center", height: "100%" }}>
      <Card variant="soft">
        {!!loginError && (
          <Alert
            sx={{ alignItems: "flex-start" }}
            startDecorator={<ReportIcon />}
            variant="soft"
            color="danger"
          >
            <div>
              <Typography>{loginError}</Typography>
            </div>
          </Alert>
        )}

        <form onSubmit={login}>
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input autoFocus required name="email" type="email" />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input required name="password" type="password" />
            </FormControl>
            <Button type="submit" loading={loading}>
              Login
            </Button>
          </Stack>
        </form>
      </Card>
    </Box>
  );
};

export default Login;
