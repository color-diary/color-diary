interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const progressPercentage = (current / total) * 100;

  return (
    <div className="h-6 flex bg-progress-total-color self-stretch">
      <div className="bg-progress-current-color" style={{ width: `${progressPercentage}%` }}></div>
    </div>
  );
};

export default ProgressBar;
