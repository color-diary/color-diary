'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
}

const ProgressBar = ({ value, max }: ProgressBarProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress((value / max) * 100);
  }, [value, max]);

  return (
    <div className="relative h-6 flex bg-progress-total-color self-stretch shadow-progress-border rounded-lg">
      <div
        className="absolute top-0 left-0 h-6 bg-progress-current-color border-2 border-progress-border-color rounded-lg transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
