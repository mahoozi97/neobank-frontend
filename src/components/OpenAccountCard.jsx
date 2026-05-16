import { useNavigate } from "react-router";

export const OpenAccountCard = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center p-6">
      <div className="card card-dash bg-base-100 w-96 border border-dashed border-base-300 shadow-sm">
        <div className="card-body text-center items-center">
          
          <h2 className="card-title text-xl font-bold text-base-content">
            No Accounts Found
          </h2>

          <p className="text-sm text-base-content/70 my-2">
            You haven't opened an account with us yet. Create your first account
            to get started.
          </p>

          <div className="card-actions justify-center mt-4 w-full">
            <button
              className="btn btn-outline"
              onClick={() => navigate("/open-account")}
            >
              Open Account
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-base-200 w-full text-xs text-base-content/60">
            <p>
              Please complete your{" "}
              <a
                href="/upload-kyc"
                className="link link-primary font-semibold underline decoration-dotted"
              >
                KYC verification
              </a>
              .
              <span className="block mt-0.5 text-base-content/40 italic">
                (Ignore if already submitted)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
