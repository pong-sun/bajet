import React, { useContext, useEffect, useState } from "react";
import Card from "src/components/organisms/CardModal/CardModal";
import CalendarIcon from 'src/assets/images/calendar.png'
import Button from "../../molecules/Button/Button";
import getOrdinalNumber from "src/utils/getOrdinalNumber";
import getMonthWord from "src/utils/getMonthWord";
import Calendar from "src/components/molecules/Calendar/Calendar";
import { MainContext } from "src/context/MainContext";
import { MainContextType } from "src/context/MainContextType";
import { PocketDataType } from "../AddPocket/AddPocket";
import style from "src/utils/styles";
import { pocketAPI } from "src/api/useAPI";

type EditPocketType = {
  onClickHeader: () => void,
  handleSubmit?: () => void
}

function EditPocket({ onClickHeader, handleSubmit }: EditPocketType) {
  const [oneDay, setOneDay] = useState<boolean>(false);
  const [calendar, setCalendar] = useState<boolean>(false);
  const [dateSelected, setDateSelected] = useState<string>('select-date-00');

  const selectedDay = dateSelected.split('-')[2];
  const selectedMonth = dateSelected.split('-')[1];

  const [archive, setArcive] = useState<number>(1);
  const {
    toast: notification,
    refresher: [refresher, setRefresher],
    pocket: {
      add: [addPocketModal, setAddPocketModal],
      edit: [editPocketModal, setEditPocketModal],
      id: [pocketId]
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

  useEffect(() => {
    pocketAPI.getSpecificPocket(pocketId)
      .then(res => {
        const data = res.data;
        setPocketData({
          name: data.name,
          amount: data.amount,
          schedule: data.schedule,
          schedule_date: data.schedule_date
        });
        setArcive(data.is_active);
        setOneDay(data.schedule === 'monthly' ? false : true);
        setDateSelected(data.schedule_date);
      })
      .catch(err => {
        console.log(err.response.data);
      })
  }, []);

  const onSubmit = (): void => {
    pocketAPI.updateSpecificPocket(pocketId, pocketData)
      .then(res => {
        notification('Wallet Updated Successfully!');
        setRefresher(!refresher);
        setEditPocketModal(!editPocketModal);
        setErrors({
          name: "",
          amount: "",
          schedule: "",
          schedule_date: ""
        });
        setRefresher(!refresher);
      })
      .catch(err => {
        setErrors(err.response.data.errors);
      })
  }

  const closeCalendar = (): void => {
    setCalendar(!calendar);
  }

  const selectedDate = (date: string): void => {
    setPocketData(prev => ({ ...prev, schedule_date: date }));
    setDateSelected(date);
    closeCalendar();
  }

  const handleChange = (e: any): void => {
    const name = e.target.name;
    const value = e.target.value;
    setPocketData((prev) => ({ ...prev, [name]: value }));
  }

  const deletePocket = (): void => {
    notification('Pocket Deleted Successfully!');
    pocketAPI.deletePocket(pocketId)
      .then(res => {
        setEditPocketModal(!editPocketModal);
        setRefresher(!refresher);
      });
  }

  const archivePocket = (): void => {
    notification('Pocket Archived Successfully!');
    pocketAPI.archivePocket(pocketId)
      .then(res => {
        setEditPocketModal(!editPocketModal);
        setRefresher(!refresher);
      });
  }

  const unarchivePocket = (): void => {
    notification('Pocket Unarchived Successfully!');
    pocketAPI.unarchivePocket(pocketId)
      .then(res => {
        setEditPocketModal(!editPocketModal);
        setRefresher(!refresher);
      });
  }


  return (
    <Card header={true} headerText="Edit Pocket" onClickHeader={onClickHeader} closeModal={onClickHeader} className="relative">
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
              className={`w-full ${oneDay || 'bg-primary-60'} hover:bg-primary-100`}
              height="medium"
              text="One day"
              onClick={() => {
                setOneDay(true);
                setPocketData((prev) => ({ ...prev, schedule: 'day' }));
              }} />
            <Button
              type="secondary"
              className={`w-full ${oneDay && 'bg-primary-60'} hover:bg-primary-100`}
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
      <div className="mt-px-40 flex flex-row items-center justify-center gap-2">
        <Button type="error" className="opacity-50 w-full hover:opacity-100" text="Delete" height="medium" onClick={deletePocket} />
        <Button type="success" className="opacity-50 w-full hover:opacity-100" text={archive ? 'Archive' : "Unarchive"} height="medium" onClick={archive ? archivePocket : unarchivePocket} />
      </div>
      <Button type="secondary" text="Continue" className="mt-px-9 hover:opacity-90" onClick={onSubmit} />
    </Card>
  );
}

export default EditPocket;
