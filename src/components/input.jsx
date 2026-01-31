import React, { useState } from 'react';




//

const UserInput = () => {

    const[userInput, setUserInput] = useState("");
    const[inputArray, setInputArray] = useState([])

    function handleSubmit(e){
        e.preventDefault()
        inputArray.push(userInput)
        setUserInput("")
        
        console.log(inputArray)
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
                <div className="flex mt-10 gap-3">
                    {inputArray.map((t, index) =>(
                        <p 
                        className=" gap-2 p-3 rounded-2xl
                                bg-white/10 backdrop-blur-lg
                                border border-white/20
                                shadow-lg shadow-black/20"
                        key={index}>
                            {t}</p>
                    ))}
                </div>

                <div className="mt-10">
                    <p className="text-xl">Dietary Preferences (optional)</p>
                    
                    <div className ="flex gap-3 mt-5">
                    {dietaryOptions.map((option, index) =>
                            <button 
                            className="gap-2 p-3 rounded-2xl
                                bg-white/10 backdrop-blur-lg
                                border border-white/20
                                shadow-lg shadow-black/20"
                            key ={index}
                            onClick={() => addDietaryOption(index)}
                            >{option}</button>
                            
                    )}
                    </div>
                    
                    


                </div>
            



            </div>
        

        )}


        </div>
    )
}

export default UserInput
