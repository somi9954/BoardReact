import React, { useEffect } from 'react';
import Pagination from 'react-js-pagination';
import './Pagin.css';

const Paging = ({ page, count, setPage }) => {
  useEffect(() => {
    const totalPages = Math.ceil(count / 10);

    // 페이지와 총 페이지 수를 로그로 출력하여 확인
    console.log('Page:', page);
    console.log('Total Pages:', totalPages);

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
