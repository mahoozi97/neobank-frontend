export const LoadMore = ({ setPage }) => {
  return (
    <div className="flex justify-center p-6 bg-base-100 border-t border-base-200">
      <button
        className="btn btn-outline btn-sm w-full max-w-xs"
        onClick={() => setPage((p) => p + 1)}
      >
        Load More
      </button>
    </div>
  );
};
