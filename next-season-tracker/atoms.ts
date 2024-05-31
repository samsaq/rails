import { atom } from 'jotai';

export interface challengeProps {
  //component props
  name: string;
  week: string;
  description: string;
  icon: string; //the icon's file name
  rewardItems: {
    name: string;
    description: string;
    quantity: string;
  }[];
  objectives: {
    name: string;
    startValue: string;
    completionValue: string;
  }[];
}

export interface seasonalRewardProps {
  //A type for the seaonPassData.json's rewards
  fileName: string; //the file name of the image in the seasonPassImages folder
  rank: number;
  freeOrPremium: 'free' | 'premium';
  itemName: string;
  itemDescription: string;
  itemQuantity: number;
}

const toolTipHovering = atom(false);
const toolTipType = atom<'challenge' | 'seasonalReward' | null>(null);
const currentToolTipChallengeProps = atom<challengeProps | null>(null);
const mousePosOnHoverAble = atom({ x: 0, y: 0 });

export {
  toolTipHovering,
  toolTipType,
  currentToolTipChallengeProps,
  mousePosOnHoverAble,
};
