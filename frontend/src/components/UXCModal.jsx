import React, { useState, useEffect } from "react";
import axios from 'axios';

const UXCModal = ({ active, handleModal, token, setErrorMessage, onFilter }) => {
    const [currencyId, setCurrencyId] = useState("");
    const [currencyList, setCurrencyList] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000"; // API base URL

    const cleanFormData = () => {
        setCurrencyId("");
        console.log("Form data cleaned");
    };

    const handleCreateExchangeRate = async (e) => {
        e.preventDefault();

        if (!currencyId) {
            setErrorMessage("Please select a currency.");
            return;
        }

        // Pass the selected currency ID to the parent component
        console.log(currencyId);
        onFilter(currencyId);

        cleanFormData();
        handleModal();
    };

    useEffect(() => {
        const fetchCurrencyList = async () => {
            try {
                const response = await axios.get(`${apiUrl}/user/clist`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.status === 200) {
                    throw new Error("Failed to fetch currency list");
                }

                setCurrencyList(response.data);
            } catch (error) {
                setErrorMessage("Failed to fetch currency list");
            }
        };

        if (active) {
            fetchCurrencyList();
        }
    }, [active, apiUrl, token, setErrorMessage]);

    return (
        <div className={`modal ${active ? "is-active" : ""}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Create Exchange Rate</p>
                    <button className="delete" aria-label="close" onClick={handleModal}></button>
                </header>
                <section className="modal-card-body">
                    <form onSubmit={handleCreateExchangeRate}>
                        <div className="field">
                            <label className="label">Currency Name</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select
                                        value={currencyId}
                                        onChange={(e) => setCurrencyId(e.target.value)}
                                    >
                                        <option value="">Select a Currency</option>
                                        {currencyList.map((currency) => (
                                            <option key={currency.id} value={currency.id}>
                                                {currency.currency_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="buttons is-right">
                            <button className="button is-primary" type="submit">Filter</button>
                            <button className="button" onClick={handleModal}>Cancel</button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default UXCModal;

