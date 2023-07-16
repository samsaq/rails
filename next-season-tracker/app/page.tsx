import Image from 'next/image';
import Link from 'next/link';
import ChallengeCard from '@/components/challengeCard/challengeCard';
import ChallengeToolTip from '@/components/challengeToolTip/challengeToolTip';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between bg-base-100 p-24'>
      <ChallengeCard
        name='Into the Depths I'
        week='Week 1'
        description='test'
        icon='Into the Depths I.jpg'
        rewardItems={[]}
        objectives={[]}
      />
      <ChallengeToolTip
        name='Into the Depths I'
        week='Week 1'
        description='Complete the Week 1 \"Into the Depths\" mission.'
        icon='Into the Depths I.jpg'
        rewardItems={[
          {
            name: 'Challenger XP+',
            description: '',
            quantity: '1',
          },
        ]}
        objectives={[
          {
            name: '',
            startValue: '0',
            completionValue: '1',
          },
        ]}
      />
    </main>
  );
}

/*
Example data for a challenge:
"Into the Depths I": {
        "name": "Into the Depths I",
        "week": "Week 1",
        "description": "Complete the Week 1 \"Into the Depths\" mission.",
        "icon": "Into the Depths I.jpg",
        "rewardItems": [
            {
                "name": "Challenger XP+",
                "description": "",
                "quantity": "1"
            }
        ],
        "objectives": [
            {
                "name": "",
                "startValue": "0",
                "completionValue": "1"
            }
        ]
    }
*/
