import React, { useContext, useEffect, useState } from "react";
import WalletIcon from 'src/assets/images/wallet.png'
import PocketIcon from 'src/assets/images/pocket.png'
import DropDownIcon from 'src/assets/images/down-light.png'
import Button from "src/components/molecules/Button/Button";
import formatNumber from "src/utils/formatNumber";
import Moment from 'react-moment';
import EditWallet from "../EditWallet/EditWallet";
import { MainContext } from "src/context/MainContext";
import { MainContextType } from "src/context/MainContextType";
import getTransactionTypeStyle from "src/utils/getTransactionTypeStyle";
import upperCaseFirstLetter from "src/utils/upperCaseFirstLetter";

export type WalletDropDownType = {
  walletData: {
    amount: number,
    income_every: string,
    name: string,
    created_at?: string,
    udpated_at?: string,
    user_id?: number,
    id?: number,
    is_active?: number,
    wallet_transaction: {
      amount: number,
      name: string,
      transaction_type: string,
      id?: number,
      wallet_id?: number
      created_at?: string,
      udpated_at?: string,
    }[]
  },
  onClickHistory?: () => void,
  onClickEdit?: () => void
}

function WalletDropDown({
  walletData,
  onClickHistory = () => { },
  onClickEdit = () => { }
}: WalletDropDownType) {
  const {
    wallet: {
      edit: [editWalletModal, setEditWalletModal],
      id: [walletId, setWalletId]
    }
  } = useContext(MainContext) as MainContextType;

  const { amount, name, id } = walletData;

  const [dropDownState, setDropDownState] = useState<boolean>(false);

  const walletState: boolean = parseFloat(amount?.toString().split(",").join("")) <= 0;

  const onEdit = (): void => {
    setWalletId(id || 0);
    setEditWalletModal(!editWalletModal);
  }

  const moreData = (
    <div className="bg-background-lightDark px-px-15 py-px-21 rounded-b-px-3">
      <span className="text-light-100 text-15 grid text-center">Latest Transactions</span>
      {walletData.wallet_transaction?.length === 0
        ? <span className="text-error-100 opacity-80 text-12 grid text-center mt-px-12">No transactions</span>
        : walletData.wallet_transaction?.slice(0).reverse().map((transaction, index: number) => {

          const transactionType = transaction.transaction_type;

          return index < 3 && (
            <div className="flex flex-row justify-between items-star mt-px-18" key={index}>
              <div className="flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                  <div className={`${transactionType === 'expense' ? 'bg-secondary-100' : 'bg-primary-100'} p-px-2 rounded-px-3 w-px-15`}>
                    <img src={transactionType === 'expense' ? PocketIcon : WalletIcon} alt="pocket" className="w-px-15" />
                  </div>
                  <h1 className="text-light-100 text-15">{transaction.name}</h1>
                </div>
                {/* <span className="text-light-60 text-12 overflow-hidden truncate w-40">{transaction_type}</span> */}
                <span className="text-inactive text-12"><Moment format="YYYY/MM/DD - hh:mm A">{transaction.created_at}</Moment></span>
              </div>
              <div className="flex flex-col justify-start items-end">
                <span className={`text-15 ${getTransactionTypeStyle(transactionType)}`}>{transactionType === 'expense' && '-'} ₱ {formatNumber(transaction.amount)}</span>
                <span className={`text-12 ${getTransactionTypeStyle(transactionType, '60')}`}>{upperCaseFirstLetter(transactionType)}</span>
              </div>
            </div>)
        })}
      <div className="grid grid-cols-2 gap-3 mt-px-30">
        <Button
          text="History"
          type="primaryInvert"
          height="medium"
          className="hover:opacity-90"
          onClick={onClickHistory} />
        <Button
          text="Edit"
          type="primary"
          height="medium"
          className="hover:opacity-90"
          onClick={onEdit} />
      </div>
    </div>
  )

  return (
    <>
      {editWalletModal && <EditWallet onClickHeader={() => setEditWalletModal(!editWalletModal)} />}
      <div className={`cursor-pointer wallet-dd bg-background-dark mt-px-3 p-px-12 rounded-t-px-3 ${dropDownState || 'rounded-b-px-3'}`} onClick={() => setDropDownState(!dropDownState)}>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-3">
            <div className="bg-primary-100 h-px-42 w-px-42 flex justify-center items-center rounded-px-3">
              <img src={WalletIcon} alt="logo" className="h-px-30 opacity-60" />
            </div>
            <div>
              <h1 className="text-15 text-light-100">{name}</h1>
              <span className={`text-15 ${walletState ? 'text-error-100' : 'text-success-100'}`}>₱ {formatNumber(amount)}</span>
            </div>
          </div>
          <img src={DropDownIcon} alt="logo" className={`h-px-20 ${dropDownState && 'rotate-180'}`} />
        </div>
      </div>
      {dropDownState && moreData}
    </>
  );
}

export default WalletDropDown;
