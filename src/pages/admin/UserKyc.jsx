import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { approveKyc, getKycByUserId, rejectKyc } from "../../services/admin";
import { Loading } from "../../components/Loading";
import { capitalize, formatDate, getStatusColor } from "../../utils/helper";
import { useForm } from "react-hook-form";
import { Error } from "../../components/Error";

export const UserKyc = () => {
  const { register, handleSubmit } = useForm();
  const location = useLocation();
  const userId = location.state?.userId;
  const name = location.state?.name;
  const cpr = location.state?.cpr;
  const [documents, setDocuments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReject, setIsReject] = useState(false);

  const fetchKyc = async () => {
    try {
      const kyc = await getKycByUserId(userId);
      setDocuments(kyc);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch documents",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (kycId) => {
    try {
      await approveKyc(kycId);
      window.location.reload();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to approve documents",
      );
    }
  };

  // Reject
  const onSubmit = async (kycId, data) => {
    try {
      await rejectKyc(kycId, data);
      window.location.reload();
      setIsReject(false);
    } catch (error) {
      console.log(error.response?.data.error || error.message);
      setErrorMessage(error.response?.data.error || error.message);
    }
  };

  useEffect(() => {
    fetchKyc();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (errorMessage) {
    return <Error errorMessage={errorMessage} />;
  }

  if (documents.length === 0) {
    return (
      <div className="p-10 text-center opacity-60 italic">
        No Documents found.
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col space-y-2 px-4 sm:px-0">
        <div className="card bg-info text-neutral-content w-95 max-w-full shadow-xl">
          <div className="card-body">
            <h2 className="card-title">User Identity</h2>
            <div className="flex justify-between items-center">
              <span className="text-accent-content">Name</span>
              <span className="font-medium">{name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-accent-content">CPR</span>
              <span className="font-mono ">{cpr}</span>
            </div>
          </div>
        </div>

        {/* Document */}
        {documents.map((doc) => (
          <div key={doc._id}>
            <div
              className={`card text-neutral-content w-95 max-w-full shadow-xl ${doc.status === "pending" ? "bg-warning" : doc.status === "approved" ? "bg-success" : "bg-error"}`}
            >
              <div className="card-body gap-3">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-accent-content">Front ID</span>
                    <span className="font-mono ">
                      <a
                        href={doc.documents[0].url}
                        target="_blank"
                        className="link"
                      >
                        click here
                      </a>
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-accent-content">Back ID</span>
                    <span className="font-mono ">
                      <a
                        href={doc.documents[1].url}
                        target="blank"
                        className="link"
                      >
                        click here
                      </a>
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-accent-content">Passport</span>
                    <span className="font-mono ">
                      <a
                        href={doc.documents[2].url}
                        target="blank"
                        className="link"
                      >
                        click here
                      </a>
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-accent-content">Status</span>
                    <span className="font-mono ">{capitalize(doc.status)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-accent-content">submitted</span>
                    <span className="font-mono ">
                      {formatDate(doc.createdAt).slice(4)}
                    </span>
                  </div>

                  {doc.comment && (
                    <div className="mt-2 p-2 rounded-lg bg-white">
                      <p className="text-xs text-black mb-1">Comment</p>
                      <p className="font-mono text-black text-sm wrap-break-word">
                        {doc.comment}
                      </p>
                    </div>
                  )}
                </div>

                {doc.status === "pending" && !isReject && (
                  <div className="flex justify-center space-x-1">
                    <button
                      className="btn btn-xs sm:btn-sm"
                      onClick={() => handleApprove(doc._id)}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-error btn-xs sm:btn-sm"
                      onClick={() => setIsReject(true)}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {doc.status === "pending" && isReject && (
                  <>
                    <div className="flex flex-col">
                      <form
                        onSubmit={handleSubmit((data) =>
                          onSubmit(doc._id, data),
                        )}
                      >
                        <input
                          type="text"
                          placeholder="Reason for rejection..."
                          className="input text-black"
                          {...register("comment", { required: true })}
                        />
                        <div className="flex space-x-1 pt-2 justify-center">
                          <button className="btn btn-xs sm:btn-sm">Send</button>
                          <button
                            type="button"
                            className="btn btn-error btn-xs sm:btn-sm"
                            onClick={() => setIsReject(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
