import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getKycDocuments } from "../../services/KYC";

export const Profile = ({ user }) => {
  const [documents, setDocuments] = useState(null);
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    try {
      const kyc = await getKycDocuments();
      setDocuments(kyc);
    } catch (error) {
      console.log(error.response?.data.error || error.message);
      // setErrorMessage(error.response?.data.error || error.message);
    }
  };

  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleString("en-GB", {
      timeZone: "Asia/Bahrain",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    fetchDocuments();
    console.log(documents);
  }, []);
  return (
    <>
      <div className="card bg-info text-neutral-content w-80 shadow-xl">
        <div className="card-body">
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
              <span className="font-mono ">{user.kycStatus}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-accent-content">Status</span>
              <span className="font-mono ">{user.status}</span>
            </div>
          </div>

          <div className="flex justify-center space-x-1">
            {!documents ||
              (documents.status === "rejected" && (
                <>
                  <button
                    className="btn btn-xs sm:btn-sm md:btn-md"
                    onClick={() => navigate("/upload-kyc")}
                  >
                    Verify My Identity
                  </button>
                </>
              ))}

            <button
              className="btn btn-xs sm:btn-sm md:btn-md"
              onClick={() => navigate("/open-account")}
            >
              Open Account
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-1">
        <div></div>

        <div></div>
      </div>
    </>
  );
};
// disabled="disabled"
