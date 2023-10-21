import React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

interface IProps {}

const NotFound: React.FC<IProps> = () => {
  return (
    <Box sx={{ display: "grid", placeContent: "center", height: "100%" }}>
      <Typography level="h1" sx={{ textAlign: "center" }}>
        404
      </Typography>
      <Typography fontSize={40}>This page is not found</Typography>
    </Box>
  );
};

export default NotFound;
