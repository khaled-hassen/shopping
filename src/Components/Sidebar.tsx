import React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { closeSidebar } from "../utils";
import { useLocation, Link as RouterLink } from "react-router-dom";
import Link from "@mui/joy/Link";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const routes = [
    {
      name: "Home",
      path: "/",
      Icon: HomeRoundedIcon,
    },
    {
      name: "Categories",
      path: "/categories",
      Icon: CategoryRoundedIcon,
    },
  ];

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: {
          xs: "fixed",
          md: "sticky",
        },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={closeSidebar}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography level="title-lg">OneStopMALL</Typography>
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          {routes.map((route) => (
            <ListItem key={route.name}>
              <Link
                component={RouterLink}
                to={route.path}
                sx={{ width: "100%" }}
                underline="none"
              >
                <ListItemButton
                  selected={route.path === location.pathname}
                  sx={{ width: "100%" }}
                >
                  <route.Icon />
                  <ListItemContent>
                    <Typography level="title-sm">{route.name}</Typography>
                  </ListItemContent>
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">Admin</Typography>
        </Box>
        <IconButton size="sm" variant="plain" color="neutral">
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
};

export default Sidebar;
