import React, {useState, createContext} from 'react';

export const EditContext = createContext();

export const EditProvider = ({children}) => {
  const [currentRoute, setCurrentRoute] = useState('');

  const changeCurrentRoute = async value => {
    setCurrentRoute(value);
  };

  return (
    <EditContext.Provider value={{currentRoute, changeCurrentRoute}}>
      {children}
    </EditContext.Provider>
  );
};
