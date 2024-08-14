import React, { useContext, useState, useEffect } from "react";
import moment from "moment";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import BankCModal from "./BankCModal";
import axios from "axios";

const Table = () => {
    const [token] = useContext(UserContext);
    const [banklist, setBankList] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [id, setId] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiUrl}/admin/blist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    bank_id: id,
                },
            });
            getBankList(); // Refresh the list after deletion
        } catch (error) {
            setErrorMessage("Failed to delete bank");
        }
    };

    const getBankList = async () => {
        try {
            const response = await axios.get(`${apiUrl}/admin/blist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBankList(response.data);
            setLoaded(true);
        } catch (error) {
            setErrorMessage("Something went wrong");
        }
    };

    useEffect(() => {
        getBankList();
    }, []);

    const handleModal = () => {
        setActiveModal(!activeModal);
        getBankList();
        setId(null);
    };

    return (
        <>
            <BankCModal
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
                Add Bank
            </button>
            <ErrorMessage message={errorMessage} />

            {loaded && banklist ? (
                <table className="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Bank Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banklist.map((bank) => (
                            <tr key={bank.id}>
                                <td>{bank.bank_name}</td>
                                <td>
                                    <button
                                        className="button mr-2 is-info is-danger"
                                        onClick={() => handleDelete(bank.id)}
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

export default Table;

