import fetch from "isomorphic-fetch";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

const errorLink = onError(({ graphQLErrors, networkError, response }) => {
  console.log({ graphQLErrors, networkError, response });
  // window.location.href='/login'
});

console.log("process", process.env.GATSBY_API_URL);
const httpLink = new HttpLink({
  // uri: "https://972yvjfqbj.execute-api.us-east-1.amazonaws.com/dev/graphql",
  uri: process.env.GATSBY_API_URL,
  fetch,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  // return {
  //   headers,
  // };
  return {
    headers: {
      ...headers,
      "x-api-key": token,
    },
  };
});

const link = ApolloLink.from([errorLink, authLink, httpLink]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export default client;
