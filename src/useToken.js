import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    if(tokenString !== null && tokenString !=='undefined')
    {return JSON.parse(tokenString);}
    return tokenString;
  };
  
 const [token, setToken] = useState(getToken);

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  };
  return {
    setToken: saveToken,
    token
  }
}