import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import Image from "next/image";
import Layout from "@/components/Layout";
import client from "@/components/apolloClient";
import { useState } from "react";
import { typeColors } from "@/pages";

const GET_POKEMON = gql`
  query GetPokemon($name: String!) {
    pokemon(name: $name) {
      id
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
    }
  }
`;
const GET_EVOLUTIONS = gql`
  query GetEvolutions($name: String!) {
    pokemon(name: $name) {
      evolutions {
        id
        name
        number
        types
        image
      }
    }
  }
`;

export default function Pokemon() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newData, setNewData] = useState(null);

  const router = useRouter();
  const { name } = router.query;

  const { loading, error, data } = useQuery(GET_POKEMON, {
    variables: { name },
  });

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-center text-2xl">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-center text-2xl">Error: {error.message}</p>
      </div>
    );

  const { pokemon } = data;
  const toggleModal = async () => {
    const newData = await client.query({
      query: GET_EVOLUTIONS,
      variables: { name: pokemon.name },
    });
    setNewData(newData.data.pokemon);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="mx-auto w-4/5 p-4">
        <h1 className="mb-4 text-4xl font-bold">{pokemon.name}</h1>
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex justify-center">
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              width={300}
              height={300}
              style={{ width: "auto", height: "auto" }}
              className="mb-4"
            />
          </div>
          <div>
            <p className="text-xl font-semibold">Height:</p>
            <p>
              {pokemon.height.minimum} - {pokemon.height.maximum}
            </p>
            <div>
              <p className="text-xl font-semibold">Weight:</p>
              <p>
                {pokemon.weight.minimum} - {pokemon.weight.maximum}
              </p>
            </div>
            <p className="mb-2 text-xl font-semibold">Classification:</p>
            <p>{pokemon.classification}</p>
            <p className="mb-2 text-xl font-semibold">Types:</p>
            <div className="my-4">
              {pokemon.types.map((type, index) => (
                <span
                  key={index}
                  className={`${typeColors[type]} mx-1 my-2 rounded-lg px-2 py-1 text-center text-white`}
                >
                  {type}
                </span>
              ))}
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xl font-semibold">Weaknesses:</p>
              {pokemon.weaknesses.map((weakness, index) => (
                <span
                  key={index}
                  className={`${typeColors[weakness]} mb-2 mr-2 inline-block rounded-lg px-2 py-1 text-white`}
                >
                  {weakness}
                </span>
              ))}
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xl font-semibold">Resistances:</p>
              {pokemon.resistant.map((resist, index) => (
                <span
                  key={index}
                  className={`${typeColors[resist]} mb-2 mr-2 inline-block rounded-lg px-2 py-1 text-white`}
                >
                  {resist}
                </span>
              ))}
            </div>
            <button
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={toggleModal}
            >
              Show Evolutions
            </button>
            {newData && isModalOpen && (
              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="grid min-h-screen grid-cols-1 place-items-center bg-black bg-opacity-60">
                  <div className="relative rounded-lg bg-white p-8 sm:w-full sm:py-4 lg:w-4/5">
                    {newData.evolutions ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {newData.evolutions.map((evolution, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center justify-center"
                          >
                            <Image
                              className="mb-4 rounded-lg object-contain"
                              src={evolution.image}
                              alt={evolution.name}
                              width={300}
                              height={300}
                            />
                            <p className="text-bold mb-2 text-center text-xl sm:text-sm">
                              {evolution.name}
                            </p>
                            <p>#{evolution.number}</p>
                            <div className="flex items-center justify-center">
                              <div className="grid grid-cols-2 gap-2">
                                {evolution.types.map((type, index) => (
                                  <p
                                    key={index}
                                    className={`${typeColors[type]} my-2 rounded-lg px-2 py-1 text-center text-white`}
                                  >
                                    {type}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-bold mb-2 py-4 text-center text-xl sm:text-sm">
                        Not Found
                      </p>
                    )}
                    <button
                      className="absolute bottom-8 right-8 rounded bg-gray-900 px-4 py-2 font-bold text-white hover:bg-gray-700"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
