import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) {
  if (totalItems === 0) {
    return null;
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const pages = [];

  for (let page = 1; page <= totalPages; page += 1) {
    if (
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1
    ) {
      pages.push(page);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  return (
    <div className="sp-pagination">
      <div className="sp-pagination-summary">
        Showing <strong>{start}-{end}</strong> of <strong>{totalItems}</strong> tickets
      </div>

      <div className="sp-pagination-controls">
        <button
          type="button"
          className="sp-pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FiChevronLeft size={14} />
          Previous
        </button>

        <div className="sp-pagination-pages">
          {pages.map((page, index) => (
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="sp-pagination-ellipsis">…</span>
            ) : (
              <button
                key={page}
                type="button"
                className={`sp-pagination-page${page === currentPage ? ' active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          type="button"
          className="sp-pagination-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <FiChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
