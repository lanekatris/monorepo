import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { darkTheme } from "./index";
import { Link } from "gatsby";
import { navigate } from "gatsby-link";
import {Layout} from "./layout";

export default function LoginPage() {
  const [token, setToken] = useState("");
  // const [token, setToken] = useLocalStorage<string | undefined>(
  //   "token",
  //   undefined
  // );
  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // set token
    localStorage.setItem("token", token);
    // setToken(e.target.value);
    // window.location.href = "/";
    navigate("/");
  };
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box p={3}>
          <Link to="/" style={{ textAlign: "center", display: "block" }}>
            Home
          </Link>
          <Typography align="center" variant="h4">
            Login
          </Typography>
          <form onSubmit={onSubmit}>
            <TextField
              autoFocus
              value={token}
              onChange={(e) => setToken(e.target.value)}
              label="password"
              variant="standard"
              type="password"
            />
            {/*<input value={token} onChange={(e) => setToken(e.target.value)} />*/}
            <Box sx={{ mt: 1 }}>
              <Button variant="outlined" type="submit">
                Submit
              </Button>
            </Box>

            {/*<input type="submit" />*/}
          </form>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              localStorage.clear();
              // setToken(e.target.value);
              // window.location.href = "/";
              navigate("/");
            }}
          >
            Logout
          </Button>
        </Box>
      </Container>
    </Layout>
  );
}
