import React, { useState } from "react";
import ProfileInfo from "../cards/ProfileInfo";
import { useNavigate, useSearchParams } from "react-router-dom";
import Searchbar from "../Searchbar/Searchbar";

const Navbar = ({ userInfo, onSearchNote }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">NOTEWELL</h2>

      <Searchbar
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
