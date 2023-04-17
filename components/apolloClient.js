import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const link = from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) => {
        alert(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    if (networkError) console.log();
  }),
  new HttpLink({ uri: "https://graphql-pokemon2.vercel.app/" }),
]);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

export default client;
