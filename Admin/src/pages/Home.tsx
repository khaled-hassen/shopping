import React from "react";
import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import Link from "@mui/joy/Link";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { Link as RouterLink } from "react-router-dom";

interface IProps {}

const Categories: React.FC<IProps> = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Breadcrumbs
        size="sm"
        aria-label="breadcrumbs"
        separator={<ChevronRightRoundedIcon fontSize="small" />}
        sx={{ pl: 0 }}
      >
        <Link
          underline="none"
          color="neutral"
          aria-label="Categories"
          component={RouterLink}
          to="/"
        >
          <HomeRoundedIcon />
        </Link>
      </Breadcrumbs>
    </Box>
  );
};

export default Categories;
