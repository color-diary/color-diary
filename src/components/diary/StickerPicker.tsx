'use client';

import AngerSticker from './assets/diary-stickers/AngerSticker';
import AnxietySticker from './assets/diary-stickers/AnxietySticker';
import CalmSticker from './assets/diary-stickers/CalmSticker';
import ColorInsideTextSticker from './assets/diary-stickers/ColorInsideTextSticker';
import DoAnythingSticker from './assets/diary-stickers/DoAnythingSticker';
import FallFlowerSticker from './assets/diary-stickers/FallFlowerSticker';
import HappyDayTextSticker from './assets/diary-stickers/HappyDayTextSticker';
import HopeSticker from './assets/diary-stickers/HopeSticker';
import JoySticker from './assets/diary-stickers/JoySticker';
import LethargySticker from './assets/diary-stickers/LethargySticker';
import LogoSticker from './assets/diary-stickers/LogoSticker';
import NaSticker from './assets/diary-stickers/NaSticker';
import NoThoughtSticker from './assets/diary-stickers/NoThoughtSticker';
import PreciousMeSticker from './assets/diary-stickers/PreciousMeSticker';
import SadnessSticker from './assets/diary-stickers/SadnessSticker';
import SeedSticker from './assets/diary-stickers/SeedSticker';
import SpecialDaySticker from './assets/diary-stickers/SpecialDaySticker';
import SpecialMeSticker from './assets/diary-stickers/SpecialMeSticker';
import SpringFlowerSticker from './assets/diary-stickers/SpringFlowerSticker';
import SummerFlowerSticker from './assets/diary-stickers/SummerFlowerSticker';
import TextGoodJobSticker from './assets/diary-stickers/TextGoodJobSticker';
import TextSeedSticker from './assets/diary-stickers/TextSeedSticker';
import WinterFlowerSticker from './assets/diary-stickers/WinterFlowerSticker';

type StickerType = {
  id: string;
  component: JSX.Element;
};

const availableStickers: StickerType[] = [
  { id: 'SpringFlowerSticker', component: <SpringFlowerSticker /> },
  { id: 'WinterFlowerSticker', component: <WinterFlowerSticker /> },
  { id: 'SummerFlowerSticker', component: <SummerFlowerSticker /> },
  { id: 'FallFlowerSticker', component: <FallFlowerSticker /> },
  { id: 'AnxietySticker', component: <AnxietySticker /> },
  { id: 'SadnessSticker', component: <SadnessSticker /> },
  { id: 'SeedSticker', component: <SeedSticker /> },
  { id: 'JoySticker', component: <JoySticker /> },
  { id: 'LogoSticker', component: <LogoSticker /> },
  { id: 'HopeSticker', component: <HopeSticker /> },
  { id: 'LethargySticker', component: <LethargySticker /> },
  { id: 'AngerSticker', component: <AngerSticker /> },
  { id: 'CalmSticker', component: <CalmSticker /> },
  { id: 'ColorInsideTextSticker', component: <ColorInsideTextSticker /> },
  { id: 'HappyDayTextSticker', component: <HappyDayTextSticker /> },
  { id: 'DoAnythingSticker', component: <DoAnythingSticker /> },
  { id: 'TextSeedSticker', component: <TextSeedSticker /> },
  { id: 'TextGoodJobSticker', component: <TextGoodJobSticker /> },
  { id: 'NoThoughtSticker', component: <NoThoughtSticker /> },
  { id: 'SpecialDaySticker', component: <SpecialDaySticker /> },
  { id: 'SpecialMeSticker', component: <SpecialMeSticker /> },
  { id: 'PreciousMeSticker', component: <PreciousMeSticker /> },
  { id: 'NaSticker', component: <NaSticker /> }
];

type StickerPickerProps = {
  onSelect: (sticker: StickerType) => void;
};

const StickerPicker: React.FC<StickerPickerProps> = ({ onSelect }) => {
  return (
    <>
      <div className="flex flex-wrap gap-12px-row-m md:gap-16px-row ">
        {availableStickers.map((sticker) => (
          <div key={sticker.id} onClick={() => onSelect(sticker)}>
            {sticker.component}
          </div>
        ))}
      </div>
    </>
  );
};

export default StickerPicker;
