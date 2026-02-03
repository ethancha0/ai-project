import React, { useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";

import Recommendations from "./recommendations"





const UserInput = () => {

    const[userInput, setUserInput] = useState("");
    const[inputArray, setInputArray] = useState([])
    const[recommendations, setRecommendations] = useState([])

    function handleSubmit(e){
        e.preventDefault()
        inputArray.push(userInput)
        setUserInput("")
        
        console.log(inputArray)
    }

    async function sendPreferences(){
        //obj to hold foods, preferences, etc. scalable
        const payload = {
            foods: inputArray
        }

        const res = await fetch("http://127.0.0.1:8000/api/preferences",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),

        });

        const data = await res.json();
        console.log(data)

   

    }

    function addDietaryOption(preference){
        inputArray.push(dietaryOptions[preference])
        console.log("after adding pref: ", inputArray)
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



        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                className="max-w-2xl mx-auto p-2 rounded-2xl
                             bg-white/10 backdrop-blur-lg
                              border border-white/20
                            shadow-lg shadow-black/20"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
            ></input>

            <button type="submit"> Add Food </button>

        </form>

        {inputArray.length > 0 && (
            <div>
                <div className="flex justify-center cent mt-10 gap-3">
                    {inputArray.map((t, index) =>(
                        <div className="flex  align-itemgap-2 p-3 rounded-2xl
                                bg-white/10 backdrop-blur-lg
                                border border-white/20
                                shadow-lg shadow-black/20">
                        <p 
                        className=" "
                        key={index}>
                            {t}
                        </p>
                        <IoCloseSharp />
                        </div>
                        
                    ))}
                </div>

                <div className="mt-10">
                    <p className="text-xl">Dietary Preferences (optional)</p>
                    
                    <div className ="flex gap-3 mt-5">
                    {dietaryOptions.map((option, index) =>
                            <button 
                            className="flex gap-2 p-3 rounded-2xl
                                bg-white/10 backdrop-blur-lg
                                border border-white/20
                                shadow-lg shadow-black/20 font-bold"
                            key ={index}
                            onClick={() => addDietaryOption(index)}
                            >{option}</button>
                            
                    )}
                    </div>
                </div>

                <div className="">
                    <button 
                        className="justify-center flex gap-2 p-8 mt-8 w-full rounded-2xl
                                bg-white/10 backdrop-blur-lg
                                border border-white/20
                                shadow-lg shadow-black/20 font-bold"
                        onClick={sendPreferences}
                    >Get Recommendations
                    
                    </button>
                </div>
                
                {recommendations.length && (
                    <div>
                    <Recommendations recomend={recommendations}/>
                    </div>
                )
                
            
            }



            </div>
        

        )}


        </div>
    )
}

export default UserInput
