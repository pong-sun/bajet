import React, { Fragment, useContext, useEffect, useState } from "react";
import Button from "src/components/molecules/Button/Button";
import CardContainer from "src/components/organisms/CardContainer/CardContainer";
import Back from 'src/assets/images/back-light.png'
import WalletIcon from 'src/assets/images/wallet.png'
import PocketIcon from 'src/assets/images/pocket.png'
import formatNumber from "src/utils/formatNumber";
import DropDownIcon from 'src/assets/images/down-light.png'
import DropDown from "src/components/molecules/DropDown/DropDown";
import sortOptions from "src/config/optionsDropDownTest.json";
import Footer from "src/components/molecules/Footer/Footer";
import Moment from "react-moment";
import Paginate from "src/components/molecules/Paginate/Paginate";
import BackToTop from "src/components/molecules/BackToTop/BackToTop";
import useScrollOnTop from "src/hooks/useScrollOnTop";
import Cookies from "js-cookie";
import resetOnTop from "src/utils/resetOnTop";
import style from "src/utils/styles";
import { MainContext } from "src/context/MainContext";
import { MainContextType } from "src/context/MainContextType";
import getTransactionTypeStyle from "src/utils/getTransactionTypeStyle";
import { useNavigate } from "react-router-dom";

function History() {
  const navigate = useNavigate();
  const [dropDownState, setDropDownState] = useState<boolean>(false);
  const [activeDropDown, setActiveDropDown] = useState<number>(0);
  const [accountType, setAccountType] = useState<string>('wallet');
  const [allTransactions, setAllTransactions] = useState<boolean>(false);
  const [transactionText, setTransactionText] = useState<string>('');
  const {
    refresher: [refresher],
    history: {
      api: {
        getHistory,
        getAllActiveAccounts,
      },
      data: [historyData],
      logs: [historyLogs],
      pageCount: [sortByPageCount]
    }
  } = useContext(MainContext) as MainContextType;

  const { backToTop } = useScrollOnTop(300);

  const selectedDropDown = historyLogs[activeDropDown];
  const selectedAccount = activeDropDown < 0 ? historyData : selectedDropDown?.wallet_transaction || selectedDropDown?.pocket_transaction;

  const pageCount = [
    { state: 5 },
    { state: 10 },
    { state: 15 },
    { state: 20 },
    { state: 25 },
    { state: 30 }
  ];

  useEffect(() => {
    resetOnTop();
  }, [])

  useEffect(() => {
    getAllActiveAccounts(accountType);
  }, [refresher, accountType])

  const headerLeft = (
    <div onClick={() => navigate("/")} className="flex bg-background-dark text-light-100 items-center cursor-pointer">
      <img src={Back} alt="go-back" className="h-px-25" />
    </div>
  );

  const selectDropDown = (index: number): void => {
    setDropDownState(false);
    setAllTransactions(false)
    setActiveDropDown(index);
  }

  const selectAll = (type: string): void => {
    setDropDownState(false);
    setActiveDropDown(-1);

    switch (type) {
      case 'all': {
        getHistory('all');
        setAccountType('all');
        setTransactionText('All Account Transactions');
        setAllTransactions(true);
        break;
      }
      case 'wallet': {
        getHistory('wallet');
        setAccountType('wallet');
        setTransactionText('All Wallet Transactions');
        break;
      }
      case 'pocket': {
        getHistory('pocket');
        setAccountType('pocket');
        setTransactionText('All Pocket Transactions');
        break;
      }
      default: {
        break;
      }
    }
  }

  const selectWallet = (): void => {
    setAccountType('wallet');
    setAllTransactions(false);
    setActiveDropDown(0);
  }

  const selectPocket = (): void => {
    setAccountType('pocket');
    setAllTransactions(false);
    setActiveDropDown(0);
  }

  const accountDropDownData = historyLogs?.map((data: any, index: number) => {
    return (
      <Fragment key={index}>
        <div
          className={`hover:bg-background-dropdown-active selected flex flex-row justify-between items-center gap-6 pl-px-12 pr-px-9 py-px-6 text-15 cursor-pointer ${activeDropDown === index ? 'bg-background-dropdown-active' : 'bg-background-dropdown-inactive'}`}
          onClick={() => selectDropDown(index)} >
          <div className="flex flex-row gap-3">
            <div className={`${data.income_every ? 'bg-primary-100' : 'bg-secondary-100'}  h-px-42 w-px-42 flex justify-center items-center rounded-px-3`}>
              <img src={data.income_every ? WalletIcon : PocketIcon} alt="logo" className="h-px-30 opacity-60" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-light-100">{data.name}</p>
              <p className={"text-success-100"}>₱ {formatNumber(data.amount)}</p>
            </div>
          </div>
        </div>
        {index + 1 === historyLogs.length && (
          <div
            className="hover:bg-background-dropdown-active selected py-px-12 flex flex-row justify-center items-center gap-6 pl-px-12 pr-px-9 text-15 cursor-pointer rounded-b-px-3 bg-background-lightDark"
            onClick={() => selectAll(data.income_every ? "wallet" : "pocket")} >
            <h1 className="text-light-100 text-15">{data.income_every ? "All Wallet Transactions" : "All Pocket Transactions"}</h1>
          </div>
        )}
      </Fragment>
    )
  });

  const transactionListData = selectedAccount?.length === 0
    ? <span className="text-error-100 opacity-80 text-18 grid text-center mt-px-12">No transactions</span>
    : selectedAccount?.map((data: any, index: number) => {

      const accountType = allTransactions ? data.account_type : data.pocket_id ? "pocket" : "wallet";
      const transactionType = data.data?.transaction_type || data.transaction_type;

      const amount = data.data?.amount || data.amount || 0;
      const name = activeDropDown < 0 ? data.data?.name || data?.name || data.data?.pocket?.name || data?.wallet?.name || data?.pocket?.name : transactionType === 'expense' ? data.name : selectedDropDown.name;
      const date = data?.data?.created_at || data.created_at;

      const logoCondition = accountType === "wallet" ? transactionType === "expense" ? PocketIcon : WalletIcon : transactionType === "payment" ? WalletIcon : PocketIcon;
      const logoStyleCondition = accountType === "wallet" ? transactionType === "expense" ? 'bg-secondary-100' : 'bg-primary-100' : transactionType === "payment" ? 'bg-primary-100' : 'bg-secondary-100';

      return (
        <div key={index} className={`wallet-dd bg-background-dark p-px-12 rounded-t-px-3 rounded-b-px-3`}>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-3">
              <div className={`${logoStyleCondition} h-px-42 w-px-42 flex justify-center items-center rounded-px-3`}>
                <img src={logoCondition} alt="logo" className="h-px-30 opacity-60" />
              </div>
              <div>
                <h1 className="text-15 text-light-100">{name}</h1>
                <span className="text-inactive text-12"><Moment format="YYYY/MM/DD - hh:mm A">{date}</Moment></span>
              </div>
            </div>
            <div className="flex flex-col justify-start items-end">
              <span className={`text-15 ${getTransactionTypeStyle(transactionType)}`}>{transactionType === 'expense' && '-'} ₱ {formatNumber(amount)}</span>
              <span className={`text-12 ${getTransactionTypeStyle(transactionType, '60')}`}>{transactionType.replace(/^(.)|\s+(.)/g, (c: string) => c.toUpperCase())}</span>
            </div>
          </div>
        </div>
      );
    });

  return (
    <div className={`${style.body.default}`} >
      <CardContainer header={true} textCenter="Transaction History" headerLeft={headerLeft} hr={true} className="flex flex-col gap-5" headerClass="bg-background-dark/100 pb-px-6">
        <div className="flex flex-row items-center justify-end mt-px-12">
          <label htmlFor="search" className="text-13 font-medium pr-px-30 ">Search: </label>
          <input name="search" placeholder="|" type="text" className="w-full bg-background-dropdown-selected h-px-30 rounded-px-3 text-light-100 text-13 px-px-12" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-13 font-medium pr-px-30">Account Type</h1>
          <div className="flex flex-row items-center justify-center gap-2">
            <Button type="secondary" className={`${accountType === 'wallet' || 'opacity-50'} ${allTransactions && 'opacity-50'} w-full`} text="Wallet" height="medium" onClick={selectWallet} />
            <Button type="secondary" className={`${accountType === 'pocket' || 'opacity-50'} ${allTransactions && 'opacity-50'} w-full`} text="Pocket" height="medium" onClick={selectPocket} />
            <Button type="secondary" className={`${allTransactions || 'opacity-50'} w-full`} text="All" height="medium" onClick={() => selectAll('all')} />
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-13 font-medium mb-px-9">Select Account</p>
          <div onClick={() => allTransactions || setDropDownState(!dropDownState)} className={`cursor-pointer bg-background-dropdown-selected rounded-t-px-3 ${dropDownState || 'rounded-b-px-3'} text-light-100 text-13 flex flex-row justify-between items-center p-px-12`}>
            {activeDropDown < 0
              ? <>
                <div className="h-px-20" ></div>
                <h1 className="text-light-100 text-15">{transactionText}</h1>
                <div className="h-px-20" ></div>
              </>
              : historyLogs.length === 0
                ? <>
                  <div className="h-px-20" ></div>
                  <h1 className="text-light-100 text-15">{"No Available Data"}</h1>
                  <div className="h-px-20" ></div>
                </>
                : <>
                  <div className="flex flex-row gap-3">
                    <div className={`${selectedDropDown?.income_every ? 'bg-primary-100' : 'bg-secondary-100'} h-px-42 w-px-42 flex justify-center items-center rounded-px-3`}>
                      <img src={selectedDropDown?.income_every ? WalletIcon : PocketIcon} alt="logo" className="h-px-30 opacity-60" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-light-100">{selectedDropDown?.name}</p>
                      <p className={"text-success-100"}>₱ {formatNumber(selectedDropDown?.amount)}</p>
                    </div>
                  </div>
                  <img src={DropDownIcon} alt="dropdown" className={`h-px-20 ${dropDownState && 'rotate-180'}`} />
                </>
            }

          </div>
          {dropDownState && accountDropDownData}
        </div>

        <DropDown options={sortOptions.wallet} type="wallet" />
        <DropDown options={pageCount} type="page_count" sortText="Page Count:" />

        <div className="flex flex-col gap-1">
          {transactionListData}
        </div>

        <Paginate data={{
          last_page: 3,
          current_page: 1,
          per_page: 5,
        }} type="setWalletPage" />


      </CardContainer>
      {backToTop && <BackToTop />}
      <Footer />
    </div>
  );
}

export default History;
