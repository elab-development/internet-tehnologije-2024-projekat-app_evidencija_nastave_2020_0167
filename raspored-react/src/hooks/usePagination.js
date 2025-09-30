import { useState } from 'react';

const usePagination = (initialPage = 1, initialPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);

  const nextPage = () => setCurrentPage(prev => prev + 1);
  const prevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToPage = (page) => setCurrentPage(page);

  return {
    currentPage,
    perPage,
    nextPage,
    prevPage,
    goToPage,
    setPerPage
  };
};

export default usePagination;