import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [, setToken] = useContext(UserContext);

    const submitRegistration = async () => {
        try {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            };

            const response = await fetch("/admin/register/", requestOptions);
            const data = await response.json();

            if (!response.ok) {
                console.error("Error:", data);
                alert("Registration failed: " + data.message || "An error occurred");
            } else {
                console.log("Data:", data.access_token);
                localStorage.setItem("exrToken", data.access_token); // Save token to localStorage
                setToken(data.access_token); // Update context
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("An error occurred: " + error.message);
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
        </div>
    );
};

export default Register;

