import {CssBaseline, ThemeProvider} from "@mui/material";
import {darkTheme} from "../pages";
import React from "react";
import {Children} from "./children";

export function Layout({children}: Children) {
    return (
        <ThemeProvider theme={darkTheme}>
            {/*@ts-ignore*/}
                <CssBaseline/>
                {children}
                {/*<Container maxWidth="sm"></Container>*/}
        </ThemeProvider>
    );
}