import React, { useContext, useState, useEffect } from "react";
import moment from "moment";

import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import BankCModal from "./BankCModal";


const Table=()=>{
    const [token] = useContext(UserContext);
    const [banklist, setBankList] = useState(null);
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
        const response = await fetch(`/admin/blist?bank_id=${id}`, requestOptions);
        if (!response.ok){
            setErrorMessage("Failed to Delete Bank")
        }

        getBankList();
    };

    const getBankList = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`,
            },
        };

        const response = await fetch('/admin/blist', requestOptions)
        const data = await response.json()

        if (!response.ok){
            setErrorMessage("Something went wrong")
        } else{
            setBankList(data)
            setLoaded(true)
        }
    };

    useEffect(() => {
        getBankList()
    },[])

    const handleModal = () => {
        setActiveModal(!activeModal);
        getBankList();
        setId(null);
    }

    return (
        <>
        <BankCModal active={activeModal} handleModal={handleModal} token={token} id={id} setErrorMessage={setErrorMessage}/>
        <button className="button is-fullwidth mb-5 is-primary" onClick={() => setActiveModal(true)}>
        Add Bank
        </button>
        <ErrorMessage message={errorMessage}/>

        {loaded && banklist ? (
            <table className="table is-fullwidth">
            <thead>
            <tr>
            <th>Bank Name</th>
            <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            { banklist.map((bank) => (
                <tr key={bank.id}>
                <td>
                {bank.bank_name}
                </td>
                <td>
                 <button className="button mr-2 is-info is-danger" onClick={() => handleDelete(bank.id)}>
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

export default Table;
