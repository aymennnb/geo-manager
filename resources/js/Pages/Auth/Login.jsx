import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row ">
            {/* Left side - Form */}
            <div className="w-full md:w-2/2 flex items-center justify-center p-4">
                <div className="w-full max-w-sm">
                    <Head title="Log in" />

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            Prêt à explorer nos implantations ?
                        </h1>
                        <p className="text-sm text-gray-600">
                            Connectez-vous à votre compte pour consulter nos sites <br/> <span className="text-orange-500">M-AUTOMOTIV</span>.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"
                                autoComplete="username"
                                placeholder="youremail@example.com"
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-1 text-xs" />
                        </div>

                        <div className="mb-4 relative">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition pr-10"
                                autoComplete="current-password"
                                placeholder="••••••••"
                            />
                            <div
                                className="absolute right-3 top-9 cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </div>
                            <InputError message={errors.password} className="mt-1 text-xs" />
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    className="h-3 w-3 rounded border-gray-300 text-blue-500 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    onChange={(e) => setData("remember", e.target.checked)}
                                />
                                <span className="ml-1 text-xs text-gray-600">Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-xs text-[#ff6c04] hover:text-[#5a217b] font-medium"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#5a217b] hover:bg-[#381454] text-white font-medium py-2 px-3 text-sm rounded-md transition duration-300 ease-in-out"
                        >
                            {processing ? "Logging in..." : "Log in"}
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-gray-600 text-xs">
                                Don't have an account?{" "}
                                <Link
                                    href={route("register")}
                                    className="text-[#ff6c04] hover:text-[#5a217b] font-medium"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
