import React, { useContext, useEffect, useState } from "react";
import formatNumber from "src/utils/formatNumber";
import WalletIcon from 'src/assets/images/wallet.png'
import DropDownIcon from 'src/assets/images/down-light.png'
import PocketIcon from 'src/assets/images/pocket.png'
import { MainContext } from "src/context/MainContext";
import { MainContextType } from "src/context/MainContextType";
import upperCaseFirstLetter from "src/utils/upperCaseFirstLetter";

function AccountDropDown({ setActive = 0, accountData, className = "", accountType, text = "", selected = () => { } }: any) {
  const [dropDownState, setDropDownState] = useState<boolean>(false);
  const [activeDropDown, setActiveDropDown] = useState<number>(setActive);
  const {
    api: {
      getActiveAccount
    },
    refresher: [refresher],
    dropDownData: [, setSelectedAccountData],
    wallet: { id: [, setWalletId] },
    pocket: { id: [, setPocketId] }
  } = useContext(MainContext) as MainContextType;

  const returnSelected = (data: number) => {
    const type = text.toLowerCase();
    switch (type) {
      case "from": {
        return selected(data, type);
      }
      case "to": {
        return selected(data, type);
      }

      default: {
        return selected(data);
      }
    }
  };

  const selectPayee = (index: number, id: number): void => {
    setActiveDropDown(index);
    setDropDownState(!dropDownState);
    setSelectedAccountData(accountData[index]);
    returnSelected(accountData[index]);
  }

  const accountDataState = accountData[0] === 'loading' || accountData.length === 0;

  useEffect(() => {
    getActiveAccount(accountType);
    returnSelected(accountData[activeDropDown]);
  }, [accountDataState, refresher]);

  useEffect(() => {
    setSelectedAccountData(accountData[activeDropDown]);
    accountType === "wallet" ? setWalletId(accountData[activeDropDown]?.id) : setPocketId(accountData[activeDropDown]?.id);
  });

  const moreData = accountData?.map((data: any, index: number) => {
    return (
      <div
        key={index}
        className={`${dropDownState ? "opacity-100 m-0 z-50" : "opacity-50 -mt-px-63 z-10"} transition-all ease-in-out duration-600 hover:bg-background-dropdown-active selected flex flex-row justify-between items-center gap-6 pl-px-12 pr-px-9 py-px-6 text-15 cursor-pointer ${index + 1 === accountData.length && 'rounded-b-px-3'} ${activeDropDown === index ? 'bg-background-dropdown-active' : 'bg-background-dropdown-inactive'}`}
        onClick={() => selectPayee(index, data.id)} >
        <div className="flex flex-row gap-3">
          <div className={`${accountType === "wallet" ? "bg-primary-100" : "bg-secondary-100"} h-px-42 w-px-42 flex justify-center items-center rounded-px-3`}>
            <img src={accountType === "wallet" ? WalletIcon : PocketIcon} alt="logo" className="h-px-30 opacity-60" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-light-100">{data.name}</p>
            <p className="text-success-100">₱ {formatNumber(data.amount)}</p>
          </div>
        </div>
      </div>
    )
  });

  return (
    <div className={`${className} flex flex-col`}>
      <p className="text-13 font-medium">{text || `Select ${upperCaseFirstLetter(accountType)}`}: </p>
      {
        accountDataState
          ? <>
            <div className="bg-background-dropdown-selected text-15 flex justify-center items-center p-px-12 rounded-px-3 ">
              <h1 className={accountData[0] === 'loading' ? "text-light-100" : "text-error-100"}>
                {accountData[0] === 'loading' ? "Loading..." : "No Available Data"}
              </h1>
            </div>
          </>
          : <div onClick={() => setDropDownState(!dropDownState)} className={` cursor-pointer bg-background-dropdown-selected z-50 rounded-t-px-3 ${dropDownState || 'rounded-b-px-3'} text-light-100 text-13 flex flex-row justify-between items-center p-px-12`}>
            <div className="flex flex-row gap-3">
              <div className={`${accountType === "wallet" ? "bg-primary-100" : "bg-secondary-100"}  h-px-42 w-px-42 flex justify-center items-center rounded-px-3`}>
                <img src={accountType === "wallet" ? WalletIcon : PocketIcon} alt="logo" className="h-px-30 opacity-60" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-light-100">{accountData && accountData[activeDropDown]?.name}</p>
                <p className="text-success-100">₱ {formatNumber(accountData && accountData[activeDropDown]?.amount)}</p>
              </div>
            </div>
            <img src={DropDownIcon} alt="dropdown" className={`h-px-20 duration-500 ease-in-out ${dropDownState && 'rotate-180'}`} />
          </div>
      }
      {accountDataState || moreData}
    </div>
  );
}

export default AccountDropDown;
