import { cva, VariantProps } from 'class-variance-authority';

const iconVariant = cva('w-200px h-200px flex rounded-full border-4', {
  variants: {
    emotion: {
      joy: 'justify-center items-center',
      sadness: '',
      lethargy: '',
      calm: '',
      anxiety: '',
      anger: '',
      hope: ''
    }
  }
});

type EmotionIconVariantProps = VariantProps<typeof iconVariant>;

type EmotionIconProps = {} & EmotionIconVariantProps;

const EmotionIcon = ({ emotion }: EmotionIconProps) => {
  return (
    <div className={iconVariant({ emotion })} style={{ background: `${emotion}`, borderColor: `${emotion}` }}>
      {emotion}
    </div>
  );
};

export default EmotionIcon;
