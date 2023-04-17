import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import client from "../components/apolloClient";
export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />;
    </ApolloProvider>
  );
}
