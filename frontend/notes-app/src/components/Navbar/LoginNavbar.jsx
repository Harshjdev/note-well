import React, { useState } from 'react';
import ProfileInfo from '../cards/ProfileInfo';
import { useNavigate, useSearchParams } from 'react-router-dom';


const LoginNavbar = ({ userInfo }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    // Your search logic goes here
  };

  const onClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      <h2 className='text-xl font-medium text-black py-2'>NOTE-WELL</h2>
      <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
    </div>
  );
}

export default LoginNavbar;
