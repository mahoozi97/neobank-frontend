export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // If backend says there is only 1 page or none, hide the component entirely
  if (totalPages <= 1) return null;

  // Calculates which page numbers to render alongside the '...' strings
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };
  return (
    <div className="flex justify-center mt-4">
      <div className="join">
        {/* Previous Button */}
        <button
          className="join-item btn btn-sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          «
        </button>

        {/* Dynamic Numbers List */}
        {getPageNumbers().map((p, index) =>
          p === "..." ? (
            <button
              key={`ellipsis-${index}`}
              className="join-item btn btn-sm btn-disabled"
            >
              …
            </button>
          ) : (
            <button
              key={p}
              className={`join-item btn btn-sm ${currentPage === p ? "btn-active" : ""}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ),
        )}

        {/* Next Button */}
        <button
          className="join-item btn btn-sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          »
        </button>
      </div>
    </div>
  );
};
