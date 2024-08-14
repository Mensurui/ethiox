import React, { useState } from "react";
import axios from "axios";

const CurrencyCModal = ({ active, handleModal, token, id, setErrorMessage }) => {
    const [currencyName, setCurrencyName] = useState("");
    const [currencyIcon, setCurrencyIcon] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

    const cleanFormData = () => {
        setCurrencyName("");
        setCurrencyIcon("");
    }

    const handleCreateCurrency = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${apiUrl}/admin/add_currency`,
                {
                    currency_name: currencyName,
                    currency_icon: currencyIcon,
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            cleanFormData();
            handleModal();
        } catch (error) {
            setErrorMessage("Something went wrong when creating the currency");
        }
    };

    return (
        <div className={`modal ${active ? "is-active" : ""}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">Create Currency</h1>
                </header>
                <section className="modal-card-body">
                    <form>
                        <div className="field">
                            <label className="label">Currency Name</label>
                            <div className="control">
                                <input
                                    type="text"
                                    placeholder="Enter Currency Name"
                                    value={currencyName}
                                    onChange={(e) => setCurrencyName(e.target.value)}
                                    className="input"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Enter Currency Icon"
                                    value={currencyIcon}
                                    onChange={(e) => setCurrencyIcon(e.target.value)}
                                    className="input mt-3"
                                />
                            </div>
                        </div>
                    </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    <button className="button is-primary" onClick={handleCreateCurrency}>Create</button>
                    <button className="button" onClick={handleModal}>Cancel</button>
                </footer>
            </div>
        </div>
    );
};

export default CurrencyCModal;

