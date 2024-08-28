import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

type handle = {
    email: string;
    password: string;
};

const Login: React.FC = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL as string;
    

    if (!apiUrl) {
        throw new Error("API URL is not defined in env variable");
    }

    const navigate = useNavigate();
    const [logindetails, setLoginDetails] = useState<handle>({
        email: '',
        password: ''
    });

    const [message, setMessage] = useState({
        type: '',
        text: ''
    });

    function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
        setLoginDetails((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    }

    function SubmitForm(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        fetch(`${apiUrl}/login`, {
            method: "POST",
            body: JSON.stringify(logindetails),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            if (response.status === 404) {
                setMessage({ type: "error", text: "Email is invalid" });
            } else if (response.status === 403) {
                setMessage({ type: "error", text: "Incorrect password" });
            } else if (response.status === 200) {
                setMessage({ type: "success", text: "User logged in successfully" });
                setLoginDetails({
                    email: '',
                    password: ''
                });
                setTimeout(() => {
                    setMessage({ type: "invisible", text: "" });
                }, 4000);
                return response.json();
            }
        })
        .then((data) => {
            if (data) {
                localStorage.setItem('ExpenseToken', JSON.stringify(data));
                navigate('/expenses');
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }

    return (
        <>
            <form className="forms" onSubmit={SubmitForm}>
                <div className="form loginbox">
                    <input
                        className="inp"
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={logindetails.email}
                        onChange={handleInput}
                        required
                    />
                    <input
                        className="inp"
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        value={logindetails.password}
                        onChange={handleInput}
                        required
                    />
                    <button className="btm">Login</button>
                    <p className="reg">
                        Don't have an account? <Link className="link" to={'/register'}>Register here</Link>
                    </p>
                    <p className={message.type}>{message.text}</p>
                </div>
            </form>
        </>
    );
}

export default Login;
