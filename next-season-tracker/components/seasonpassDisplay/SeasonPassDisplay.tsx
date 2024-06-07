'use client';

import SeasonalRewardCard from '../SeasonalRewardCard/SeasonalRewardCard';
import seasonalRewardJSON from '../../public/seasonalData/seasonPassData/seasonPassData.json';
import { useRef, useState } from 'react';
import { Icon } from '@iconify/react';

//this component will display the seasonal rewards for the current season as two rows, one for free and one for premium
//this will be done by placing sets of two flex rows within a container
//the size of the container will be determined by the number of rewards per page
//we'll use the daisyui horizontal carousel like in the seasonalChallengesRow component

interface seasonalRewardData {
  [rewardItem: string]: {
    fileName: string;
    rank: string;
    freeOrPremium: 'free' | 'premium';
    itemName: string;
    itemDescription: string;
    itemQuantity: string;
  };
}

export default function SeasonPassDisplay() {
  const rewardsPerPage = 5;

  //Read the seasonal data from the seasonalData folder
  //parse data from the seasonPassData.json file, referencing the relevant images within the seasonPassImages folder

  const seasonalRewardData: seasonalRewardData =
    seasonalRewardJSON as seasonalRewardData;

  //divide the data into two arrays, one for free and one for premium
  const freeRewardData = Object.values(seasonalRewardData).filter(
    (reward) => reward.freeOrPremium === 'free'
  );
  const premiumRewardData = Object.values(seasonalRewardData).filter(
    (reward) => reward.freeOrPremium === 'premium'
  );

  //create a 2d array of the data, with the first dimension being the page number and the second dimension being the reward data
  //this will be done for each type of reward
  const freeRewardPages = [];
  for (let i = 0; i < Math.ceil(freeRewardData.length / rewardsPerPage); i++) {
    freeRewardPages.push(
      freeRewardData.slice(
        i * rewardsPerPage,
        i * rewardsPerPage + rewardsPerPage
      )
    );
  }
  const premiumRewardPages: any[] = [];
  for (
    let i = 0;
    i < Math.ceil(premiumRewardData.length / rewardsPerPage);
    i++
  ) {
    premiumRewardPages.push(
      premiumRewardData.slice(
        i * rewardsPerPage,
        i * rewardsPerPage + rewardsPerPage
      )
    );
  }

  //combine the two pages so that we have a single array of the data where each page is a set of two rows
  //so [1] would have both free and premium rewards for page 1
  const combinedRewardPages = freeRewardPages.map((page, index) => [
    page,
    premiumRewardPages[index],
  ]);
  console.log(combinedRewardPages);

  //handling the nvaigation arrows
  // Reference to the carousel container
  const carouselRef = useRef<HTMLDivElement>(null);

  // Handler to scroll the carousel left
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  // Handler to scroll the carousel right
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  return (
    <div className='flex w-[96rem] items-center'>
      <Icon
        icon='mdi:chevron-double-left'
        className=' h-24 w-24 shrink-0 text-secondary-focus hover:brightness-125'
        onClick={scrollLeft}
      />
      <div ref={carouselRef} className='carousel '></div>
      <Icon
        icon='mdi:chevron-double-right'
        className='h-24 w-24 shrink-0 text-secondary-focus hover:brightness-125'
        onClick={scrollRight}
      />
    </div>
  );
}
