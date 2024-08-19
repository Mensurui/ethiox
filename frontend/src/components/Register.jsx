import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage"; // Import ErrorMessage component

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // State for error message
    const [, setToken] = useContext(UserContext);
    const apiUrl = process.env.REACT_APP_API_URL || 'https://exr.et/api';

    const submitRegistration = async () => {
        try {
            const response = await axios.post(
                `${apiUrl}/admin/register/`,
                { username, password },
                { headers: { "Content-Type": "application/json" } }
            );

            localStorage.setItem("exrToken", response.data.access_token);
            setToken(response.data.access_token);
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || "Registration failed"); // Handle error response
            } else {
                setErrorMessage("An error occurred: " + error.message); // Handle general errors
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitRegistration();
    };

    return (
        <div className="column">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Register</h1>
                <div className="field">
                    <label className="label">Username</label>
                    <div className="control">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>
                <br />
                <button className="button is-primary" type="submit">
                    Register
                </button>
            </form>
            {errorMessage && <ErrorMessage message={errorMessage} />} {/* Show error message if exists */}
        </div>
    );
};

export default Register;

