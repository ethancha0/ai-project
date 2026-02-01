import React from 'react'

const recommendations = ({ recomend }) => {
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




    </div>
  )
}

export default recommendations
