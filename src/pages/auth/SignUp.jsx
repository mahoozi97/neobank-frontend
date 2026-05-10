import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const SignUp = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post(`${BASE_URL}/auth/sign-up`, data);
      navigate("/sign-in");
    } catch (error) {
      console.log(error.response?.data);
      setErrorMessage(error.response?.data.error || error.message);
    }
  };
  return (
    <>
      <div className="flex justify-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend">Sign Up</legend>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <label className="label">Full Name</label>
            <p className="text-xs text-gray-400 italic">
              * Your name must match your identity exactly.
            </p>
            <input
              type="text"
              className="input"
              placeholder="Full Name"
              {...register("name", { required: true })}
            />

            <label className="label">CPR</label>
            <input
              type="number"
              className="input"
              placeholder="CPR"
              {...register("cpr", { required: true })}
            />

            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              placeholder="Email"
              {...register("email", { required: true })}
            />

            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="Password"
              {...register("password", { required: true })}
            />

            <button className="btn btn-neutral mt-4">Sign Up</button>
          </fieldset>
        </form>
      </div>
    </>
  );
};
