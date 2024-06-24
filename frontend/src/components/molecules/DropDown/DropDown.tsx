import React, { useContext, useState } from "react";
import DropDownIcon from 'src/assets/images/down-light.png'
import { MainContext } from "src/context/MainContext";
import { MainContextType } from "src/context/MainContextType";

type OptionType = {
  options: {
    wallet: [
      {
        "state": string,
        "sort_by": string,
        "sort_type": string
      }[]
    ],
    pocket: [
      {
        "state": string,
        "sort_by": string,
        "sort_type": string
      }[]
    ]
  }
}

function DropDown({ options, type, sortText = 'Sort by:' }: any) {
  const [dropDownState, setDropDownState] = useState<boolean>(false);
  const [activeDropDown, setActiveDropDown] = useState<number>(0);
  const {
    wallet: {
      sort: [, setSortByWallet]
    },
    pocket: {
      sort: [, setSortByPocket]
    },
    history: {
      pageCount: [, setSortByPageCount]
    }
  } = useContext(MainContext) as MainContextType;
  // Inject context here for active state

  const handleDropDown = (): void => {
    setDropDownState(!dropDownState);
  }

  const setActive = (index: number): void => {
    setActiveDropDown(index);
    setDropDownState(!dropDownState);
    switch (type) {
      case 'wallet': {
        setSortByWallet({
          sort_by: options[index].sort_by,
          sort_type: options[index].sort_type,
          archive: options[index].archive
        })
        break;
      }
      case 'pocket': {
        setSortByPocket({
          sort_by: options[index].sort_by,
          sort_type: options[index].sort_type,
          archive: options[index].archive
        })
        break;
      }
      case 'page_count': {
        setSortByPageCount(index);
        break;
      }
      default:
        break;
    }
  }

  const dropDownMenu = options.map((option: any, index: number) => {
    return (
      <div
        key={index}
        className={`hover:bg-background-dropdown-active selected flex flex-row justify-between items-center gap-6 pl-px-12 pr-px-9 py-px-6 text-15  cursor-pointer ${index + 1 === options.length && 'rounded-b-px-3'} ${activeDropDown === index ? 'bg-background-dropdown-active' : 'bg-background-dropdown-inactive'}`}
        onClick={() => setActive(index)} >
        <span className="text-light-100">{option.state}</span>
      </div>
    )
  })
  return (
    <div className="flex flex-row justify-between items-start gap-6">
      <span className="text-15 font-medium w-px-160 mt-px-6">{sortText}</span>
      <div className="w-full">
        <div className={`selected flex flex-row justify-between items-center gap-6 pl-px-12 pr-px-9 py-px-6 text-15 bg-background-dropdown-selected rounded-t-px-3 ${dropDownState || 'rounded-b-px-3'} cursor-pointer	`} onClick={handleDropDown} >
          <span className="text-light-100">{options[activeDropDown].state}</span>
          <img src={DropDownIcon} alt="logo" className={`h-px-20 ${dropDownState && 'rotate-180'}`} />
        </div>
        {dropDownState && dropDownMenu}
      </div>
    </div>
  );
}

export default DropDown;
