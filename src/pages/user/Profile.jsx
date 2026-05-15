import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getKycDocuments } from "../../services/KYC";
import { capitalize } from "../../utils/helper";

export const Profile = ({ user }) => {
  const [documents, setDocuments] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("What is your name");

  const fetchDocuments = async () => {
    try {
      const kyc = await getKycDocuments();
      setDocuments(kyc);
    } catch (error) {
      console.log(error.response?.data.error || error.message);
      setErrorMessage(error.response?.data.error || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);
  return (
    <>
      <div className="card bg-info text-neutral-content w-100 max-w-full shadow-xl">
        <div className="card-body">
          {errorMessage && (
            <span className="bg-white p-1 text-error">{errorMessage}</span>
          )}

          <div className="space-y-1 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-accent-content">Name</span>
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-accent-content">Email</span>
              <span className="font-mono ">{user.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-accent-content">KYC Status</span>
              <span className="font-mono ">{capitalize(user.kycStatus)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-accent-content">Status</span>
              <span className="font-mono ">{capitalize(user.status)}</span>
            </div>
          </div>

          <div className="flex justify-center space-x-1">
            {!isLoading &&
              (!documents ||
                documents.length === 0 ||
                documents.status === "rejected") && (
                <button
                  className="btn btn-xs sm:btn-sm"
                  onClick={() => navigate("/upload-kyc")}
                >
                  Verify My Identity
                </button>
              )}

            <button
              className="btn btn-xs sm:btn-sm"
              onClick={() => navigate("/open-account")}
            >
              Open Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
