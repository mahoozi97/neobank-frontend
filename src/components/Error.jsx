export const Error = ({ errorMessage }) => {
  return (
    <div className="p-1">
      <div role="alert" className="alert alert-error alert-outline max-w-md">
      <span>{errorMessage}</span>
    </div>
    </div>
  );
};
