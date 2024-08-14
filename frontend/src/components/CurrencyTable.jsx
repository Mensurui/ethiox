import React, { useContext, useState, useEffect, useCallback } from "react";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import CurrencyCModal from "./CurrencyCModal";
import axios from "axios";

const CurrencyTable = () => {
    const [token] = useContext(UserContext);
    const [currencyList, setCurrencyList] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [id, setId] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

    const getCurrencyList = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/admin/clist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCurrencyList(response.data);
            setLoaded(true);
        } catch (error) {
            setErrorMessage("Something went wrong");
        }
    }, [apiUrl, token]);

    const handleDelete = async (id) => {
        if (!id) {
            setErrorMessage("Invalid ID for deletion");
            return;
        }
        try {
            await axios.delete(`${apiUrl}/admin/clist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    currency_id: id,
                },
            });
            getCurrencyList(); // Refresh the list after deletion
        } catch (error) {
            setErrorMessage("Failed to delete currency");
        }
    };

    useEffect(() => {
        getCurrencyList();
    }, [getCurrencyList]);

    const handleModal = () => {
        setActiveModal(!activeModal);
        setId(null);
    };

    return (
        <>
            <CurrencyCModal
                active={activeModal}
                handleModal={handleModal}
                token={token}
                id={id}
                setErrorMessage={setErrorMessage}
            />
            <button
                className="button is-fullwidth mb-5 is-primary"
                onClick={() => setActiveModal(true)}
            >
                Add Currency
            </button>
            <ErrorMessage message={errorMessage} />

            {loaded && currencyList.length > 0 ? (
                <table className="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Currency Name</th>
                            <th>Icon</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currencyList.map((currency) => (
                            <tr key={currency.id}>
                                <td>{currency.currency_name}</td>
                                <td>{currency.currency_icon}</td>
                                <td>
                                    <button
                                        className="button mr-2 is-danger"
                                        onClick={() => handleDelete(currency.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
};

export default CurrencyTable;

