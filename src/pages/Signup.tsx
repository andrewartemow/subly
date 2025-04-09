import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import TextCard from "../components/TextCard";

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        email: "",
        password: "",
        repeatPassword: ""
    });
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const isEmail = (email: string) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        // Validation
        if (!formData.firstName.trim()) {
            setErrorMsg("First name is required");
            return;
        }

        if (!isEmail(formData.email)) {
            setErrorMsg("Please enter a valid email");
            return;
        }

        if (formData.password.length < 8) {
            setErrorMsg("Password must be at least 8 characters");
            return;
        }

        if (formData.password !== formData.repeatPassword) {
            setErrorMsg("Passwords don't match");
            return;
        }

        try {
            setLoading(true);

            // 1. Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password
            });

            if (authError) throw authError;

            // 2. Update customer profile (trigger will have created the initial record)
            if (authData.user) {
                const { error: profileError } = await supabase
                    .from("customers")
                    .update({
                        first_name: formData.firstName.trim()
                    })
                    .eq("user_id", authData.user.id);

                if (profileError) throw profileError;

                setSuccessMsg("Account created successfully! Redirecting...");
                setTimeout(() => navigate("/dashboard"), 2000);
            }
        } catch (error: any) {
            console.error("Signup error:", error);
            setErrorMsg(error.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center bg-base-100 p-4">
            <div className="w-full max-w-md">
                <h1 className="text-4xl font-bold text-center mb-8">
                    Create <TextCard backgroundColor="info">Account</TextCard>
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                            First Name
                        </label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="repeatPassword" className="block text-sm font-medium mb-1">
                            Confirm Password
                        </label>
                        <input
                            id="repeatPassword"
                            name="repeatPassword"
                            type="password"
                            value={formData.repeatPassword}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <CustomButton
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </CustomButton>
                </form>

                {errorMsg && (
                    <div className="alert alert-error mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errorMsg}</span>
                    </div>
                )}

                {successMsg && (
                    <div className="alert alert-success mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{successMsg}</span>
                    </div>
                )}

                <p className="text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="link link-primary">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;