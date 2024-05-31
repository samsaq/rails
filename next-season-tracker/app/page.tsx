import ChallengeCard from '@/components/challengeCard/challengeCard';
import ChallengeToolTip from '@/components/challengeToolTip/challengeToolTip';
import SeasonalRewardToolTip from '@/components/SeasonalRewardToolTip/SeasonalRewardToolTip';
import ToolTipHandler from '@/components/ToolTipHandler/ToolTipHandler';
import SeasonalChallengesRow from '@/components/SeasonalChallengesRow/SeasonalChallengesRow';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between bg-base-100 p-24'>
      <ToolTipHandler />

      <ChallengeCard
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
      <SeasonalChallengesRow />
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

      <SeasonalRewardToolTip
        fileName='rank2_free.jpg'
        rank={2}
        freeOrPremium='free'
        itemName='Upgrade Module'
        itemDescription='A collection of universal components that can be used to infuse power between gear items. Can be purchased from the Gunsmith or acquired from special reward sources.'
        itemQuantity={3}
      />
    </main>
  );
}

/*
  "rank2_free": {
        "fileName": "rank2_free.jpg",
        "rank": "2",
        "freeOrPremium": "free",
        "itemName": "Upgrade Module",
        "itemDescription": "A collection of universal components that can be used to infuse power between gear items. Can be purchased from the Gunsmith or acquired from special reward sources.",
        "itemQuantity": "3"
    },
*/

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
