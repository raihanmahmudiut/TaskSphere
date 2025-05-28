'use client';

import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';

export default function PaginationSection({
  totalPages = 0,
  pageNumber,
  onPageChange,
  persistAsQueryString = false,
}: {
  totalPages?: number;
  pageNumber?: number | null;
  onPageChange?: (currentPage: number) => void;
  persistAsQueryString?: boolean;
}) {
  const [page, setPage] = useQueryState('page', {
    defaultValue: '1',
  });

  const [currentPage, setCurrentPage] = useState(
    pageNumber !== undefined && pageNumber !== null
      ? pageNumber
      : persistAsQueryString && !Number.isNaN(parseInt(page))
        ? parseInt(page)
        : 0
  );

  useEffect(() => {
    setCurrentPage(
      pageNumber !== undefined && pageNumber !== null ? pageNumber : 0
    );
  }, [pageNumber]);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const maxPageNum = 5;
  const pageNumLimit = Math.floor(maxPageNum / 2);

  const activePages = pageNumbers.slice(
    Math.max(0, currentPage - 1 - pageNumLimit),
    Math.min(currentPage - 1 + pageNumLimit + 1, pageNumbers.length)
  );

  const changePage = (_pageNumber: number) => {
    setCurrentPage(_pageNumber);
    void setPage(_pageNumber + '');
    if (onPageChange) {
      onPageChange(_pageNumber);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      changePage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  };

  // Function to render page numbers with ellipsis
  const renderPages = () => {
    const renderedPages = activePages.map((_page, idx) => (
      <PaginationItem
        key={idx}
        className={currentPage === _page ? 'bg-neutral-100 rounded-md' : ''}
      >
        <PaginationLink onClick={() => changePage(_page)}>
          {_page}
        </PaginationLink>
      </PaginationItem>
    ));

    // Add ellipsis at the start if necessary
    if (activePages[0] > 1) {
      renderedPages.unshift(
        <PaginationEllipsis
          key="ellipsis-start"
          onClick={() => setCurrentPage(activePages[0] - 1)}
        />
      );
    }

    // Add ellipsis at the end if necessary
    if (activePages[activePages.length - 1] < pageNumbers.length) {
      renderedPages.push(
        <PaginationEllipsis
          key="ellipsis-end"
          onClick={() =>
            setCurrentPage(activePages[activePages.length - 1] + 1)
          }
        />
      );
    }

    return renderedPages;
  };

  if (!totalPages) return <></>;

  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={handlePrevPage} />
          </PaginationItem>

          {renderPages()}

          <PaginationItem>
            <PaginationNext onClick={handleNextPage} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
