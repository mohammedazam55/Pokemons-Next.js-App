// import statements
import React, { useState } from "react";
import Head from "next/head";
import { gql } from "@apollo/client";
import AppContext from "./AppContext";
import client from "./lib/apolloClient";
import Pokemons from "@/components/Pokemons";
import Pagination from "@/components/Pagination";
import Layout from "@/components/Layout";

//

export async function getStaticProps() {
  const {
    data: { pokemons: initialPokemons },
  } = await client.query({
    query: gql`
      query GetPokemons {
        pokemons(first: 60) {
          image
          number
          name
          types
        }
      }
    `,
  });

  const {
    data: { pokemons: morePokemons },
  } = await client.query({
    query: gql`
      query GetMorePokemons {
        pokemons(first: 20) {
          name
          image
          height {
            minimum
            maximum
          }
          weight {
            minimum
            maximum
          }
          classification
          types
          weaknesses
          resistant
          evolutions {
            id
            name
            image
          }
        }
      }
    `,
  });
  // console.log(initialPokemons);
  // console.log(morePokemons);
  return {
    props: {
      initialPokemons,
      morePokemons,
    },
  };
  revalidate: 1;
}

function HomePage({ initialPokemons }) {
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [gridsToDisplay, setGridsToDisplay] = useState([]);
  return (
    <div>
      <Head>
        <title>My Pokemon App</title>
      </Head>
      <AppContext.Provider
        value={{
          currentPage,
          setCurrentPage,
          gridsToDisplay,
          setGridsToDisplay,
          initialPokemons,
        }}
      >
        <Layout>
          <Pokemons />
          <Pagination />
        </Layout>
      </AppContext.Provider>
    </div>
  );
}
export const typeColors = {
  Fire: "bg-red-500",
  Grass: "bg-green-500",
  Poison: "bg-purple-500",
  Flying: "bg-blue-500",
  Electric: "bg-yellow-500",
  Normal: "bg-gray-500",
  Water: "bg-blue-500",
  Fighting: "bg-red-700",
  Fairy: "bg-pink-500",
  Ground: "bg-yellow-700",
  Bug: "bg-green-700",
  Dragon: "bg-indigo-500",
  Psychic: "bg-pink-700",
  Ice: "bg-blue-200",
  Rock: "bg-yellow-800",
  Ghost: "bg-purple-700",
  Steel: "bg-gray-700",
};

export default HomePage;
