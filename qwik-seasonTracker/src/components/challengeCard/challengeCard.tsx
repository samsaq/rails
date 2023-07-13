import { component$ } from '@builder.io/qwik';

// This is a card component to display destiny 2 challenge data when the user hovers over them
// this means displaying the icon, name, description, progress on the objectives of the challenge, and rewards

interface challengeProps { //component props
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

// take a given week and name and get the json data from the static file - edit & place within the bar component & pass down to the card component
/*
async function getChallengeData$(week: string, name: string): Promise<challengeData> {
    const response = await fetch(`/${week}.json`);
    const weekData = await response.json();
    //find the challenge with the given name
    const challenge = weekData.find((challenge: challengeData) => challenge.name === name);
    return challenge;
}
*/

export default component$<challengeProps>((props) => {
    
    const icon = props.icon;
    const iconRelativePath = "/seasonalData/seasonChallengesData/seasonChallengeIcons/" + icon;

    return (
        <>            
            <div class="card w-96 bg-base-100 shadow-xl image-full">
            <figure><img src={iconRelativePath} width={84} height={84} /></figure>
            <div class="card-body">
                <h2 class="card-title">Shoes!</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
                <div class="card-actions justify-end">
                    <button class="btn btn-primary">Buy Now</button>
                </div>
            </div>
            </div>
        </>
    );
});