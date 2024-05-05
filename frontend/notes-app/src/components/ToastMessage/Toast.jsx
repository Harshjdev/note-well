import React, { useEffect, useState } from 'react';
import { LuCheck } from 'react-icons/lu';
import { MdDeleteOutline } from 'react-icons/md';

const Toast = ({ isShown, message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isShown) {
      setIsVisible(true);

      const timeoutId = setTimeout(() => {
        onClose();
        setIsVisible(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [isShown, onClose]);

  return (
    <div className={`absolute top-20 right-6 ${isVisible ? 'opacity-100 transition-opacity duration-500' : 'opacity-0'}`} style={{ transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }}>
      <div className={`min-w-52 bg-white border shadow-2xl rounded-md after:w-[5px] after:h-full ${type === 'delete' ? 'after:bg-red-500' : 'after:bg-green-500'}`} style={{ transform: isVisible ? 'scale(1)' : 'scale(0.9)' }}>
        <div className='flex items gap-3 py-2 px-4'>
          <div className={`w-10 h-10 flex items-center justify-center rounded-full ${type === 'delete' ? 'bg-red-50' : 'bg-green-50'}`}>
            {type === 'delete' ? <MdDeleteOutline className="text-xl text-red-500" /> : <LuCheck className="text-xl text-green-500" />}
          </div>
          <p className='text-sm text-slate-800'>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
