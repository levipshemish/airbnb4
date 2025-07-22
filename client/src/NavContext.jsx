// NavContext.js
import { createContext, useContext, useState } from "react";

const NavContext = createContext();

export const NavProvider = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [cityFilter, setCityFilter] = useState(''); // <-- NEW
  const [guestCount, setGuestCount] = useState(0);

  const toggleNav = () => setIsNavOpen((prev) => !prev);
  const openNav = () => setIsNavOpen(true);
  const closeNav = () => setIsNavOpen(false);

  return (
    <NavContext.Provider
  value={{
    isNavOpen,
    toggleNav,
    openNav,
    closeNav,
    cityFilter,
    setCityFilter,
    guestCount,        
    setGuestCount      
  }}
>
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => useContext(NavContext);
