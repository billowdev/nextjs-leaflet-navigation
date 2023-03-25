import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@material-ui/core";

const Footer = () => (
  <Box>
    <AppBar position="static" elevation={0} component="footer" color="primary" >
      <Toolbar style={{ justifyContent: "center" }}>
        <Typography variant="caption">
          <a href="https://github.com/billowdev">©2023 BillowDev</a>
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit" href="/panel/login">
          เข้าสู่ระบบ (แอดมิน)
        </Button>
      </Toolbar>
    </AppBar>
  </Box>
);

export default Footer;
