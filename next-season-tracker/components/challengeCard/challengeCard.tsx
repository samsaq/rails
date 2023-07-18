'use client';

import Image from 'next/image';
import { useSetAtom } from 'jotai';
import type { challengeProps } from '@/atoms';

import {
  toolTipHovering,
  currentToolTipChallengeProps,
  toolTipType,
  mousePosOnHoverAble,
} from '@/atoms';

export default function ChallengeCard(props: challengeProps) {
  const setToolTipHoveringState = useSetAtom(toolTipHovering);
  const setCurrentToolTipChallengeProps = useSetAtom(
    currentToolTipChallengeProps
  );
  const setToolTipType = useSetAtom(toolTipType);
  const setMousePosOnHoverAble = useSetAtom(mousePosOnHoverAble);

  const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    setToolTipHoveringState(true);
    setToolTipType('challenge');
    setCurrentToolTipChallengeProps(props);
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
      className='flex aspect-square w-32 flex-col items-center justify-evenly truncate border-2 border-solid border-base-200 bg-base-200 p-1 shadow-xl transition-colors duration-200 hover:border-primary hover:brightness-125'
    >
      <Image
        src={`/seasonalData/seasonChallengesData/seasonChallengeIcons/${props.icon}`}
        width={84}
        height={84}
        alt='Challenge Icon'
      />
      <span className='font-neue text-sm text-white'>{props.name}</span>
    </div>
  );
}
