import React, {useEffect, useState} from "react";
import {Layout} from "./layout";
import {Container, Typography} from "@mui/material";
export default function() {
    const [computerInfo,setComputerInfo] = useState()
    useEffect(() => {
        fetch('https://linux.loonison.com/ping').then(x=>x.json()).then(x => setComputerInfo(x))
    }, [])
    console.log(computerInfo)
    return <Layout>
        <Container maxWidth="sm">
            <Typography variant='h5'>Stats</Typography>
        </Container>
    </Layout>
}