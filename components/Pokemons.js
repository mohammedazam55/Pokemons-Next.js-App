import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import AppContext from "@/pages/AppContext";
import { typeColors } from "@/pages";

function Pokemons() {
  const { gridsToDisplay } = useContext(AppContext);

  return (
    <div>
      <div className="container mx-auto w-4/5 lg:w-4/5">
        <div className="grid grid-cols-1 gap-4 shadow-slate-800 md:grid-cols-3 lg:grid-cols-5">
          {gridsToDisplay.map((pokemon, index) => (
            <div
              key={index}
              className="animate-slide-in-right relative mb-4 flex-1 rounded-lg bg-white p-4 shadow-md transition-shadow hover:py-1 hover:shadow-2xl"
            >
              <Link href={`${pokemon.name}`}>
                <Image
                  className="h-48 w-full rounded-lg object-contain"
                  src={pokemon.image}
                  alt={pokemon.name}
                  width={300}
                  height={300}
                  priority={true}
                />
                <p>#{pokemon.number}</p>
                <h2 className="bottom-0 left-0 w-full bg-gray-800 py-2 text-center text-lg font-bold text-white">
                  {pokemon.name}
                </h2>
                <div className="flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-2">
                    {pokemon.types.map((type, index) => (
                      <p
                        key={index}
                        className={`${typeColors[type]} my-2 rounded-lg px-2 py-1 text-center text-white`}
                      >
                        {type}
                      </p>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pokemons;
