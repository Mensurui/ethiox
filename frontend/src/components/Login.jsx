import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000'; // Default to local if not set

    const submitLogin = async () => {
        try {
            const response = await axios.post(
                `${apiUrl}/token`,
                new URLSearchParams({
                    grant_type: "password",
                    username: username,
                    password: password,
                    scope: "",
                    client_id: "",
                    client_secret: "",
                }),
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );

            localStorage.setItem("exrToken", response.data.access_token);
            setToken(response.data.access_token);
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.detail);
            } else {
                setErrorMessage("Something went wrong");
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitLogin();
    };

    return (
        <div className="column">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Login</h1>
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
                    Login
                </button>
            </form>
            {errorMessage && <ErrorMessage message={errorMessage} />}
        </div>
    );
};

export default Login;

