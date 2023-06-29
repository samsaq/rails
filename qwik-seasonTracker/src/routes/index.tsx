import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <>
    <span>Empty Span</span>
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
