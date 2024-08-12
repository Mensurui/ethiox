import React, { useContext, useState, useEffect } from "react";
import moment from "moment";

import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import XCModal from "./XCModal";


const XRTable=()=>{
    const [token] = useContext(UserContext);
    const [xlist, setXList] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [id, setId] = useState(null);

    const handleDelete = async (id) => {
        if (id === null || id === undefined) {
            setErrorMessage("Invalid ID for deletion.");
            return;
        }
        console.log("Deleting item with id:", id);
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        };

        const response = await fetch(` /admin/x_rlist?x_id=${id}`, requestOptions);
        if (!response.ok) {
            setErrorMessage("Failed to Delete Bank");
        }

        getXList();
    };

    const getXList = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`,
            },
        };

        const response = await fetch('/admin/xlist', requestOptions)
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
        <XCModal active={activeModal} handleModal={handleModal} token={token} id={id} setErrorMessage={setErrorMessage}/>
        <button className="button is-fullwidth mb-5 is-primary" onClick={() => setActiveModal(true)}>
        New Exchange Rate?
        </button>
        <ErrorMessage message={errorMessage}/>

        {loaded && xlist ? (
            <table className="table is-fullwidth">
            <thead>
            <tr>
            <th>Bank Name</th>
            <th>Currency Name</th>
            <th>Currency Icon</th>
            <th>Selling Price</th>
            <th>Buying Price</th>
            <th>Date</th>
            <th>Hour</th>
            <th>Action</th>
            </tr>
            </thead>
            <tbody>
            { xlist.map((x) => (
                <tr key={x.id}>
                <td>
                {x.bank_name}
                </td>
                <td>
                {x.currency_name}
                </td>
                <td>
                {x.currency_icon}
                </td>
                <td>
                {x.selling_price}
                </td>
                <td>
                {x.buying_price}
                </td>
                <td>
                {moment(x.date).format("MMM Do YY")}
                </td>
                <td>
                {moment(x.date).format("hh:mm A")}
                </td>
                <td>
                 <button className="button mr-2 is-info is-danger" onClick={() => handleDelete(x.id)}>
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

export default XRTable;
