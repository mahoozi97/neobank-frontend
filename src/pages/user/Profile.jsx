import { useNavigate } from "react-router";

export const Profile = ({ user }) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center space-x-1">
        <div>
          <button
            className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
            onClick={() => navigate("/upload-kyc")}
          >
            Verify My Identity
          </button>
        </div>

        <div>
          <button
            className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
            onClick={() => navigate("/open-account")}
          >
            Open Account
          </button>
        </div>
      </div>
    </>
  );
};
// disabled="disabled"
