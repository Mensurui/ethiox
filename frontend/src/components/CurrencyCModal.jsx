import React, { useState } from "react";

const CurrencyCModal = ({ active, handleModal, token, id, setErrorMessage }) => {
    const [currencyName, setCurrencyName] = useState("");
    const [currencyIcon, setCurrencyIcon] = useState("");
    const cleanFormData = () => {
        setCurrencyName("");
    }
    const handleCreateCurrency = async(e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`,
            },
            body:JSON.stringify({currency_name:currencyName, currency_icon:currencyIcon}),
        };
        const response = await fetch("/admin/add_currency", requestOptions);

        if (!response.ok){
            setErrorMessage("Something went wrong when creating Bank");
        }else{
            cleanFormData();
            handleModal();
        }
    };

  return (
    <div className={`modal ${active && "is-active"}`}>
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
                placeholder="Enter Currency icon"
                value={currencyIcon}
                onChange={(e) => setCurrencyIcon(e.target.value)}
                className="input"
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

