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

interface challengeData { //type for the json data
    
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
    
    return (
        <>            
            <div class="challenge-card">
                
            </div>
        </>
    );
});