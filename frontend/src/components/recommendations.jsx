import React from 'react'
import { GiElectricalCrescent } from 'react-icons/gi';
import { useEffect, useState } from 'react';



// Optional. If unset, we rely on Vite's dev proxy (see `frontend/vite.config.js`).
const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

const recommendations = ({ recommend }) => {
  
  const [recommendations, setRecommendations] = useState([]);
  useEffect(()=>{
    async function getRecommendations(){
      fetch(`${API_BASE}/api/recommend`)
        .then(async (res) => {
          if (!res.ok) throw new Error(`recommend failed: ${res.status}`);
          return res.json();
        })
        .then((data) =>{
          setRecommendations(data.foods ?? []);
        })
        .catch((err) => {
          console.error(err);
          setRecommendations([]);
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
