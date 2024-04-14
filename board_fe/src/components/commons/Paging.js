import React, { useEffect } from 'react';
import Pagination from 'react-js-pagination';
import './Pagin.css';

const Paging = ({ page, count, setPage }) => {
  useEffect(() => {
    const totalPages = Math.ceil(count / 10);

    if (page === 0 || page > totalPages) {
      setPage(1);
    }
  }, [page, count, setPage]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <Pagination
      activePage={page}
      itemsCountPerPage={10}
      totalItemsCount={count}
      pageRangeDisplayed={5}
      prevPageText={'‹'}
      firstPageText={'«'}
      nextPageText={'›'}
      lastPageText={'»'}
      onChange={handlePageChange}
    />
  );
};

export default Paging;
