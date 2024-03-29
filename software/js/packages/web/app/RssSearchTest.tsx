'use client';

import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import 'instantsearch.css/themes/satellite.css';

const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'xyz', // Be sure to use an API key that only allows search operations
    nodes: [
      {
        host: 'localhost',
        path: '', // Optional. Example: If you have your typesense mounted in localhost:8108/typesense, path should be equal to '/typesense'
        port: 8108,
        protocol: 'http',
      },
    ],
    cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
  },

  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  query_by is required.
  additionalSearchParameters: {
    query_by: 'website',
  },
});

const searchClient = typesenseInstantsearchAdapter.searchClient;

export default function RssSearchTest() {
  return (
    <InstantSearch indexName="test" searchClient={searchClient}>
      <SearchBox />
      <Hits />
    </InstantSearch>
  );
}
