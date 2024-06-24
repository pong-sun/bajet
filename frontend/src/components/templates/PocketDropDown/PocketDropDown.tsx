import React, { useContext, useState } from "react";
import PocketIcon from 'src/assets/images/pocket.png'
import WalletIcon from 'src/assets/images/wallet.png'
import Calendar from 'src/assets/images/calendar-light.png'
import DropDownIcon from 'src/assets/images/down-light.png'
import Button from "src/components/molecules/Button/Button";
import formatNumber from "src/utils/formatNumber";
import Moment from 'react-moment';
import getMonthWord from "src/utils/getMonthWord";
import getOrdinalNumber from "src/utils/getOrdinalNumber";
import moment from "moment";
import 'moment-timezone';
import { MainContext } from "src/context/MainContext";
import { MainContextType } from "src/context/MainContextType";
import EditPocket from "../EditPocket/EditPocket";
import UnpaidBalance from "src/components/molecules/UnpaidBalance/UnpaidBalance";
import getTransactionTypeStyle from "src/utils/getTransactionTypeStyle";
import upperCaseFirstLetter from "src/utils/upperCaseFirstLetter";

type PocketDropDownType = {
  pocketData: {
    amount: number,
    amount_to_pay: number,
    schedule: string,
    schedule_date: string,
    name: string,
    created_at?: string,
    udpated_at?: string,
    user_id?: number,
    id: number,
    is_active?: number,
    pocket_transaction: {
      amount: number,
      transaction_type: string,
      id?: number,
      pocket_id?: number
      created_at?: string,
      udpated_at?: string,
      wallet: {
        id: number,
        user_id: number,
        name: string,
        income_every: string,
        amount: number,
        is_active: number,
        created_at: string,
        updated_at: string
      }
    }[]
  },
  onClickHistory?: () => void,
  onClickEdit?: () => void,
  onClickPay?: () => void
}

function PocketDropDown({
  pocketData,
  onClickHistory = () => { },
  onClickEdit = () => { },
  onClickPay = () => { }
}: PocketDropDownType) {
  const { amount, name, amount_to_pay, schedule_date, schedule, id } = pocketData;

  const [dropDownState, setDropDownState] = useState<boolean>(false);

  const dayToday = moment().format("YYYY/MM/DD").split('/')[2];
  const pocketState = parseFloat(amount?.toString().split(",").join("")) < 0;

  const selectedDay = schedule_date.split('-')[2];
  const selectedMonth = schedule_date.split('-')[1];
  const oneDay = schedule === 'monthly' ? false : true;

  const dayDifference = Number(selectedDay) - Number(dayToday);

  const [payState, setPayState] = useState<boolean>(false);

  const {
    pocket: {
      edit: [editPocketModal, setEditPocketModal],
      id: [, setWalletId]
    }
  } = useContext(MainContext) as MainContextType;

  const onEdit = (): void => {
    setWalletId(id || 0);
    setEditPocketModal(!editPocketModal);
  }

  const pay = (): void => {
    setPayState(!payState);
  }

  const moreData = (
    <div className="bg-background-lightDark px-px-15 py-px-21 rounded-b-px-3">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-light-100 text-12">Schedule</h1>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-3">
              <img src={Calendar} alt="calendar" className="w-px-18" />
              <p className="text-light-100 text-12">{oneDay ? 'on' : 'every'} {getOrdinalNumber(selectedDay)} of {oneDay ? getMonthWord(selectedMonth) : 'the Month'}</p>
            </div>
            <span className={`${dayDifference < 0 ? "text-fail-60" : "text-success-60"} text-12`}>
              {dayDifference < 0 ? Math.abs(dayDifference) + " days ago" : dayDifference + " days to go"}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-light-100 text-12">Unpaid balance</h1>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-3">
              <span className={`text-error-100 text-12 ${amount_to_pay <= 0 && 'opacity-50 text-success-100'}`}>₱ {formatNumber(amount_to_pay)}</span>
            </div>
            <Button
              text="Pay"
              height="medium"
              className={`w-20 h-px-25 ${amount_to_pay <= 0 && 'cursor-not-allowed opacity-50'} `}
              onClick={() => {
                if (amount_to_pay > 0) {
                  return pay();
                } return
              }} />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-light-100 text-12 mb-px-12">Latest transactions</h1>
          {pocketData.pocket_transaction?.length === 0
            ? <span className="text-error-100 opacity-80 text-12 grid text-center mt-px-12">No transactions</span>
            : pocketData.pocket_transaction?.slice(0).reverse().map((transaction, index: number) => {

              const transactionType = transaction.transaction_type;
              const isWallet = transactionType === 'expense' || transactionType === 'payment';

              return index < 3 && (
                <div className="flex flex-row justify-between items-end" key={index}>
                  <div className="flex flex-row gap-3">
                    <div>
                      <div className={`${isWallet ? 'bg-primary-100' : 'bg-secondary-100'} p-px-2 rounded-px-3`}>
                        <img src={isWallet ? WalletIcon : PocketIcon} alt="pocket" className="w-px-15" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-center">
                      <h1 className="text-light-100 text-14">{transactionType === 'update' ? pocketData.name : transaction.wallet?.name}</h1>
                      <span className={`text-10 ${getTransactionTypeStyle(transactionType, '60')}`}>{upperCaseFirstLetter(transaction.transaction_type)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end items-end">
                    <h1 className={`text-13 ${getTransactionTypeStyle(transactionType)}`}>{transactionType === "expense" && '- '}₱ {formatNumber(transaction.amount)}</h1>
                    <span className="text-inactive text-10"><Moment format="YYYY/MM/DD - hh:mm A" >{transaction?.created_at}</Moment></span>
                  </div>
                </div>)
            })}

        </div>
      </div>
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
          className="hover:opacity-90"
          height="medium"
          onClick={onEdit} />
      </div>
    </div>
  )

  return (
    <>
      {editPocketModal && <EditPocket onClickHeader={() => setEditPocketModal(!editPocketModal)} />}
      {payState && <UnpaidBalance onClickHeader={() => setPayState(false)} pocketId={id} unpaid={amount_to_pay} />}
      <div className={`cursor-pointer wallet-dd bg-background-dark mt-px-3 p-px-12 rounded-t-px-3 ${dropDownState || 'rounded-b-px-3'}`} onClick={() => setDropDownState(!dropDownState)}>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-3">
            <div className="bg-secondary-100 h-px-42 w-px-42 flex justify-center items-center rounded-px-3">
              <img src={PocketIcon} alt="logo" className="h-px-30 opacity-60" />
            </div>
            <div>
              <h1 className="text-15 text-light-100">{name}</h1>
              <span className={`text-15 ${pocketState ? 'text-error-100' : 'text-fail-100'}`}>{pocketState && '- '}₱ {formatNumber(amount)}</span>
            </div>
          </div>
          <img src={DropDownIcon} alt="logo" className={`h-px-20 ${dropDownState && 'rotate-180'}`} />
        </div>
      </div>
      {dropDownState && moreData}
    </>
  );
}

export default PocketDropDown;
