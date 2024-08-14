import React, { useContext, useState, useEffect, useCallback } from "react";
import moment from "moment";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import XCModal from "./XCModal";
import axios from "axios";

const XRTable = () => {
    const [token] = useContext(UserContext);
    const [xlist, setXList] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [id, setId] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

    const getXList = useCallback(async () => {
        try {
            const response = await axios.get(`${apiUrl}/admin/xlist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setXList(response.data);
            setLoaded(true);
        } catch (error) {
            setErrorMessage("Failed to fetch exchange rates.");
        }
    }, [apiUrl, token]);

    useEffect(() => {
        getXList();
    }, [getXList]);

    const handleDelete = async (id) => {
        if (!id) {
            setErrorMessage("Invalid ID for deletion.");
            return;
        }
        try {
            await axios.delete(`${apiUrl}/admin/x_rlist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    x_id: id,
                },
            });
            setErrorMessage("Exchange rate deleted successfully.");
            getXList(); // Refresh the list after deletion
        } catch (error) {
            setErrorMessage("Failed to delete exchange rate.");
        }
    };

    const handleModal = () => {
        setActiveModal(!activeModal);
        setId(null); // Reset ID when toggling the modal
    };

    return (
        <>
            <XCModal
                active={activeModal}
                handleModal={handleModal}
                token={token}
                id={id}
                setErrorMessage={setErrorMessage}
                onSuccess={getXList} // Refresh list on successful operation
            />
            <button
                className="button is-fullwidth mb-5 is-primary"
                onClick={() => setActiveModal(true)}
            >
                New Exchange Rate
            </button>
            <ErrorMessage message={errorMessage} />

            {loaded ? (
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
                        {xlist.map((x) => (
                            <tr key={x.id}>
                                <td>{x.bank_name}</td>
                                <td>{x.currency_name}</td>
                                <td>{x.currency_icon}</td>
                                <td>{x.selling_price}</td>
                                <td>{x.buying_price}</td>
                                <td>{moment(x.date).format("MMM Do YY")}</td>
                                <td>{moment(x.date).format("hh:mm A")}</td>
                                <td>
                                    <button
                                        className="button mr-2 is-info is-danger"
                                        onClick={() => handleDelete(x.id)}
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

export default XRTable;

