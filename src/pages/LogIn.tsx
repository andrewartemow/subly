import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

import CustomButton from "../components/CustomButton"
import TextCard from "../components/TextCard"

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    const { login }: any = useAuth();

    const redirectToDashboard = () => {
        navigate('/dashboard')
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setErrorMsg("");

            const {
                data: { user, session },
                error
            } = await login(email, password);

            if (error) setErrorMsg(error.message);

            if (user && session) redirectToDashboard();
        } catch (error) {
            setErrorMsg("Email or Password Incorrect");
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center relative">

            {errorMsg && <div role="alert" className="alert alert-error absolute bottom-10 right-10">
                <svg className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-base-100">{errorMsg}</span>
            </div>}

            <h2 className="text-5xl font-bold text-secondary leading-[100%] mb-4">
                Log<TextCard backgroundColor="info">in🔑</TextCard></h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
                <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="username" className="input text-secondary bg-neutral-100 font-bold" required />
                <input onChange={(e) => setPassword(e.target.value)} type="text" placeholder="password" className="input text-secondary bg-neutral-100 font-bold" required />
                <CustomButton type="submit">Login</CustomButton>
            </form>
            {/* <p className="text-secondary p-2 border-2 border-neutral-200 bg-neutral-100 rounded-lg">test: andrewartemow@gmail.com, 12345678</p> */}
        </div>
    )
}

export default LogIn