export const NoAccountCard = () => {
  return (
    <div className="flex justify-center p-6">
      <div className="card card-dash bg-base-100 w-96 border border-dashed border-base-300 shadow-sm">
        <div className="card-body text-center items-center">
          <h2 className="card-title text-xl font-bold text-base-content">
            No Account Found
          </h2>

          <p className="text-sm text-base-content/70 my-2">
            This user hasn't opened a bank account yet.
          </p>
        </div>
      </div>
    </div>
  );
};
