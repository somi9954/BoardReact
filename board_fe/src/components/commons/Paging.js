import React, { useEffect, useMemo } from 'react';
import './Pagin.css';

const Paging = ({ page, count, setPage }) => {
  const totalPages = Math.max(1, Math.ceil(count / 10));

  useEffect(() => {
    if (page < 1 || page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages, setPage]);

  const pages = useMemo(() => {
    const range = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);

    for (let i = start; i <= end; i += 1) {
      range.push(i);
    }

    return range;
  }, [page, totalPages]);

  const movePage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  return (
    <div className="pagination">
      <button type="button" onClick={() => movePage(1)}>{'«'}</button>
      <button type="button" onClick={() => movePage(page - 1)}>{'‹'}</button>
      {pages.map((num) => (
        <button
          type="button"
          key={num}
          className={num === page ? 'active' : ''}
          onClick={() => movePage(num)}
        >
          {num}
        </button>
      ))}
      <button type="button" onClick={() => movePage(page + 1)}>{'›'}</button>
      <button type="button" onClick={() => movePage(totalPages)}>{'»'}</button>
    </div>
  );
};

export default Paging;
