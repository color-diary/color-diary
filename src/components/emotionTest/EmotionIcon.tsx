import results from '@/data/results';
import { ResultType } from '@/types/test.type';
import { cva, VariantProps } from 'class-variance-authority';

const iconVariant = cva('w-200px h-200px flex rounded-full border-4', {
  variants: {
    emotion: {
      joy: 'justify-center items-center bg-[#C5E1FB] border-[#66B0F5]',
      sadness: 'py-8 bg-[#094986] border-[#021526]',
      lethargy: 'px-19.5px py-13.5 bg-[#D4D4D4] border-[#878787]',
      calm: 'pl-6 pt-8 bg-[#F5FAFE] border-[#96C9F8]',
      anxiety: 'px-25.5px py-9 bg-[#FADFB7] border-[#F1A027]',
      anger: 'justify-center py-9.5 bg-[#3B3B3B] border-[#080808]',
      hope: 'px-2 pt-8 bg-[#FCD4DC] border-[#F14667]'
    }
  }
});

type EmotionIconVariantProps = VariantProps<typeof iconVariant>;

type EmotionIconProps = {} & EmotionIconVariantProps;

const EmotionIcon = ({ emotion }: EmotionIconProps) => {
  const resultDetails: ResultType = results.find((result) => result.result === emotion)!;

  return <div className={iconVariant({ emotion })}>{resultDetails.image}</div>;
};

export default EmotionIcon;
