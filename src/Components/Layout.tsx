import React, { useContext } from "react";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import { CssVarsProvider } from "@mui/joy/styles";
import { AuthContext } from "../store/auth.ts";
import Header from "./Header.tsx";
import Sidebar from "./Sidebar.tsx";

interface IProps {
  children: React.ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  const { loggedIn } = useContext(AuthContext);

  return (
    <CssVarsProvider disableTransitionOnChange defaultMode="dark">
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        {loggedIn && (
          <>
            <Header />
            <Sidebar />
          </>
        )}
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: "calc(12px + var(--Header-height))",
              sm: "calc(12px + var(--Header-height))",
              md: 3,
            },
            pb: {
              xs: 2,
              sm: 2,
              md: 3,
            },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
            overflow: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </CssVarsProvider>
  );
};

export default Layout;
