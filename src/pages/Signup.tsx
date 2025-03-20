import { useState } from "react"
import { supabase } from "../supabaseClient"


import CustomButton from "../components/CustomButton"
import TextCard from "../components/TextCard"
import { useNavigate } from "react-router-dom"

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()

    const isEmail = (email: string) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

    const register = (email: string, password: string) =>
        supabase.auth.signUp({ email, password });

    const redirectToDashboard = () => {
        navigate('/dashboard')
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setErrorMsg("")

        if (!isEmail(email)) {
            setErrorMsg("Wrong email");
            return
        }

        if (password !== repeatPassword) {
            setErrorMsg("Passwords doesn't match");
            return
        }

        if (password.length < 8) {
            setErrorMsg("Password needs to be at least 8 characters");
            return
        }

        try {
            setErrorMsg("");
            setLoading(true);
            const { data, error } = await register(
                email,
                password
            );
            if (!error && data) {
                setMsg(
                    "Registration Successful."
                );
            }
        } catch (error) {
            setErrorMsg("Error in Creating Account");
        }

        setLoading(false);
        redirectToDashboard();
    };

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center relative">

            {errorMsg && <div role="alert" className="alert alert-error absolute bottom-10 right-10">
                <svg className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMsg}</span>
            </div>}

            <h2 className="text-5xl font-bold text-secondary leading-[100%] mb-4">
                Sign<TextCard backgroundColor="info">up🔒</TextCard></h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="email" className="input text-secondary bg-neutral-100 font-bold" required />
                <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" className="input text-secondary bg-neutral-100 font-bold" required />
                <input onChange={(e) => setRepeatPassword(e.target.value)} type="password" placeholder="repeat password" className="input text-secondary bg-neutral-100 font-bold" required />
                <CustomButton type="submit" disabled={loading} >Signup</CustomButton>
            </form>
        </div>
    )
}

export default Signup