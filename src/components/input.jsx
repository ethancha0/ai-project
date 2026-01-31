import React, { useState } from 'react';






const UserInput = () => {

    const[userInput, setUserInput] = useState("");
    const[inputArray, setInputArray] = useState([])

    function handleSubmit(e){
        e.preventDefault()
        inputArray.push(userInput)
        setUserInput("")
        
        console.log(inputArray)
    }

    return (

        <div className="max-w-2xl mx-auto p-6 rounded-2xl
      bg-white/10 backdrop-blur-lg
      border border-white/20
      shadow-lg shadow-black/20">



        <form onSubmit={handleSubmit} className="flex gap-4">
            <input
                className="max-w-2xl mx-auto p-2 rounded-2xl
                             bg-white/10 backdrop-blur-lg
                              border border-white/20
                            shadow-lg shadow-black/20"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
            ></input>

            <button type="submit"> click me </button>

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

                <div className="">
                    <p>Dietary Preferences (optional)</p>

                </div>
            



            </div>
        

        )}


        </div>
    )
}

export default UserInput
