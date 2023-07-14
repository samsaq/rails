import styles from './challengeCard.module.scss';
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

export default function ChallengeCard(props: challengeProps) {
  return (
    <div className='flex aspect-square h-40 flex-col items-center border-2 border-solid border-accent-content'>
      <Image
        src={`/seasonalData/seasonChallengesData/seasonChallengeIcons/${props.icon}`}
        width={84}
        height={84}
        alt='Challenge Icon'
      />
      <span className='truncate font-neue text-sm'>
        {props.week} \\ {props.name}
      </span>
    </div>
  );
}
