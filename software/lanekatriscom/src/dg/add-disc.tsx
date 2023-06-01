import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import React from "react";
import { useCreateDiscMutation } from "../gql/generated";

import { navigate } from "gatsby";

export default function AddDisc(){
  const [go, {loading}] = useCreateDiscMutation()

  const create = async () => {
    const r = await go();
// navigate('/discs')
    navigate(`/disc/${r.data?.discCreate.id}`)
  }

  return <Fab color="primary" sx={{position:'fixed', right: 25, bottom: 25}} disabled={loading} onClick={create}>
    <AddIcon/>
  </Fab>
}