'use client';

import ChallengeCard from '../challengeCard/challengeCard';
import { challengeProps } from '@/atoms';
import seasonalChallengesMetadata from '../../public/seasonalData/seasonChallengesData/seasonalChallengesMetaData.json';
import { Icon } from '@iconify/react';
interface SeasonalChallengesMetadata {
  [week: string]: {
    [challengeName: string]: challengeProps;
  };
}

export default function SeasonalChallengesRow() {
  const typedSeasonalChallengesMetadata: SeasonalChallengesMetadata =
    seasonalChallengesMetadata as SeasonalChallengesMetadata;
  //parsing the data for each week out of the metadata (first level keys are the weeks, and below are the challenges)
  const seasonalChallenges: challengeProps[][] = [];
  Object.keys(typedSeasonalChallengesMetadata).forEach((curWeek) => {
    const curWeekData = typedSeasonalChallengesMetadata[curWeek];
    //get the challenges for the current week into an array of challengeProps
    const curWeekChallenges = Object.keys(curWeekData).map(
      (curChallengeName) => {
        return curWeekData[curChallengeName];
      }
    );
    //add this week's challenges to the array of weeks, the first is seasonal, next is week 1, then week 2, etc
    seasonalChallenges.push(curWeekChallenges);
  });

  return (
    <div className='flex w-[96rem] flex-row items-center'>
      <Icon
        icon='mdi:chevron-double-left'
        className=' h-24 w-24 shrink-0 text-secondary-focus'
      />
      <div className='carousel '>
        {seasonalChallenges.map((curWeek) => (
          <div
            key={curWeek[0].week}
            className='carousel-item w-full justify-center'
          >
            {curWeek.map((curChallenge) => (
              <ChallengeCard
                key={curChallenge.week + curChallenge.name}
                {...curChallenge}
              />
            ))}
          </div> //assuming at least one challenge per week
        ))}
      </div>
      <Icon
        icon='mdi:chevron-double-right'
        className='h-24 w-24 shrink-0 text-secondary-focus'
      />
    </div>
  );
}
