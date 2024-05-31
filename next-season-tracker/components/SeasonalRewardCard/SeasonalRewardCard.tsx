'use client';

import Image from 'next/image';
import { useSetAtom } from 'jotai';
import type { seasonalRewardProps } from '@/atoms';

import {
  toolTipHovering,
  currentToolTipSeasonalRewardProps,
  toolTipType,
  mousePosOnHoverAble,
} from '@/atoms';

export default function SeasonalRewardCard(props: seasonalRewardProps) {
  const setToolTipHoveringState = useSetAtom(toolTipHovering);
  const setCurrentToolTipSeasonalRewardProps = useSetAtom(
    currentToolTipSeasonalRewardProps
  );
  const setToolTipType = useSetAtom(toolTipType);
  const setMousePosOnHoverAble = useSetAtom(mousePosOnHoverAble);

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    setToolTipHoveringState(true);
    setToolTipType('seasonalReward');
    setCurrentToolTipSeasonalRewardProps(props);
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
    setToolTipHoveringState(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosOnHoverAble({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onMouseMove={handleMouseMove}
      className='flex aspect-square w-24 flex-col items-center justify-evenly overflow-hidden border-2 border-solid border-base-200 bg-base-200 p-1 shadow-xl transition-colors duration-200 hover:border-primary hover:brightness-125'
    >
      <Image
        src={`/seasonalData/seasonPassData/seasonPassImages/${props.fileName}`}
        width={84}
        height={84}
        alt='Seasonal Reward Image'
      />
    </div>
  );
}
