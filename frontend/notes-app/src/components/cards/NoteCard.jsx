import moment from 'moment';
import React from 'react';
import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md';

const NoteCard = ({
    title,
    date,
    content,
    tags,
    isPinned,
    onEdit,
    onDelete,
    onPinNote,
}) => {
    // Ensure 'date' is a valid Date object
    const parsedDate = moment(date, 'YYYY-MM-DD').toDate();

    return (
        <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out'>
            <div className='flex items-center justify-between'>
                <h6 className='text-sm font-md'>{title}</h6>
                {/* Format the date here */}
                <span className='text-xs text-slate-500'>{moment(date).format('Do MMM YYYY')}</span>
            </div>

         
            {/* <MdOutlinePushPin
                className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`}
                onClick={onPinNote}
            /> */}

            <p className='text-slate-600 mt-2'>{content?.slice(0, 60)}</p>

            <div className='flex items-center justify-between mt-2'>
                
            <div className='flex items-center gap-2'>
  {tags && tags.map((tag, index) => (
    <div key={index} className='text-xs text-slate-500'>
      {tag}
    </div>
  ))}
                
                    <MdCreate
                        className='icon-btn hover:text-green-600'
                        onClick={onEdit}
                    />
                    <MdDelete
                        className='icon-btn hover:text-red-500'
                        onClick={onDelete}
                    />
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
