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
import { Layout } from "../discs";

import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import {QueryClient, QueryClientProvider, useMutation, useQuery} from '@tanstack/react-query'


const queryClient = new QueryClient()

interface ClimbSession {
    id: string;
    name: string;
    date: string;
}

function ClimbSessions() {
  const addSession = () => {

    queryClient.setQueryData<ClimbSession[]>(['climbs'], state => [
        {
            id: new Date().toISOString(),
            name: 'Climb Session ' + new Date().toISOString(),
            date: new Date().toISOString()
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


const localStoragePersister = createSyncStoragePersister({storage:window.localStorage})
persistQueryClient({queryClient,persister: localStoragePersister})

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
        <QueryClientProvider client={queryClient} >
        <ClimbSessions />
        </QueryClientProvider>
      </Container>
    </Layout>
  );
}
