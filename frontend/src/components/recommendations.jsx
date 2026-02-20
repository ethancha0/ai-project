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
    <div className="mt-6">
      <div className="glass-card flex flex-col items-center text-center gap-4">

        <p>We recommend you try: </p>
        <div className="flex flex-col w-full gap-3">
         {recommendations.map((food) => (
            <div key={food} className="glass-card w-full">
              <p className="font-bold">{food}</p>
            </div>
            ))}
          </div>


      </div>
      


    </div>
  )
}

export default recommendations
