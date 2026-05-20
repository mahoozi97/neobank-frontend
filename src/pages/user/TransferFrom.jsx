import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { transferAmount } from "../../services/transaction";
import { useEffect, useState } from "react";
import { getTargetAccountIds } from "../../services/account";
import { Loading } from "../../components/Loading";
import { displayBalanceTemporarily } from "../../utils/helper";

export const TransferFrom = () => {
  const { register, unregister, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const accountId = location.state?.accountId;
  const balance = location.state?.balance;
  const [showBalance, setShowBalance] = useState(false);
  const [isIban, setIsIban] = useState(false);
  const [foundAccounts, setFoundAccounts] = useState([]);

  const findReceipienet = async (data) => {
    try {
      const res = await getTargetAccountIds(data);
      setFoundAccounts(res);
      setErrorMessage("");
    } catch (error) {
      console.log(error.response?.data.error || error.message);
      setErrorMessage(error.response?.data.error || error.message);
    }
  };

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      if (isIban) {
        delete data.mobile;
      } else {
        delete data.iban;
      }
      data.fromAccount = accountId;
      data.amount = Number(data.amount);
      await transferAmount(data);
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data.error || error.message);
      setErrorMessage(error.response?.data.error || error.message);
    }
  };

  useEffect(() => {}, [isIban]);

  return (
    <>
      {foundAccounts.length === 0 && (
        <div className="flex justify-center">
          <form onSubmit={handleSubmit(findReceipienet)}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
              <legend className="fieldset-legend">
                Enter Receipienet Info
              </legend>

              {errorMessage && <p className="text-red-500">{errorMessage}</p>}

              <div className="tabs tabs-box flex justify-center">
                <input
                  type="radio"
                  name="my_tabs_1"
                  className="tab"
                  aria-label="Mobile Number"
                  defaultChecked
                  onChange={() => {
                    setIsIban(false);
                    unregister("iban");
                  }}
                />
                <input
                  type="radio"
                  name="my_tabs_1"
                  className="tab"
                  aria-label="IBAN"
                  onChange={() => {
                    setIsIban(true);
                    unregister("mobile");
                  }}
                />
              </div>

              {!isIban ? (
                <>
                  <label className="label">Mobile No.</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="Mobile No.: 38838838"
                    {...register("mobile", { required: true })}
                  />
                </>
              ) : (
                <>
                  <label className="label">IBAN</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="IBAN"
                    {...register("iban", { required: true })}
                  />
                </>
              )}

              <label className="label">Beneficiary</label>
              <input
                type="text"
                spellCheck="false"
                className="input"
                placeholder="Beneficiary"
                {...register("beneficiary", { required: true })}
              />

              <button className="btn btn-outline mt-4">Next</button>
            </fieldset>
          </form>
        </div>
      )}

      {foundAccounts.length > 0 && (
        <>
          <div className="flex justify-center">
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="fieldset-legend">Transfer To</legend>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                {!showBalance ? (
                  <a
                    className="link"
                    onClick={() => displayBalanceTemporarily(setShowBalance)}
                  >
                    Show Balance
                  </a>
                ) : (
                  <p className="text-2xl font-semibold">{balance} BHD</p>
                )}

                <fieldset className="fieldset pb-4">
                  <legend className="fieldset-legend">Select Account</legend>
                  <select
                    className="select w-30 md:w-30"
                    {...register("toAccount", { required: "Select Account" })}
                  >
                    {foundAccounts.map((account) => (
                      <option key={account._id} value={account._id}>
                        {account.nickname}
                      </option>
                    ))}
                  </select>
                </fieldset>

                <label className="label">Amount</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter Amount"
                  {...register("amount", {
                    pattern: {
                      value: /^[0-9]*\.?[0-9]*$/, // only number
                    },
                    required: true,
                  })}
                />
                <div className="flex justify-center space-x-2">
                  <button className="btn btn-outline mt-4">Send</button>
                  <button
                    type="button"
                    className="btn btn-dash btn-error mt-4"
                    onClick={() => {
                      setFoundAccounts([]);
                      window.location.reload();
                    }}
                  >
                    Back
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        </>
      )}
    </>
  );
};
