import Image from 'next/image';
import { seasonalRewardProps } from '@/atoms';

//A component which will display a tooltip for a seasonal reward item
export default function SeasonalRewardToolTip(props: seasonalRewardProps) {
  const cleanedDesc = props.itemDescription.replace(/\\/g, '');

  function shortenDescription(description: string, maxLength: number) {
    // Split the description into sentences via punctuation
    // Do not remove any punctuation from the sentences
    const sentences = description.match(/[^.!?]+[.!?]/g) || [description];

    let shortened = '';
    for (const sentence of sentences) {
      // If adding the next sentence would exceed the maxLength, stop
      if (shortened.length + sentence.length > maxLength) {
        break;
      }

      shortened += sentence;
    }
    // If the description is only one sentence long and exceeds maxLength,
    // we keep the full sentence
    if (sentences.length === 1 && shortened.length > maxLength) {
      shortened = description;
    }

    // If there are no sentences (i.e., no sentence-ending punctuation), treat the entire description as one sentence
    if (!sentences) {
      shortened = description;
    }

    return shortened;
  }

  //if the description is over 100 characters, cut it off at the sentence before the 150th character
  const shortenedDesc = shortenDescription(cleanedDesc, 150);

  return (
    <div className='flex flex-col items-start shadow-lg'>
      <div className='flex w-full flex-row items-center justify-start bg-secondary-focus p-2'>
        <span className=' px-1 font-neue text-sm text-white'>
          {props.itemName} x {props.itemQuantity}
        </span>
      </div>
      <div className='flex w-full flex-col items-start justify-start bg-base-200 p-2'>
        <span className='max-w-sm break-words pb-3 font-neue text-sm text-white'>
          {shortenedDesc}
        </span>
      </div>
    </div>
  );
}
