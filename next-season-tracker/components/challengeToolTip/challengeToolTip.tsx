import Image from 'next/image';

interface challengeProps {
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

export default function challengeToolTip(props: challengeProps) {
  //remove unneeded escape characters from the description
  const cleanedDesc = props.description.replace(/\\"/g, '');

  //replace any empty objective names with Progress
  props.objectives.forEach((objective) => {
    if (objective.name === '') {
      objective.name = 'Progress';
    }
  });

  const progressArray = props.objectives.map((objective) => {
    return parseInt(objective.startValue) / parseInt(objective.completionValue);
  });

  return (
    <div className='flex flex-col items-start shadow-lg'>
      <div className='flex w-full flex-row items-center justify-start bg-secondary-focus p-2'>
        <Image
          src={`/seasonalData/seasonChallengesData/seasonChallengeIcons/${props.icon}`}
          width={21}
          height={21}
          alt='Challenge Icon'
        />
        <span className=' px-1 font-neue text-sm text-white'>{props.name}</span>
      </div>
      <div className='flex w-full flex-col items-start justify-start bg-base-200 p-2'>
        <span className='pb-4 font-neue text-sm text-white'>{cleanedDesc}</span>
        {props.objectives.map((objective, index) => {
          return (
            /* Using index should be fine since we're not filtering / re-ordering the list */
            /* If the objective is complete display a div with 100 opacity, else 0 */
            <>
              <div key={index} className='flex w-full flex-row justify-start'>
                <div className='mr-2 flex aspect-square h-6 items-center justify-center border-2 border-solid border-secondary-focus border-opacity-75 bg-transparent'>
                  {progressArray[index] === 1 ? (
                    <div className='aspect-square h-3.5 bg-accent opacity-100' />
                  ) : (
                    <div className='aspect-square h-3.5 bg-accent opacity-0' />
                  )}
                </div>
                <div className='relative flex w-[85%] flex-row items-center justify-between'>
                  <progress
                    className='progress-accent progress h-6'
                    value={objective.startValue}
                    max={objective.completionValue}
                  ></progress>
                  <span className='absolute left-2 font-neue text-sm text-white'>
                    {objective.name}
                  </span>
                  <span className='absolute right-2 font-neue text-sm text-white'>
                    {objective.startValue}/{objective.completionValue}
                  </span>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}
