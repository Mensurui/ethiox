import React, { useContext, useState, useEffect } from "react";
import moment from "moment";

import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import UXCModal from "./UXCModal";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const BarGraph=()=>{
    const [token] = useContext(UserContext);
    const [xlist, setXList] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [id, setId] = useState(null);

    const getXList = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
            },
        };

        const response = await fetch('/user/xlist', requestOptions)
        const data = await response.json()

        if (!response.ok){
            setErrorMessage("Something went wrong")
        } else{
            setXList(data)
            setLoaded(true)
        }
    };

    useEffect(() => {
        getXList()
    },[])

    const handleModal = () => {
        setActiveModal(!activeModal);
        getXList();
        setId(null);
    }

    return (
        <>
        <UXCModal active={activeModal} handleModal={handleModal} token={token} id={id} setErrorMessage={setErrorMessage}/>
        <button className="button is-fullwidth mb-5 is-primary" onClick={() => setActiveModal(true)}>
        Calculate
        </button>
        <ErrorMessage message={errorMessage}/>
        <ResponsiveContainer width="100%" height={300}>
        <BarChart
          width={500}
          height={300}
          data={xlist}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
        <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bank_name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="selling_price" fill="#8884d8" shape={<Rectangle fill="pink" stroke="blue" />} />
          <Bar dataKey="buying_price" fill="#82ca9d" shape={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </ResponsiveContainer>

       </>)
};

export default BarGraph;
