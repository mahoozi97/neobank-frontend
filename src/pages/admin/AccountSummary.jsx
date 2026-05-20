import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  formatDate,
  formattedAmount,
  getStatusColor,
  ibanFormat,
} from "../../utils/helper";
import { Loading } from "../../components/Loading";
import { getAccountByUserId } from "../../services/admin";
import { NoAccountCard } from "../../components/NoAccountCard";
import { TransactionsList } from "../user/TransactionsList";

export const AccountSummary = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState(null);
  const [date, setDate] = useState();
  const status = ["success", "rejected"];

  const [accountId, setAccountId] = useState(null);

  const fetchAccountSummary = async () => {
    try {
      setIsLoading(true);
      const accountData = await getAccountByUserId(userId);
      setAccount(accountData);
      setAccountId(accountData ? accountData._id : null);
    } catch (error) {
      setErrorMessage(error.response?.data.error || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loading />
      </div>
    );
  }

  if (!account) {
    return <NoAccountCard />;
  }

  return (
    <>
      <div className="flex flex-col items-center gap-1">
        {account && (
          <>
            <div className="card bg-success text-neutral-content w-80 shadow-xl">
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
                    <span className="font-mono ">
                      {ibanFormat(account.iban)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center card-actions mt-2">
                  {/* close account action here  */}

                  {errorMessage && (
                    <p className="text-error bg-white pl-1 rounded-2xl">
                      {errorMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="divider"></div>

        {/* Transactions....... */}
        {account && <TransactionsList accountId={accountId} />}
      </div>
    </>
  );
};
