import React from 'react'
import { GiElectricalCrescent } from 'react-icons/gi';
import { useEffect, useState } from 'react';

const recommendations = ({ recommend }) => {
  
  const [recommendations, setRecommendations] = useState([]);
  useEffect(()=>{
    async function getRecommendations(){
      fetch("http://127.0.0.1:8000/api/recommend")
      .then(res => res.json())
      .then(data =>{
        setRecommendations(data.foods);
      });
    }
    getRecommendations();
  },[]);



  return (
    <div>
      <div className="justify-center flex gap-2 p-8 mt-8 w-full rounded-2xl
                                bg-white/10 backdrop-blur-lg
                                border border-white/20
                                shadow-lg shadow-black/20 font-bold">

        <p>We recommend you try: </p>
        <div className="flex flex-wrap gap-2">
         {recommendations.map((food) => (
            <div key={food}>
              <p className="font-bold">{food}</p>
            </div>
            ))}
          </div>


      </div>
      


    </div>
  )
}

export default recommendations
