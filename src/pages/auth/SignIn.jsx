import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Error } from "../../components/Error";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const SignIn = ({ setUser, setAdmin }) => {
  useDocumentTitle(`Sign In`);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      setErrorMessage("")
      const response = await axios.post(`${BASE_URL}/auth/sign-in`, data);
      const token = response.data.token;
      localStorage.setItem("token", token);
      const userInfo = JSON.parse(atob(token.split(".")[1]));
      if (userInfo.role === "user") {
        setUser(userInfo);
        navigate("/dashboard");
      } else {
        setAdmin(userInfo);
        navigate("/admin/dashboard");
      }
    } catch (error) {
      setErrorMessage(error.response?.data.error || error.message);
    }
  };
  return (
    <>
      {errorMessage && <Error errorMessage={errorMessage} />}

      <div className="flex justify-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend">Sign In</legend>

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

            <button className="btn btn-neutral mt-4">Sign In</button>
          </fieldset>
        </form>
      </div>
    </>
  );
};
