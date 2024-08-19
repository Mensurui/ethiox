import React, { useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import UXCModal from "./UXCModal";
import CalcModal from "./CalcModal";
import { useTranslation } from 'react-i18next';

const UTable = () => {
    const [token] = useContext(UserContext);
    const [xlist, setXList] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [calcModal, setCalcModal] = useState(false);
    const [currencyId, setCurrencyId] = useState(1);
    const [t] = useTranslation();
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000"; // API base URL
    console.log("API URL", apiUrl)

    const getXList = useCallback(async (currencyId = null) => {
        const url = currencyId ? `${apiUrl}/user/xlist?currency_id=${currencyId}` : `${apiUrl}/user/xlist`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setXList(response.data);
            setLoaded(true);
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage("Failed to fetch data");
        }
    }, [apiUrl, token]);

    useEffect(() => {
        getXList(currencyId);
    }, [currencyId, getXList]);

    const handleModal = () => {
        setActiveModal(!activeModal);
    };

    const handleCalcModal = () => {
        setCalcModal(!calcModal);
    };

    const handleFilter = (selectedCurrencyId) => {
        setCurrencyId(selectedCurrencyId);
        setActiveModal(false);
    };

    const [expandedRowId, setExpandedRowId] = useState(null);

    const toggleExpandRow = (id) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    return (
        <>
            <ErrorMessage message={errorMessage} />
            {loaded && xlist ? (
                <>
                    <div className="has-text-centered">
                        <p className="title is-3 mt-4 has-text-info">{t('userTable.title')}</p>
                        <p className="subtitle is-5 has-text-grey-dark">{t('userTable.subTitle')}</p>
                    </div>
                    <div className="table-container mt-5">
                        <table className="table is-fullwidth is-bordered is-striped is-hoverable">
                            <thead className="has-background-info">
                                <tr>
                                    <th className="has-text-white">{t('userTable.bankName')}</th>
                                    <th className="has-text-white">{t('userTable.currencyName')}</th>
                                    <th className="has-text-white">{t('userTable.sellingPrice')}</th>
                                    <th className="has-text-white">{t('userTable.buyingPrice')}</th>
                                    <th className="has-text-white">{t('userTable.more')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {xlist.map((x) => (
                                    <>
                                        <tr key={x.id}>
                                            <td>{x.bank_name}</td>
                                            <td>{x.currency_name}</td>
                                            <td className="has-text-danger">{x.selling_price}</td>
                                            <td className="has-text-success">{x.buying_price}</td>
                                            <td>
                                                <button className="button is-small is-info" onClick={() => toggleExpandRow(x.id)}>
                                                    {expandedRowId === x.id ? t('userTable.hide') : t('userTable.more')}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedRowId === x.id && (
                                            <tr>
                                                <td colSpan="5">
                                                    <div className="box has-background-grey-lighter">
                                                        <p className="has-text-centered has-text-black"><strong>{t('userTable.subUserTable.currencyIcon')}:</strong> {x.currency_icon}</p>
                                                        <p className="has-text-centered has-text-black"><strong>{t('userTable.subUserTable.date')}:</strong> {moment(x.date).format("MMM Do YY")}</p>
                                                        <p className="has-text-black has-text-centered"><strong>{t('userTable.subUserTable.hour')}:</strong> {moment(x.date).format("hh:mm A")}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="buttons mt-5 mb-5">
                        <button className="button is-info" onClick={() => setActiveModal(true)}>
                            Filter
                        </button>
                        <button className="button is-primary ml-3" onClick={() => setCalcModal(true)}>
                            Calculator
                        </button>
                    </div>
                </>
            ) : (
                <p className="has-text-centered has-text-warning">{t('userTable.loading')}</p>
            )}
            <UXCModal 
                active={activeModal} 
                handleModal={handleModal} 
                token={token} 
                setErrorMessage={setErrorMessage}
                onFilter={handleFilter} 
            />
            <CalcModal 
                active={calcModal} 
                handleModal={handleCalcModal}
            />
        </>
    );
};

export default UTable;

