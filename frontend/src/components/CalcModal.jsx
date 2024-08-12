import React, { useState } from "react";

const CalcModal = ({ active, handleModal }) => {
    const [displayValue, setDisplayValue] = useState("0");

    const handleButtonClick = (value) => {
        // If the display is showing 0, replace it with the clicked value
        // Otherwise, append the clicked value to the display
        setDisplayValue((prevValue) => 
            prevValue === "0" ? value : prevValue + value
        );
    };

    const handleOperation = (operator) => {
        setDisplayValue((prevValue) => prevValue + " " + operator + " ");
    };

    const handleEquals = () => {
        try {
            // Evaluate the expression
            const result = eval(displayValue.replace(/[^-()\d/*+.]/g, ''));
            setDisplayValue(result.toString());
        } catch (error) {
            setDisplayValue("Error");
        }
    };

    const handleClear = () => {
        setDisplayValue("0");
    };

    return (
        <div className={`modal ${active ? "is-active" : ""}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Calculator</p>
                    <button className="delete" aria-label="close" onClick={handleModal}></button>
                </header>
                <section className="modal-card-body">
                    <div className="box">
                        <div className="field has-addons">
                            <div className="control is-expanded">
                                <input 
                                    className="input is-medium has-text-centered" 
                                    type="text" 
                                    readOnly 
                                    value={displayValue} 
                                />
                            </div>
                        </div>
                        <div className="buttons is-centered">
                            <button className="button is-light is-medium" onClick={() => handleButtonClick("7")}>7</button>
                            <button className="button is-light is-medium" onClick={() => handleButtonClick("8")}>8</button>
                            <button className="button is-light is-medium" onClick={() => handleButtonClick("9")}>9</button>
                            <button className="button is-danger is-medium" onClick={() => handleOperation("/")}>/</button>
                        </div>
                        <div className="buttons is-centered">
                            <button className="button is-light is-medium" onClick={() => handleButtonClick("4")}>4</button>
                            <button className="button is-light is-medium" onClick={() => handleButtonClick("5")}>5</button>
                            <button className="button is-light is-medium" onClick={() => handleButtonClick("6")}>6</button>
                            <button className="button is-danger is-medium" onClick={() => handleOperation("*")}>*</button>
                        </div>
                        <div className="buttons is-centered">
                            <button className="button is-light is-medium" onClick={() => handleButtonClick("1")}>1</button>
                            <button className="button is-light is-medium" onClick={() => handleButtonClick("2")}>2</button>
                            <button className="button is-light is-medium" onClick={() => handleButtonClick("3")}>3</button>
                            <button className="button is-danger is-medium" onClick={() => handleOperation("-")}>-</button>
                        </div>
                        <div className="buttons is-centered">
                            <button className="button is-light is-medium" onClick={() => handleButtonClick("0")}>0</button>
                            <button className="button is-light is-medium" onClick={handleClear}>C</button>
                            <button className="button is-success is-medium" onClick={handleEquals}>=</button>
                            <button className="button is-danger is-medium" onClick={() => handleOperation("+")}>+</button>
                        </div>
                    </div>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-light" onClick={handleModal}>Close</button>
                </footer>
            </div>
        </div>
    );
};

export default CalcModal;

