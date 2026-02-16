import React, { useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";

import Recommendations from "./recommendations"
import { Button } from './ui/button';


const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

const UserInput = () => {

    const[userInput, setUserInput] = useState("");
    const[inputArray, setInputArray] = useState([])
    const[preferences, setPreferences] = useState([])
    const[showRecommendations, setShowRecommendations] = useState(false)

    function handleSubmit(e){
        e.preventDefault()
        inputArray.push(userInput)
        setUserInput("")
        
        console.log(inputArray)
    }

    async function sendPreferences(){
        //obj to hold foods, preferences, etc. scalable
        const payload = {
            foods: inputArray,
            additonal: preferences
        }
        console.log("sending preferences: ", payload)

        let res;
        try {
            res = await fetch(`${API_BASE}/api/preferences`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
        } catch (err) {
            console.error("Failed to send preferences:", err);
            return;
        }

        async function getRecommendations(){
            fetch(`${API_BASE}/api/recommend`)
            .then(res => res.json())
            .then(data =>{
            console.log(data.foods);
    });
  }
        



        if (!res.ok) {
            const text = await res.text().catch(() => "");
            console.error("Preferences request failed:", res.status, text);
            return;
        }

        const data = await res.json().catch(() => null);
        console.log(data);

        setShowRecommendations(true);

    }

    function addDietaryOption(preference){
        preferences.push(dietaryOptions[preference])
        console.log("pref array ", preferences)
    }

    const dietaryOptions=[
        "High Protein",
        "Gluten Free",
        "Vegan",
        "Vegetarian",
    ]

    return (

        <div className="max-w-2xl mx-auto p-6 rounded-2xl
      bg-white/10 backdrop-blur-lg
      border border-white/20
      shadow-lg shadow-black/20">



        <form onSubmit={handleSubmit} className="flex gap-2 justify-center">
            <input
                className="glass-card"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
            ></input>

            <button type="submit" className="glass-card">  Add Food </button>

        </form>

        {inputArray.length > 0 && (
            <div>
                <div className="flex justify-center cent mt-10 gap-3">
                    {inputArray.map((t, index) =>(
                        <div key={index}className="glass-card flex gap-2">
                        <p 
                        className=" "
                        key={index}>
                            {t}
                        </p>
                        <Button
                            size="xs-icon"
                            varient="outline"
                            className="bg-white/10 backdrop-blur-lg
                                border border-white/20 hover:bg-gray-400"
                        >
                            <IoCloseSharp/>
                        </Button>
                      
                
                        
                        </div>
                        
                    ))}
                </div>

                <div className="mt-10">
                    <p className="text-xl">Dietary Preferences (optional)</p>
                    
                    <div className ="flex gap-3 mt-5">
                    {dietaryOptions.map((option, index) =>
                            <button 
                            className="glass-card"
                            key ={index}
                            onClick={() => addDietaryOption(index)}
                            >{option}</button>
                            
                    )}
                    </div>
                </div>

                <div className="">
                    <button 
                        className="glass-card p-6 mt-10 w-full"
                        onClick={sendPreferences}
                    >Get Recommendations
                    
                    </button>
                </div>
                
                {showRecommendations && (
                    <div>
                    <Recommendations recomend={inputArray}/>
                    </div>
                )
                
            
            }



            </div>
        

        )}

        </div>
    )
}

export default UserInput
