import React from "react";
import { Link } from "gatsby";
import {
  Box, Button,
  Chip,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import {QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {Layout} from "../layout";


type ClimbGrade = 'V0' | 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8'
interface ClimbRecording {
    completions: number
    attempts: number
}

export interface ClimbSession {
    id: string;
    name: string;
    date: string;
    climbs: {[k in ClimbGrade]: ClimbRecording}
}

function ClimbSessions() {
    const queryClient = useQueryClient()
  const addSession = () => {

    queryClient.setQueryData<ClimbSession[]>(['climbs'], state => [
        {
            id: new Date().toISOString(),
            name: new Date().toISOString(),
            date: new Date().toISOString(),
            climbs: {
                V0: {
                    completions: 0,
                    attempts: 0
                },

                V1: {
                    completions: 0,
                    attempts: 0
                },


                V2: {
                    completions: 0,
                    attempts: 0
                },



                V3: {
                    completions: 0,
                    attempts: 0
                },



                V4: {
                    completions: 0,
                    attempts: 0
                },




                V5: {
                    completions: 0,
                    attempts: 0
                },




                V6: {
                    completions: 0,
                    attempts: 0
                },




                V7: {
                    completions: 0,
                    attempts: 0
                },




                V8: {
                    completions: 0,
                    attempts: 0
                }
            }
        },
        ...(state || []), ])
  }
  const result = useQuery(['climbs'], () => queryClient.getQueryData<ClimbSession[]>(['climbs']) || [])
    console.log(result)
  return (
      <>
        <List>


            {result.data?.map(session => <ListItem alignItems={"center"} key={session.id}><Link to={`/climb-tracker/${session.id}`}>
                <ListItemText primary={session.name} /></Link></ListItem>)}

        </List>
        <Button onClick={() => addSession()}>Add Session</Button>
      </>

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
