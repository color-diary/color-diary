'use client';

import { useState } from 'react';

function Dropdown() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string): void => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const options: string[] = ['기능 문의', '버그 신고', '계정 관련 문의', '피드백 및 제안'];

  return (
    <div className="flex flex-col items-start gap-8px-col self-stretch mb-[24px]">
      <label className="self-stretch text-[var(--Grey-900,#080808)] font-pretendard text-16px-m md:text-18px font-medium tracking-[-0.36px]">
        문의 종류를 선택해주세요
      </label>
      <div
        className={`w-full flex items-center px-16px-row py-8px-col rounded-lg cursor-pointer bg-white border ${
          isOpen ? 'border-default' : 'border-input-color'
        }`}
        onClick={toggleDropdown}
      >
        <input
          type="text"
          value={selectedOption || '문의 종류 선택하기'}
          readOnly
          className="flex w-full outline-none text-14px-m md:text-18px cursor-pointer border-[#A1A1A1] py-1"
          style={{ textAlign: 'left' }}
        />
        <div>
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4.97638 14.8234C4.86374 14.7111 4.80034 14.5586 4.80011 14.3995C4.79989 14.2404 4.86286 14.0877 4.97518 13.975L11.532 7.39422C11.5933 7.33272 11.6661 7.28392 11.7463 7.25063C11.8266 7.21733 11.9125 7.2002 11.9994 7.2002C12.0862 7.2002 12.1722 7.21733 12.2524 7.25063C12.3326 7.28392 12.4055 7.33272 12.4668 7.39422L19.0248 13.975C19.1339 14.0883 19.1942 14.24 19.1926 14.3973C19.191 14.5546 19.1277 14.705 19.0163 14.8161C18.9049 14.9272 18.7543 14.9901 18.597 14.9912C18.4397 14.9924 18.2882 14.9317 18.1752 14.8222L12 8.62542L5.82478 14.8222C5.71243 14.9349 5.55993 14.9983 5.40083 14.9985C5.24173 14.9987 5.08906 14.9357 4.97638 14.8234Z"
                fill="#25B18C"
              />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M19.0248 9.17523C19.1374 9.28759 19.2008 9.44009 19.201 9.59919C19.2013 9.75828 19.1383 9.91096 19.026 10.0236L12.468 16.6044C12.4066 16.6661 12.3337 16.7151 12.2534 16.7485C12.1731 16.7819 12.0869 16.7991 12 16.7991C11.913 16.7991 11.8269 16.7819 11.7465 16.7485C11.6662 16.7151 11.5933 16.6661 11.532 16.6044L4.97636 10.0236C4.91914 9.9682 4.87353 9.90193 4.84219 9.82869C4.81085 9.75544 4.79442 9.67669 4.79384 9.59702C4.79326 9.51736 4.80856 9.43837 4.83883 9.36468C4.8691 9.29099 4.91375 9.22407 4.97016 9.16781C5.02657 9.11156 5.09362 9.0671 5.1674 9.03704C5.24118 9.00697 5.3202 8.9919 5.39987 8.99271C5.47953 8.99351 5.55824 9.01017 5.63139 9.04171C5.70455 9.07326 5.77069 9.11906 5.82596 9.17643L12 15.3744L18.1764 9.17643C18.2887 9.06379 18.4412 9.00039 18.6003 9.00016C18.7594 8.99994 18.9121 9.06291 19.0248 9.17523Z"
                fill="#080808"
              />
            </svg>
          )}
        </div>
      </div>
      {isOpen && (
        <ul className="flex py-16px-col px-8px-row gap-4 flex-col justify-center items-start self-stretch rounded-lg border-[1px] border-[#25B18C] bg-white">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className="w-full hover:rounded-lg hover:bg-[#DDF8F1] text-14px-m md:text-18px hover:text-[#1C876B]"
            >
              <div className="cursor-pointer w-full px-8px-row py-4px-col">{option}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
