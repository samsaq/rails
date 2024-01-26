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
