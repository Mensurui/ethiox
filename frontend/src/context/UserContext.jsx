import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("exrToken"));

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      };

      const response = await fetch("/admin/me", requestOptions);
      console.log("Response is ", response);

      if (!response.ok) {
        console.log("Clearing token due to unauthorized response");
        setToken(null);
        localStorage.removeItem("exrToken");
      }
    };

    fetchUser();
  }, [token]);

  // Update localStorage whenever the token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("exrToken", token);
      console.log("Token saved to localStorage:", token);
    }
  }, [token]);

  return (
    <UserContext.Provider value={[token, setToken]}>
      {props.children}
    </UserContext.Provider>
  );
};

