import React, { useState, useEffect, useContext } from "react";

import Register from "./components/Register" 
import Header from "./components/Header";
import Login from "./components/Login"
import Table from "./components/Table"
import XRTable from "./components/XRTable"
import CurrencyTable from "./components/CurrencyTable"
import ImageUpload from "./components/ImageUpload"
import ImageRemove from "./components/ImageRemove"
import { UserContext } from "./context/UserContext"

const Admin = () => {
    const [message, setMessage] = useState("");
    const [token] = useContext(UserContext);
    const getWelcomeMessage = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
            },
        };
        const response = await fetch("/root", requestOptions);
        const data = await response.json();

        if (!response.ok){
            console.log("Error")
        } else{
            setMessage(data)
        }
    };

    useEffect(() => {
        getWelcomeMessage()
    },[])
    return (
        <>
        <Header title={message.message} />
        <div className="columns">
        <div className="column"></div>
        <div className="column m-5 is-two-thirds">
          {!token ? (
            <div className="columns">
              <Register /> <Login /> 
            </div>
          ) : (
              <>
            <Table />
            <XRTable />
              <CurrencyTable />
              <ImageUpload />
              <ImageRemove />
              </>
          )}
        </div>
        <div className="column">
        </div>
      </div>
       </>
    );
}

export default Admin;
