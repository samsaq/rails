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
    <div className='flex aspect-square w-32 flex-col items-center justify-evenly truncate border-2 border-solid border-base-200 bg-base-200 p-1 shadow-xl transition-colors duration-200 hover:border-primary hover:brightness-125'>
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
