import React, { useContext, useState } from "react";
import Card from "src/components/organisms/CardModal/CardModal";
import DropDownIcon from 'src/assets/images/down-light.png'
import Button from "src/components/molecules/Button/Button";
import { walletAPI } from "src/api/useAPI";
import { MainContext } from "src/context/MainContext";
import { MainContextType } from "src/context/MainContextType";
import style from "src/utils/styles";

type AddWalletType = {
  onClickHeader: () => void,
  handleSubmit?: () => void
}

export type WalletDataType = {
  name: string,
  amount: number | string,
  income: number | string,
  income_every: string,
}

function AddWallet({ onClickHeader, handleSubmit }: AddWalletType) {
  const {
    toast: notification,
    refresher: [refresher, setRefresher],
    wallet: {
      add: [addWalletModal, setAddWalletModal]
    }
  } = useContext(MainContext) as MainContextType;

  const [walletData, setWalletData] = useState<WalletDataType>({
    name: "",
    amount: "",
    income: "",
    income_every: "15 Days",
  });
  const [errors, setErrors] = useState({
    name: "",
    amount: ""
  });
  const { name: nameError, amount: amountError } = errors;

  const handleChange = (e: any): void => {
    const name = e.target.name;
    const value = e.target.value;
    setWalletData((prev) => ({ ...prev, [name]: value }));
  }

  const setDropDown = (index: number): void => {
    setActiveDropDown(index);
    setWalletData((prev) => ({ ...prev, income_every: options[index] }));
    setDropDownState(!dropDownState);
  }

  const onSubmit = (): void => {
    walletAPI.createWallet(walletData)
      .then(res => {
        notification('Wallet Created Successfully!');
        setRefresher(!refresher);
        setAddWalletModal(!addWalletModal);
        setWalletData({
          name: "",
          amount: "",
          income: "",
          income_every: "15 Days",
        });
        setErrors({
          name: "",
          amount: ""
        });
      })
      .catch(err => {
        setErrors(err.response.data.errors);
      })
  }

  const [dropDownState, setDropDownState] = useState<boolean>(false);
  const [activeDropDown, setActiveDropDown] = useState<number>(2);

  const options: string[] = [
    'N/A',
    '1 Day',
    '15 Days',
    '30 Days'
  ]

  const moreData = options.map((option, index) => {
    return (
      <div
        key={index}
        className={`selected flex flex-row justify-between items-center gap-6 pl-px-12 pr-px-9 py-px-6 text-15  cursor-pointer ${index + 1 === options.length && 'rounded-b-px-3'} ${activeDropDown === index ? 'bg-background-dropdown-active' : 'bg-background-dropdown-inactive'}`}
        onClick={() => setDropDown(index)} >
        <span className="text-light-100">{option}</span>
      </div>
    )
  });

  return (
    <Card header={true} headerText="Add wallet" onClickHeader={onClickHeader} closeModal={onClickHeader}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label htmlFor="wallet_name" className="text-13 font-medium">Wallet name</label>
          <input value={walletData.name} onChange={handleChange} name="name" type="text" className="bg-background-dropdown-selected h-px-30 rounded-px-3 text-light-100 text-13 px-px-12" />
          <span className={style.inputError}>{nameError}</span>
        </div>
        <div className="flex flex-col">
          <p className="text-13 font-medium">Automated Income every</p>
          <div onClick={() => setDropDownState(!dropDownState)} className={`bg-background-dropdown-selected cursor-pointer h-px-30 rounded-t-px-3 ${dropDownState || 'rounded-b-px-3'} text-light-100 text-13 flex flex-row justify-between items-center p-px-12`}>
            <p>{options[activeDropDown]}</p>
            <img src={DropDownIcon} alt="dropdown" className={`h-px-20 ${dropDownState && 'rotate-180'}`} />
          </div>
          {dropDownState && moreData}
        </div>
        <div className="flex flex-col">
          <label htmlFor="amount" className="text-13 font-medium">Income Amount</label>
          <input value={walletData.amount || ""} placeholder="0.00" onChange={handleChange} name="amount" type="number" className="bg-background-dropdown-selected h-px-30 rounded-px-3 text-success-100 text-13 px-px-12" />
          <span className={style.inputError}>{amountError}</span>
        </div>
      </div>
      <Button type="secondary" text="Continue" className="mt-px-50" onClick={onSubmit} />
    </Card>
  );
}

export default AddWallet;
