import React, { useMemo } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Fab,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { darkTheme } from "./index";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import DiscList from "../dg/disc-list";
import { Link } from "gatsby";
import { Add } from "@mui/icons-material";
import { navigate } from "gatsby-link";

// export const client = new ApolloClient({
//   uri: "http://localhost:5298/graphql",
//   cache: new InMemoryCache(),
// });

interface Children {
  children: JSX.Element;
}

export function Layout({ children }: Children) {
  return (
    <ThemeProvider theme={darkTheme}>
      {/*@ts-ignore*/}
      <GlobalActions>
        <CssBaseline />
        {children}
        {/*<Container maxWidth="sm"></Container>*/}
      </GlobalActions>
    </ThemeProvider>
  );
}

export function GlobalActions({ children }: Children) {
  const token = useMemo(() => {
    if (typeof window === "undefined") return;
    return window.localStorage.getItem("token");
  }, []);
  return (
    <Box>
      {children}
      {token && (
        <Fab
          color="primary"
          sx={{ position: "fixed", right: "20px", bottom: "20px" }}
          onClick={() => navigate("/fitness-activity/create")}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
}

export default function DiscsPage() {
  return (
    // <ApolloProvider client={client}>
    // <ThemeProvider theme={darkTheme}>
    //   <CssBaseline />
    //
    //   <Container maxWidth="sm">
    <Layout>
      <Container maxWidth="sm">
        <Box p={3}>
          <Link to="/" style={{ textAlign: "center", display: "block" }}>
            Home
          </Link>
          <Typography align="center" variant="h4">
            Disc Database
          </Typography>
        </Box>
        <DiscList />
      </Container>
    </Layout>
    //   </Container>
    // </ThemeProvider>
    // </ApolloProvider>
  );
}
