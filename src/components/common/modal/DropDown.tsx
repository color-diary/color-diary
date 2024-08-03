import React, { useState } from 'react';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: any) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const options = ['기능 문의', '버그 신고', '계정 관련 문의', '피드백 및 제안'];

  return (
    <div className="flex flex-col items-start gap-2 self-stretch ">
      <label className=' self-stretch "text-[var(--Grey-900,#080808)] font-pretendard text-18px font-medium leading-[24.3px] tracking-[-0.36px]"'>
        문의 종류를 선택해주세요
      </label>
      <input
        type="text"
        value={selectedOption || "---------------------문의종류 선택하기---------------------"}
        onClick={toggleDropdown}
        readOnly
        className="w-full px-4 py-2 rounded-lg border-[1px] border-[#25B18C] outline-none cursor-pointer text-18px"
      />
      {isOpen && (
        <ul className="flex py-4 px-2 gap-4 flex-col justify-center items-start self-stretch rounded-lg border-[1px] border-[#25B18C] bg-white">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className="w-full hover:rounded-lg hover:bg-[#DDF8F1] text-18px"
            >
              <div className="cursor-pointer w-full px-2 py-1">{option}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
