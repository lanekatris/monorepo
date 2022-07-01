import { ApolloClient } from '@apollo/client';

// const client = new ApolloClient({
//   uri: 'http://localhost:3000/graphql'
// })

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
