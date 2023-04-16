import { useContext, useCallback, useEffect, useState } from "react";
import AppContext from "@/pages/AppContext";
import { gql } from "@apollo/client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import client from "@/pages/lib/apolloClient";
//
function Pagination() {
  const { setCurrentPage, currentPage, initialPokemons, setGridsToDisplay } =
    useContext(AppContext);

  const [pokemons, setPokemons] = useState(initialPokemons);
  useEffect(() => {
    client
      .query({
        query: gql`
          query GetPokemons {
            pokemons(first: 151) {
              image
              number
              name
              types
            }
          }
        `,
      })
      .then(({ data }) => {
        setPokemons(data.pokemons);
        // console.log("Real Time Rendering " + data.pokemons.length);
      });
  });

  const itemsPerPage = 20;
  const gridsPerPage = 20;

  const indexOfLastGrid = currentPage * gridsPerPage;
  const indexOfFirstGrid = indexOfLastGrid - gridsPerPage;

  const handleNextPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, [setCurrentPage]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }, [currentPage, setCurrentPage]);

  const pageButtonClass = (isCurrentPage) =>
    `relative ${
      isCurrentPage ? "z-10 bg-gray-900 text-white" : "text-gray-900"
    } inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:bg-gray-500 focus:z-20`;

  const renderPageButton = useCallback(
    (page) => {
      const isCurrentPage = page === currentPage;
      return (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={pageButtonClass(isCurrentPage)}
        >
          {page}
        </button>
      );
    },
    [currentPage, setCurrentPage]
  );
  const pokemonsToUse =
    initialPokemons.length >= pokemons ? initialPokemons : pokemons;

  const pages = Array.from(
    { length: Math.ceil(pokemonsToUse.length / itemsPerPage) },
    (_, i) => i + 1
  );

  useEffect(() => {
    setGridsToDisplay(pokemonsToUse.slice(indexOfFirstGrid, indexOfLastGrid));
  }, [indexOfFirstGrid, indexOfLastGrid, pokemonsToUse, setGridsToDisplay]);

  const renderPageButtons = useCallback(
    () => pages.map(renderPageButton),
    [pages, renderPageButton]
  );
  return (
    <div>
      <div className="flex items-center justify-between border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto">
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={handlePrevPage}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-800 ring-1 ring-inset ${
                currentPage === 1 ? "ring-gray-300" : "ring-gray-600"
              } hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {renderPageButtons()}
            <button
              onClick={handleNextPage}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-800 ring-1 ring-inset ${
                currentPage === pages.length ? "ring-gray-300" : "ring-gray-500"
              } hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
              disabled={currentPage === pages.length}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Pagination;
