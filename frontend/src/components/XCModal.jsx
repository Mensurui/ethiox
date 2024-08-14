import React, { useState, useEffect } from "react";

const XCModal = ({ active, handleModal, token, setErrorMessage }) => {
    const [banksList, setBanksList] = useState([]);
    const [currencyList, setCurrencyList] = useState([]);
    const [sellingPrice, setSellingPrice] = useState("");
    const [buyingPrice, setBuyingPrice] = useState("");
    const [bankId, setBankId] = useState("");
    const [currencyId, setCurrencyId] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;

    const cleanFormData = () => {
        setSellingPrice("");
        setBuyingPrice("");
        setBankId("");
        setCurrencyId("");
        console.log("Form data cleaned");
    };

    const handleCreateExchangeRate = async (e) => {
        e.preventDefault();

        if (!bankId || !currencyId || !sellingPrice || !buyingPrice) {
            setErrorMessage("All fields are required.");
            return;
        }

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                bank_id: bankId,
                currency_id: currencyId,
                selling_price: sellingPrice,
                buying_price: buyingPrice,
            }),
        };

        try {
            const response = await fetch(`${apiUrl}/admin/add_xchange`, requestOptions);

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.detail || "Something went wrong when creating Exchange Rate.");
            } else {
                cleanFormData();
                handleModal();
            }
        } catch (error) {
            setErrorMessage("Network error. Please try again later.");
        }
    };

    useEffect(() => {
        const fetchBanksList = async () => {
            try {
                const requestOptions = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                };
                const response = await fetch(`${apiUrl}/admin/blist`, requestOptions);

                if (!response.ok) {
                    throw new Error("Failed to fetch banks list");
                }

                const data = await response.json();
                setBanksList(data);
            } catch (error) {
                setErrorMessage("Failed to fetch banks list");
            }
        };

        const fetchCurrencyList = async () => {
            try {
                const requestOptions = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                };
                const response = await fetch(`${apiUrl}/admin/clist`, requestOptions);

                if (!response.ok) {
                    throw new Error("Failed to fetch currency list");
                }

                const data = await response.json();
                setCurrencyList(data);
            } catch (error) {
                setErrorMessage("Failed to fetch currency list");
            }
        };

        if (active) {
            fetchBanksList();
            fetchCurrencyList();
        }
    }, [active, token, apiUrl, setErrorMessage]);

    return (
        <div className={`modal ${active ? "is-active" : ""}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">Create Bank</h1>
                </header>
                <section className="modal-card-body">
                    <form>
                        <div className="field">
                            <label className="label">Bank Name</label>
                            <div className="control">
                                <div className="select">
                                    <select
                                        value={bankId}
                                        onChange={(e) => setBankId(e.target.value)}
                                    >
                                        <option value="">Select a bank</option>
                                        {banksList.map((bank) => (
                                            <option key={bank.id} value={bank.id}>
                                                {bank.bank_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Currency Name</label>
                            <div className="control">
                                <div className="select">
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
                        <div className="field">
                            <label className="label">Selling Price</label>
                            <div className="control">
                                <input
                                  type="number"
                                  placeholder="Enter Selling Price"
                                  value={sellingPrice}
                                  onChange={(e) => setSellingPrice(e.target.value)}
                                  className="input"
                                  required
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Buying Price</label>
                            <div className="control">
                                <input
                                  type="number"
                                  placeholder="Enter Buying Price"
                                  value={buyingPrice}
                                  onChange={(e) => setBuyingPrice(e.target.value)}
                                  className="input"
                                  required
                                />
                            </div>
                        </div>
                    </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    <button className="button is-primary" onClick={handleCreateExchangeRate}>Create</button>
                    <button className="button" onClick={handleModal}>Cancel</button>
                </footer>
            </div>
        </div>
    );
};

export default XCModal;

