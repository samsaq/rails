'use client';

import { useRef } from 'react';
import { useAtomValue } from 'jotai';
import {
  toolTipHovering,
  toolTipType,
  currentToolTipChallengeProps,
  mousePosOnHoverAble,
} from '@/atoms';
import ChallengeToolTip from '../challengeToolTip/challengeToolTip';

//A component which will track the mouse position and display a tooltip when the mouse is over a challenge card or a seasonal reward item.
//We'll use the challengeToolTip component for the challenge cards and assume a seasonalRewardToolTip for the reward items.

export default function ToolTipHandler() {
  const toolTipHoveringState = useAtomValue(toolTipHovering);
  const curToolTipType = useAtomValue(toolTipType);
  const curToolTipChallengeProps = useAtomValue(currentToolTipChallengeProps);
  const { x: mouseX, y: mouseY } = useAtomValue(mousePosOnHoverAble);
  const containerRef = useRef<HTMLDivElement>(null);

  const toolTipOffset = 32; //equivalent to 2rem in px
  let computedHandlerX = 0 + toolTipOffset; //defaults to a positon right of the mouse
  let computedHandlerY = 0;

  function positionToolTip() {
    computedHandlerX = mouseX + toolTipOffset;
    computedHandlerY = mouseY;
    // We'll check the dimensions of the component against the viewport to see
    // if we need to change the offsets to keep the tooltip on screen.
    if (offScreenCheck() && containerRef.current != null) {
      const containerRect = containerRef.current.getBoundingClientRect();
      // see if the tooltip is off screen to the right and flip the offset as needed so the tooltip is to the left (no need to check left as the default is to be right of the mouse)
      if (containerRect.right > window.innerWidth) {
        //computedHandlerX = mouseX - containerRect.width - toolTipOffset;
      }
      // if the tooltip is off of the screen on the vertical axis, shift it up or down as needed
      if (containerRect.bottom > window.innerHeight) {
        //shift it up by the amount it's off screen
        //computedHandlerY = window.innerHeight - containerRect.height;
      } else if (containerRect.top < 0) {
        //force it to stay on screen
        //computedHandlerY = 0;
      }
    }
  }

  function offScreenCheck() {
    //check if the tooltip (using the containerRef) is off screen
    if (containerRef.current != null) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (
        containerRect.left < 0 ||
        containerRect.right > viewportWidth ||
        containerRect.top < 0 ||
        containerRect.bottom > viewportHeight
      ) {
        return true;
      }
    }
    return false;
  }

  positionToolTip();

  return (
    <div
      className={`${
        toolTipHoveringState ? 'visible' : 'invisible'
      } absolute left-0 top-0 z-50 flex`}
      ref={containerRef}
      //add the translate for x and y as an inline style
      style={{
        transform: `translateX(${computedHandlerX}px) translateY(${computedHandlerY}px)`,
      }}
    >
      {curToolTipType === 'challenge' && curToolTipChallengeProps != null ? (
        <ChallengeToolTip {...curToolTipChallengeProps} />
      ) : (
        curToolTipType === 'seasonalReward' && <div />
      )}
    </div>
  );
}
