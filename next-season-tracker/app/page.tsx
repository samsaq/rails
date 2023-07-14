import Image from 'next/image'
import Link from 'next/link'
import ChallengeCard from '@/components/challengeCard/challengeCard'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-base-100">
      <ChallengeCard name="Into the Depths I" week="Week 1" description="test" icon="Into the Depths I.jpg" rewardItems={[]} objectives={[]} />
    </main>
  )
}
