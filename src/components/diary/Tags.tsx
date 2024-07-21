import React from 'react';

const Tags = () => {
  return (
    <>
      <div className="flex flex-col gap-3">
        <p>Q. 오늘 나의 감정태그를 작성해볼까요?</p>
        <input className="w-[380px] h-[46px]" type="text" placeholder="#복잡해 #새로워 #알쏭달쏭" />
      </div>
    </>
  );
};

export default Tags;
