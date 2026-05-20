import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getKycDocuments } from "../../services/KYC";
import { capitalize, formatDate } from "../../utils/helper";
import { Error } from "../../components/Error";

export const Profile = ({ user }) => {
  const [document, setDocument] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchDocuments = async () => {
    try {
      const kyc = await getKycDocuments();
      setDocument(kyc);
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
      {errorMessage && <Error errorMessage={errorMessage} />}

      <div className="flex flex-col space-y-2 px-4 sm:px-0">
        <div className="card bg-info text-neutral-content w-100 max-w-full shadow-xl">
          <div className="card-body">
            <p className="card-title">User Identity</p>

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

            <div className="flex justify-center">
              {!isLoading && (!document || document.status === "rejected") && (
                <button className="btn" onClick={() => navigate("/upload-kyc")}>
                  Verify My Identity
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Document */}
        {document && (
          <div
            className={`card text-neutral-content w-100 max-w-full shadow-xl ${document.status === "pending" ? "bg-warning" : document.status === "approved" ? "bg-success" : "bg-error"}`}
          >
            <div className="card-body gap-3">
              <p className="card-title">KYC Document</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-accent-content">Status</span>
                  <span className="font-mono ">
                    {capitalize(document.status)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-accent-content">submitted</span>
                  <span className="font-mono ">
                    {formatDate(document.createdAt).slice(4)}
                  </span>
                </div>

                {document.comment && (
                  <div className="mt-2 p-2 rounded-lg bg-white">
                    <p className="text-xs text-black mb-1">Comment</p>
                    <p className="font-mono text-black text-sm wrap-break-word">
                      {document.comment}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
