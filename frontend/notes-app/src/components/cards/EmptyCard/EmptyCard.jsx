import React from 'react'
import AddNotesImg from '../../../assets/images/add-note.svg'
const EmptyCard = ({data}) => {
  return (
    <div  className='flex  flex-col justify-center items-center h-screen'>
        <img src={AddNotesImg} alt="No notes"  className='w-60'/>


        <p className='w-1/2 text-sm font-medium text-slate-700 text-center  leading-7 mt-5'>
            {data}
        </p>
    </div>
  )
}

export default EmptyCard