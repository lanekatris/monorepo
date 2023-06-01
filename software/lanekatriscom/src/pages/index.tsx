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
import FitnessGoals from "../fitness/fitness-goals";
import { Layout } from "./discs";
import { graphql } from "gatsby";
import { GetGoalLogsResult, Goal } from "../gql/generated";

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
    url: "/blog",
  },
];

const projects = [
  { name: "Admin Login", url: "/login" },
  {
    name: "Discs",
    url: "/discs",
  },
  {
    name: "Climb Tracker",
    url: "/climb-tracker",
  },
];

const IndexPage = ({
  data,
}: {
  data: {
    lkat: {
      goals: Goal[];
      goalLog: GetGoalLogsResult;
    };
  };
}) => {
  console.log("index d", data);

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
          <FitnessGoals goals={data.lkat.goals} goalLog={data.lkat.goalLog} />
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
export const pageQuery = graphql`
  query {
    lkat {
      goals {
        id
        created
        type
        frequency
        targetCount
        tags
        name
      }
      goalLog(input: { start: "2023-01-22T03:00:00Z" }) {
        __typename
        entries {
          weekName
          completed
          completedGoalCount
          uncompleteGoalCount
          goalCount
          isThisWeek
        }
        totalWeeksCompleted
        totalWeeksUncompleted
      }
    }
  }
`;
