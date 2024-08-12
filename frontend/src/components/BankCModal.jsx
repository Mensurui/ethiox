import React, { useState } from "react";

const BankCModal = ({ active, handleModal, token, id, setErrorMessage }) => {
    const [bankName, setBankName] = useState("");
    const cleanFormData = () => {
        setBankName("");
    }
    const handleCreateBank = async(e) => {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`,
            },
            body:JSON.stringify({bank_name:bankName}),
        };
        const response = await fetch("/admin/add_banks", requestOptions);

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
          <h1 className="modal-card-title">Create Bank</h1>
        </header>
        <section className="modal-card-body">
          <form>
            <div className="field">
              <label className="label">Bank Name</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Enter Bank Name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="input"
                  required
                />
              </div>
            </div>
          </form>
        </section>
      <footer className="modal-card-foot has-background-primary-light">
      <button className="button is-primary" onClick={handleCreateBank}>Create</button>
      <button className="button" onClick={handleModal}>Cancel</button>
      </footer>
      </div>
    </div>
  );
};

export default BankCModal;

