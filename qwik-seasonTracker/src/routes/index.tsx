import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import challengeCard from '../components/challengeCard/challengeCard';

export default component$(() => {
  return (
    <>
    <span>Empty Span</span>
    <challengeCard name="Into the Depths I" week="Week 1" description="Complete the Week 1" icon="Into the Depths I.jpg" rewardItems="test" objectives="test" />
    </>
  );
});

export const head: DocumentHead = {
  title: 'D2 Season Tracker',
  meta: [
    {
      name: 'description',
      content: 'A website to track your seasonal progress in Destiny 2.',
    },
  ],
};
