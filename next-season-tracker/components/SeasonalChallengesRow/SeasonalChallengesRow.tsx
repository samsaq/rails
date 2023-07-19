import ChallengeCard from '../challengeCard/challengeCard';
import { challengeProps } from '@/atoms';

export default async function SeasonalChallengesRow(week: string) {
  //using the week, get and parse the week's json for the challengeProps
  //the flex row will contain the challenge cards for each challenge in the week
  //the file will be in public/seasonalData/seasonChallengesData/week.json
  //the json will be an object with the challenge names as keys and the challengeProps as values
  //the challengeProps will be passed to the challengeCard component

  //Reminder: rework seasonalscript to output a single seasonal challenges json instead to avoid the need for dyanmic imports

  //fetch the json
  async function fetchData() {
    const res = await fetch(
      `public/seasonalData/seasonChallengesData/${week}.json`
    );
    const data = await res.json();
    return data;
  }

  //parse the json
  const weekData = await fetchData();
  const challengeNames = Object.keys(weekData);
  const challengePropsArray: challengeProps[] = [];
  for (const element of challengeNames) {
    challengePropsArray.push(weekData[element]);
  }

  return <div className='flex flex-row items-center justify-evenly '></div>;
}
