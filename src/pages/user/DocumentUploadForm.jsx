import { useState } from "react";
import { useForm } from "react-hook-form";
import { uploadKyc } from "../../services/KYC";
import { useNavigate } from "react-router";
import { Error } from "../../components/Error";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export const DocumentUploadForm = ({ user }) => {
  useDocumentTitle("Upload Identity");
  const { register, handleSubmit } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      const formData = new FormData();
      formData.append("frontId", data.frontId[0]);
      formData.append("backId", data.backId[0]);
      formData.append("passport", data.passport[0]);

      await uploadKyc(formData);
      navigate("/profile");
    } catch (error) {
      setErrorMessage(error.response?.data.error || error.message);
    }
  };

  return (
    <>
      {errorMessage && <Error errorMessage={errorMessage} />}

      <div className="flex justify-center">
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
              <legend className="fieldset-legend">Verify Idenity</legend>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Front ID</legend>
                <input
                  type="file"
                  className="file-input"
                  {...register("frontId", { required: true })}
                />
                <label className="label">Max size 2MB</label>
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Back ID</legend>
                <input
                  type="file"
                  className="file-input"
                  {...register("backId", { required: true })}
                />
                <label className="label">Max size 2MB</label>
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Passport</legend>
                <input
                  type="file"
                  className="file-input"
                  {...register("passport", { required: true })}
                />
                <label className="label">Max size 2MB</label>
              </fieldset>

              <button className="btn btn-neutral mt-4">Upload</button>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
};
