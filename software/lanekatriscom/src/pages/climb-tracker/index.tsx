import React from "react";
import { Link } from "gatsby";
import {
  Box,
  Chip,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { Layout } from "../discs";

function ClimbSessions() {
  return (
    <List>
      <ListItem alignItems="center">
        <Link to={`/climb-tracker/asdf-1234`}>
          <ListItemText primary="Climb Session 2023-01-31" />
        </Link>
      </ListItem>
      {/*<ListItem alignItems="center">*/}
      {/*  <ListItemText primary="Climb Session 2023-01-31" />*/}
      {/*</ListItem>*/}
    </List>
  );
}

export default function ClimbTrackerPage() {
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box p={3}>
          <Link to="/" style={{ textAlign: "center", display: "block" }}>
            Home
          </Link>
          <Typography align="center" variant="h4">
            Climb Tracker <Chip label="Work In Progress" />
          </Typography>
        </Box>
        <Typography variant="subtitle2" align="center">
          Your Sessions
        </Typography>
        <ClimbSessions />
      </Container>
    </Layout>
  );
}
