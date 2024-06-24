import React, { useContext, useEffect, useState } from "react";
import Card from "src/components/organisms/CardModal/CardModal";
import DropDownIcon from 'src/assets/images/down-light.png'
import WalletIcon from 'src/assets/images/wallet.png'
import Button from "../Button/Button";
import formatNumber from 'src/utils/formatNumber';
import { MainContext } from "src/context/MainContext";
import { MainContextType } from "src/context/MainContextType";
import { pocketAPI, walletAPI } from "src/api/useAPI";

type UnpaidBalanceType = {
  onClickHeader: () => void,
  handleSubmit?: () => void,
  pocketId: number,
  unpaid: number
}

type WalletDataType = {
  amount: number,
  created_at?: string,
  id?: number,
  income?: string,
  income_every?: string,
  is_active?: number,
  name?: string,
  udpated_at?: string,
  user_id?: number,
}[]

type PeyeeType = {
  pocket_id: number,
  wallet_id: number | undefined
}

function UnpaidBalance({ onClickHeader, handleSubmit, pocketId, unpaid }: UnpaidBalanceType) {
  const [dropDownState, setDropDownState] = useState<boolean>(false);
  const [activeDropDown, setActiveDropDown] = useState<number>(0);
  const [walletData, setWalletData] = useState<WalletDataType>([]);
  const [buttonState, setButtonState] = useState<boolean>(false);

  const [payee, setPayee] = useState<PeyeeType>({
    pocket_id: pocketId,
    wallet_id: 0
  });
  const {
    toast: notification,
    refresher: [refresher, setRefresher]
  } = useContext(MainContext) as MainContextType;

  useEffect(() => {
    walletAPI.getAllActiveWallet()
      .then(res => {
        setWalletData(res.data)
        setPayee(prev => ({ ...prev, wallet_id: res.data[activeDropDown]?.id }));
      })
      .catch(err => {
        console.log(err.response.data);
      })

  }, [])

  useEffect(() => {
    walletData[activeDropDown]?.amount < unpaid ? setButtonState(true) : setButtonState(false);
  });

  const selectPayee = (index: number, id: number): void => {
    setActiveDropDown(index);
    setDropDownState(!dropDownState);
    setPayee(prev => ({ ...prev, wallet_id: id }));
  }

  const onSubmit = (): void => {
    pocketAPI.payBalance(payee)
      .then(res => {
        onClickHeader();
        setRefresher(!refresher);
        notification('Balance Paid Successfully!');
      })
      .catch(err => {
        console.log(err.response.data);
      })
  }

  const moreData = walletData?.map((data: any, index: number) => {
    return (
      <div
        key={index}
        className={`${dropDownState ? "opacity-100 m-0 z-50" : "opacity-0 -mt-px-63 -z-10"} transition-all ease-in-out duration-600 hover:bg-background-dropdown-active selected flex flex-row justify-between items-center gap-6 pl-px-12 pr-px-9 py-px-6 text-15 cursor-pointer ${index + 1 === walletData.length && 'rounded-b-px-3'} ${activeDropDown === index ? 'bg-background-dropdown-active' : 'bg-background-dropdown-inactive'}`}
        onClick={() => selectPayee(index, data.id)} >
        <div className="flex flex-row gap-3">
          <div className="bg-primary-100 h-px-42 w-px-42 flex justify-center items-center rounded-px-3">
            <img src={WalletIcon} alt="logo" className="h-px-30 opacity-60" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-light-100">{data.name}</p>
            <p className={data?.amount < unpaid ? "text-error-100" : "text-success-100"}>₱ {formatNumber(data.amount)}</p>
          </div>
        </div>
      </div>
    )
  });
  return (
    <Card header={true} headerText="Pay Amount" onClickHeader={onClickHeader} closeModal={onClickHeader}>
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-13 font-medium">Outstanding balance</p>
          <p className="text-error-100 text-18 font-medium">₱ {formatNumber(unpaid)}</p>
        </div>
        <div className="flex flex-col mt-px-15 cursor-pointer z-50">
          <p className="text-13 font-medium">Pay from</p>
          <div onClick={() => setDropDownState(!dropDownState)} className={`bg-background-dropdown-selected rounded-t-px-3 ${dropDownState || 'rounded-b-px-3'} text-light-100 text-13 flex flex-row justify-between items-center p-px-12`}>
            <div className="flex flex-row gap-3">
              <div className="bg-primary-100 h-px-42 w-px-42 flex justify-center items-center rounded-px-3">
                <img src={WalletIcon} alt="logo" className="h-px-30 opacity-60" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-light-100">{walletData && walletData[activeDropDown]?.name}</p>
                <p className={walletData && walletData[activeDropDown]?.amount < unpaid ? "text-error-100" : "text-success-100"}>₱ {formatNumber(walletData && walletData[activeDropDown]?.amount)}</p>
              </div>
            </div>
            <img src={DropDownIcon} alt="dropdown" className={`h-px-20 ${dropDownState && 'rotate-180'}`} />
          </div>
          {moreData}
        </div>
      </div>
      <Button type="secondary" disabled={buttonState} text="Pay now" className="mt-px-50" onClick={onSubmit} />
    </Card>
  );
}

export default UnpaidBalance;
