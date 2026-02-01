import React from 'react'
import { GiElectricalCrescent } from 'react-icons/gi';

const recommendations = ({ recomend }) => {

  async function getRecommendations(){
    fetch("http://127.0.0.1:8000/api/recommend")
    .then(res => res.json())
    .then(data =>{
      console.log(data.foods);
    });
  }


  return (
    <div>
      <div className="justify-center flex gap-2 p-8 mt-8 w-full rounded-2xl
                                bg-white/10 backdrop-blur-lg
                                border border-white/20
                                shadow-lg shadow-black/20 font-bold">

        <p>We recommend you try: </p>

        {recomend?.length > 0 && (
          <p>{recomend[0]}</p>
        )}

      </div>
      
      <button onClick={() => getRecommendations()}>test</button>


    </div>
  )
}

export default recommendations
