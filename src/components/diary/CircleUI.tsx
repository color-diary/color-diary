import React from 'react';

const CircleUI = () => {
  return (
    <>
      <div className="flex gap-70px-row-m md:flex-col md:gap-y-320px-col md:!p-0">
        <div className="flex md:flex-col justify-center gap-16px-row-m px-24px-row-m md:gap-40px-col md:!p-0">
          <div className="w-16px-row-m h-16px-col-m md:w-32px-row md:h-32px-row bg-white rounded-full"></div>
          <div className="w-16px-row-m h-16px-col-m md:w-32px-row md:h-32px-row bg-white rounded-full"></div>
          <div className="w-16px-row-m h-16px-col-m md:w-32px-row md:h-32px-row bg-white rounded-full"></div>
        </div>
        <div className="flex md:flex-col justify-center gap-16px-row-m px-24px-row-m md:gap-40px-col md:!p-0">
          <div className="w-16px-row-m h-16px-col-m md:w-32px-row md:h-32px-row bg-white rounded-full"></div>
          <div className="w-16px-row-m h-16px-col-m md:w-32px-row md:h-32px-row bg-white rounded-full"></div>
          <div className="w-16px-row-m h-16px-col-m md:w-32px-row md:h-32px-row bg-white rounded-full"></div>
        </div>
      </div>
    </>
  );
};

export default CircleUI;
