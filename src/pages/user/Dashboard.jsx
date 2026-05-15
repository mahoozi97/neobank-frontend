import { useEffect, useState } from "react";
import {
  activateAccount,
  closeAccount,
  freezeAccount,
  getAccountsSummary,
} from "../../services/account";
import { TransactionsList } from "./TransactionsList";
import { useNavigate } from "react-router";
import { Loading } from "../../components/Loading";
import { formattedAmount, ibanFormat } from "../../utils/helper";

export const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const fetchAccountSummary = async () => {
    try {
      const data = await getAccountsSummary();
      setAccounts(data);
      setAccountId(data[0]._id);
    } catch (error) {
      setErrorMessage(error.response?.data.error || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const changeAccountStatus = async (id, btn) => {
    try {
      if (btn === "freeze") {
        await freezeAccount(id);
      } else if (btn === "activate") {
        await activateAccount(id);
      } else if (btn === "close") {
        await closeAccount(id);
      }
      window.location.reload();
    } catch (error) {
      console.log(error.response?.data.error || error.message);
      setErrorMessage(error.response?.data.error || error.message);
    }
  };

  useEffect(() => {
    fetchAccountSummary();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (errorMessage) {
    return <span className="text-error">{errorMessage}</span>;
  }

  if (accounts.length === 0) {
    return (
      <div className="p-10 text-center opacity-60 italic">
        No Accounts found.
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col items-center gap-1">
        {accounts.map((account) => (
          <div
            key={account._id}
            className="card bg-success text-neutral-content w-80 shadow-xl"
          >
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div className="badge badge-outline">{account.type}</div>
                <div className="badge badge-success gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {account.status}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-accent-content mb-1">
                  Available balance
                </p>
                <p className="text-3xl font-semibold">
                  {formattedAmount(account.balance)}
                </p>
                <p className="text-sm text-accent-content mt-1">
                  Bahraini Dinar · BHD
                </p>
              </div>

              <div className="divider my-0"></div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-accent-content">Nickname</span>
                  <span className="font-medium">{account.nickname}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-content">IBAN</span>
                  <span className="font-mono ">{ibanFormat(account.iban)}</span>
                </div>
              </div>
              <div className="flex justify-center card-actions mt-2">
                {account.status === "active" && (
                  <button
                    className="btn btn-dash"
                    onClick={() =>
                      navigate("/transfer", {
                        state: { accountId: accountId },
                      })
                    }
                  >
                    Transfer
                  </button>
                )}

                <button
                  className="btn btn-dash"
                  onClick={() =>
                    account.status === "active"
                      ? changeAccountStatus(account._id, "freeze")
                      : changeAccountStatus(account._id, "activate")
                  }
                >
                  {account.status === "active" ? "Freeze" : "active"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="divider"></div>

      {accountId && <TransactionsList accountId={accountId} />}
    </>
  );
};
