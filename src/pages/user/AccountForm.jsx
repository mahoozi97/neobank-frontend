import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { openAccount } from "../../services/account";

export const AccountForm = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      await openAccount(data);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data.error || error.message);
    }
  };
  return (
    <>
      <div className="flex justify-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend">Account Form</legend>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <label className="label">Nickname</label>
            <input
              type="text"
              className="input"
              placeholder="Nickname"
              {...register("nickname", { required: true })}
            />

            <label className="label">Mobile No.</label>
            <input
              type="number"
              className="input"
              placeholder="Mobile No.: 38838838"
              {...register("mobile", { required: true })}
            />

            <button className="btn btn-neutral mt-4">Submit</button>
          </fieldset>
        </form>
      </div>
    </>
  );
};
