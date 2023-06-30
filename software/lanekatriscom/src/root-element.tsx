import React from "react";
import {createSyncStoragePersister} from "@tanstack/query-sync-storage-persister";
import {persistQueryClient} from "@tanstack/react-query-persist-client";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()
const localStoragePersister = createSyncStoragePersister({storage:window.localStorage})
persistQueryClient({queryClient,persister: localStoragePersister})
export default function RootElement({children}:{children:JSX.Element}){
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}