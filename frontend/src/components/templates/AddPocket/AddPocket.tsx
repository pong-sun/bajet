import React, { useContext, useState } from "react";
import Card from "src/components/organisms/CardModal/CardModal";
import CalendarIcon from 'src/assets/images/calendar.png'
import Button from "src/components/molecules/Button/Button";
import Calendar from "src/components/molecules/Calendar/Calendar";
import getOrdinalNumber from 'src/utils/getOrdinalNumber';
import getMonthWord from "src/utils/getMonthWord";
import { MainContext } from "src/context/MainContext";
import { MainContextType } from "src/context/MainContextType";
import style from "src/utils/styles";
import { pocketAPI } from "src/api/useAPI";

type AddPocketType = {
  onClickHeader: () => void,
  handleSubmit?: () => void
}

export type PocketDataType = {
  name: string,
  amount: number | string,
  schedule: string,
  schedule_date: string
}

function AddPocket({ onClickHeader, handleSubmit }: AddPocketType) {
  const [oneDay, setOneDay] = useState<boolean>(false);
  const [calendar, setCalendar] = useState<boolean>(false);
  const [dateSelected, setDateSelected] = useState<string>('select-date-00');

  const selectedDay = dateSelected.split('-')[2];
  const selectedMonth = dateSelected.split('-')[1];

  const {
    toast: notification,
    refresher: [refresher, setRefresher],
    pocket: {
      add: [addPocketModal, setAddPocketModal]
    }
  } = useContext(MainContext) as MainContextType;

  const [pocketData, setPocketData] = useState<PocketDataType>({
    name: "",
    amount: "",
    schedule: "monthly",
    schedule_date: '0000-00-00'
  });
  const [errors, setErrors] = useState<any>({
    name: "",
    amount: "",
    schedule: "",
    schedule_date: ""
  });
  const { name: nameError, amount: amountError, schedule_date: schedule_dateError } = errors || {};

  const closeCalendar = (): void => {
    setCalendar(!calendar);
  }

  const selectedDate = (date: string): void => {
    setDateSelected(date);
    setPocketData((prev) => ({ ...prev, schedule_date: date }));
    closeCalendar();
  }

  const handleChange = (e: any): void => {
    const name = e.target.name;
    const value = e.target.value;
    setPocketData((prev) => ({ ...prev, [name]: value }));
  }

  const onSubmit = (): void => {
    pocketAPI.createPocket(pocketData)
      .then(res => {
        notification('Pocket Created Successfully!');
        setRefresher(!refresher);
        setAddPocketModal(!addPocketModal);
        setPocketData({
          name: "",
          amount: "",
          schedule: "monthly",
          schedule_date: '0000-00-00'
        });
        setErrors({
          name: "",
          amount: "",
          schedule: "",
          schedule_date: ""
        });
      })
      .catch(err => {
        setErrors(err.response.data.errors);
      })
  }

  return (
    <Card header={true} headerText="Add Pocket" onClickHeader={onClickHeader} closeModal={onClickHeader} className="relative">
      {calendar && <Calendar closeCalendar={closeCalendar} selectedDate={selectedDate} />}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <label htmlFor="pocket_name" className="text-13 font-medium">Pocket name</label>
          <input value={pocketData.name} onChange={handleChange} name="name" type="text" className="bg-background-dropdown-selected h-px-30 rounded-px-3 text-light-100 text-13 px-px-12" />
          <span className={style.inputError}>{nameError}</span>
        </div>
        <div className="flex flex-col">
          <label htmlFor="amount" className="text-13 font-medium">Amount</label>
          <input value={pocketData.amount || ""} placeholder="0.00" onChange={handleChange} name="amount" type="number" className="bg-background-dropdown-selected h-px-30 rounded-px-3 text-success-100 text-13 px-px-12" />
          <span className={style.inputError}>{amountError}</span>
        </div>
      </div>
      <div className="mt-px-30">
        <div className="flex flex-col gap-2">
          <p className="text-13 font-medium">Schedule</p>
          <div className="flex flex-row gap-2">
            <Button
              type="secondary"
              className={`w-full ${!oneDay && 'opacity-50'} hover:opacity-100`}
              height="medium"
              text="One day"
              onClick={() => {
                setOneDay(true);
                setPocketData((prev) => ({ ...prev, schedule: 'day' }));
              }} />
            <Button
              type="secondary"
              className={`w-full ${oneDay && 'opacity-50'} hover:opacity-100`}
              height="medium"
              text="Monthly"
              onClick={() => {
                setOneDay(false);
                setPocketData((prev) => ({ ...prev, schedule: 'monthly' }));
              }} />
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-px-12">
          <p className="text-13 font-medium">Schedule date</p>
          <Button fontType="dark" type="secondaryInvert" className="w-full hover:border-primary-60" height="medium" text={dateSelected} onClick={() => setCalendar(!calendar)} />
        </div>
        <div className="flex flex-row gap-2 mt-px-12">
          <img src={CalendarIcon} alt="dropdown" className='h-px-20 w-px-20' />
          <p className="text-13 font-medium">{oneDay ? 'on' : 'every'} {getOrdinalNumber(selectedDay)} of {oneDay ? getMonthWord(selectedMonth) : 'the Month'}</p>
        </div>
        <span className={style.inputError}>{schedule_dateError}</span>
      </div>
      <Button type="secondary" text="Continue" className="mt-px-50" onClick={onSubmit} />
    </Card>
  );
}

export default AddPocket;
