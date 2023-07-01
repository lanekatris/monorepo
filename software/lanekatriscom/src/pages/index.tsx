import React from "react";
import {
  Box,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Typography,
  List,
  ListItem,
  Chip,
} from "@mui/material";
import { StaticImage } from "gatsby-plugin-image";
import { Link } from "gatsby-theme-material-ui";
import {Layout} from "./layout";

export const darkTheme = createTheme({
  palette: {
    mode: "light",
  },
});

const links = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/lane-katris-80610a44/",
  },
  {
    name: "Resume",
    url: "https://gitconnected.com/lanekatris",
  },
  {
    name: "GitHub",
    url: "https://github.com/lanekatris",
  },
  {
    name: "Blog",
    url: "https://publish.obsidian.md/lanekatris/Public/Welcome",
  },
];

const projects = [
  { name: "Admin Login", url: "/login" },
  // {
  //   name: "Discs",
  //   url: "/discs",
  // },
  {
    name: "Climb Tracker",
    url: "/climb-tracker",
  },
];

const IndexPage = () => {
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box p={4}>
          <Typography variant="h4" align="center">
            👋 I'm Lane Katris
          </Typography>
        </Box>
        <StaticImage
          src="../images/20200914_075551_ypTl0lyqb.jpg"
          alt="Me on Grays Peak"
        />
        <Box p={4}>
          <Typography variant="h6">
            I'm a senior full stack engineer at{" "}
            <Link to="https://www.linkedin.com/company/hd-supply/">
              HD Supply
            </Link>{" "}
            who enjoys climbing, disc golf, and team sports
          </Typography>
          <List>
            {links.map(({ name, url }, index) => (
              <ListItem disablePadding key={index}>
                <Link to={url}>{name}</Link>
              </ListItem>
            ))}
          </List>
          <Typography variant="h6">Projects</Typography>
          <List>
            {projects.map(({ name, url }, index) => (
              <ListItem disablePadding key={index}>
                <Link to={url}>{name}</Link>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <img
            alt="Netlify Build Status"
            src="https://api.netlify.com/api/v1/badges/bea7f86c-75aa-4540-b941-273d0f244c3c/deploy-status"
          />
        </Box>
      </Container>
    </Layout>
  );
};

export default IndexPage;