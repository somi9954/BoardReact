import React, { useEffect } from "react";
import Pagination from "react-js-pagination";
import './Pagin.css'

const Paging = ({ page, count, setPage }) => {
  useEffect(() => {
    const totalPages = Math.ceil(count / 10);

    if (page > totalPages) {
      setPage(1);
    }
  }, [page, count, setPage]);

  return (
    <Pagination
      activePage={page}
      itemsCountPerPage={10}
      totalItemsCount={count}
      pageRangeDisplayed={10}
      prevPageText={"‹"}
      firstPageText={"«"}
      nextPageText={"›"}
      lastPageText={"»"}
      onChange={setPage}
    />
  );
};

export default Paging;
