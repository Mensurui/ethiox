import React, { useContext, useState, useEffect } from "react";
import moment from "moment";

import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import CurrencyCModal from "./CurrencyCModal";


const CurrencyTable=()=>{
    const [token] = useContext(UserContext);
    const [currencylist, setCurrencyList] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [id, setId] = useState(null);

    const handleDelete = async (id) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`,
            },
        };
        const response = await fetch(`/admin/clist?currency_id=${id}`, requestOptions);
        if (!response.ok){
            setErrorMessage("Failed to Delete Bank")
        }

        getCurrencyList();

    };

    const getCurrencyList = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`,
            },
        };

        const response = await fetch('/admin/clist', requestOptions)
        const data = await response.json()

        if (!response.ok){
            setErrorMessage("Something went wrong")
        } else{
            setCurrencyList(data)
            setLoaded(true)
        }
    };

    useEffect(() => {
        getCurrencyList()
    },[])

    const handleModal = () => {
        setActiveModal(!activeModal);
        getCurrencyList();
        setId(null);
    }

    return (
        <>
        <CurrencyCModal active={activeModal} handleModal={handleModal} token={token} id={id} setErrorMessage={setErrorMessage}/>
        <button className="button is-fullwidth mb-5 is-primary" onClick={() => setActiveModal(true)}>
        Add Currency
        </button>
        <ErrorMessage message={errorMessage}/>

        {loaded && currencylist ? (
            <table className="table is-fullwidth">
            <thead>
            <tr>
            <th>Currency Name</th>
            <th>Icon</th>
            <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            { currencylist.map((currency) => (
                <tr key={currency.id}>
                <td>
                {currency.currency_name}
                </td>
                <td>
                {currency.currency_icon}
                </td>
                <td>
                 <button className="button mr-2 is-info is-danger" onClick={() => handleDelete(currency.id)}>
                    Delete
                </button>
                </td>
                </tr>
            )  )}
            </tbody>
            </table>
        ): <p>Loading</p>}
        </>)
};

export default CurrencyTable;
