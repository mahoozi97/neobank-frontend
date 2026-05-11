import { useEffect, useState } from "react";
import { getAccountsSummary } from "../../services/account";

export const Dashboard = ({ user }) => {
  const [accounts, setAccounts] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchAccountSummary = async () => {
    try {
      const account = await getAccountsSummary();
      setAccounts(account);
    } catch (error) {
      setErrorMessage(error.response?.data.error || error.message);
    }
  };

  const ibanFormat = (str) => {
    return str.replace(/.{4}(?!$)/g, "$& ");
  };

  useEffect(() => {
    fetchAccountSummary();
  }, []);
  return (
    <>
      <div className="flex flex-col items-center">
        {accounts ? (
          accounts.map((account) => (
            <div key={account._id} className="card card-border bg-success w-96">
              <div className="card-body">
                <h2 className="card-title">NeoBank</h2>
                <p>{ibanFormat(account.iban)}</p>
                <p>{account.balance} BHD</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-dash">Transfer</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <span className="loading loading-infinity loading-xl"></span>
        )}

        <div className="divider"></div>
      </div>
    </>
  );
};

{
}
