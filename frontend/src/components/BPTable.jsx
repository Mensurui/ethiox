import React, { useContext, useState, useEffect, useCallback } from "react";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import UXCModal from "./UXCModal";
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useTranslation, Trans } from 'react-i18next'

const BPTable = () => {
    const [token] = useContext(UserContext);
    const [xlist, setXList] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [id, setId] = useState(null);
    const [currency, setCurrency] = useState("Dollar"); // Default currency
      const [isVisible, setIsVisible] = useState(true); // For blinking "Live" tag
    const[t] = useTranslation();

    const getXList = useCallback(async (currencyName) => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await fetch(`/user/xlist/tbp?currency_name=${currencyName}`, requestOptions);
            const data = await response.json();

            if (!response.ok) {
                setErrorMessage("Something went wrong");
            } else {
                setXList(data);
                setLoaded(true);
            }
        } catch (error) {
            setErrorMessage("Something went wrong");
        }
    }, []);

    useEffect(() => {
        getXList(currency);
    }, [currency, getXList]); // Re-fetch data when currency changes

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible((prev) => !prev);
        }, 1000); // Toggle visibility every 30 seconds
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);


    const handleCurrencyChange = (currencyName) => {
        setCurrency(currencyName);
        setLoaded(false);
    };

    const handleModal = () => {
        setActiveModal(!activeModal);
        setId(null);
    };
    return (
        <>
      <div className="box is-mobile">
        <UXCModal active={activeModal} handleModal={handleModal} token={token} id={id} setErrorMessage={setErrorMessage} />
        <span className={`tag is-danger ${isVisible ? '' : 'is-invisible'}`} style={{ display: 'inline-block', minWidth: '40px', textAlign: 'center' }}>
          Live
        </span>
        <p className="title has-text-primary-10">{t('buyingTable.title')}</p>

        <div className="container">
          <div className="buttons is-centered is-flex-wrap-wrap">
            <button
              className={`button is-info ${currency === 'Dollar' ? '' : 'is-light'} has-text-black-bis`}
              onClick={() => handleCurrencyChange('Dollar')}
            >
              <p className="has-text-black-bis">USD</p>
            </button>
            <button
              className={`button is-info ${currency === 'Pound' ? '' : 'is-light'} has-text-black-bis`}
              onClick={() => handleCurrencyChange('Pound')}
            >
              <p className="has-text-black-bis">Pound</p>
            </button>
            <button
              className={`button is-info ${currency === 'Yen' ? '' : 'is-light'} has-text-black-bis`}
              onClick={() => handleCurrencyChange('Yen')}
            >
              Yen
            </button>
            <button
              className={`button is-info ${currency === 'Dirham' ? '' : 'is-light'} has-text-black-bis`}
              onClick={() => handleCurrencyChange('Dirham')}
            >
              Dirham
            </button>
            <button
              className={`button is-info ${currency === 'Riyal' ? '' : 'is-light'} has-text-black-bis`}
              onClick={() => handleCurrencyChange('Riyal')}
            >
              Riyal
            </button>
            <button
              className={`button is-info ${currency === 'Euro' ? '' : 'is-light'} has-text-black-bis`}
              onClick={() => handleCurrencyChange('Euro')}
            >
              Euro
            </button>
          </div>
        </div>


       {loaded && xlist ? (
          <div>
            <table class="table is-fullwidth has-background-white">
  <thead>
    <tr>
      <th className="has-text-primary-10">{t('buyingTable.bankName')}</th>
      <th className="has-text-primary-10">{t('buyingTable.buyingPrice')}</th>
    </tr>
  </thead>
  <tbody class="table is-border">
    {xlist.map((x) => (
      <tr key={x.id}>
        <td>
          <p class="has-text-info">{x.bank_name}</p>
        </td>
        <td>
          <p class="has-text-info">{x.buying_price}</p>
        </td>
      </tr>
    ))}
  </tbody>
</table>

         </div>
        ):(
          <p>Loading</p>
        )}
      </div>

    </>
  );
};

export default BPTable;
