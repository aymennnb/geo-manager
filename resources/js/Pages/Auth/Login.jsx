import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";
import { motion } from "framer-motion";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const width = useWindowWidth();
    const isMobile = width < 768;

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row ">
            <motion.div
                className="w-full h-[95vh] flex items-center justify-center p-8"
                initial={{ x: '100%', opacity: 0 }}  // Commence depuis la droite
                animate={{ x: 0, opacity: 1 }}      // Arrive au centre
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    duration: 0.8
                }}
            >
                <div className="w-full max-w-sm">
                    <Head title="Log in" />

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            Prêt à explorer nos implantations ?
                        </h1>
                        <p className="text-sm text-gray-600">
                            Connectez-vous à votre compte pour consulter nos sites {!isMobile ? <br/> : null} <span className="text-orange-500">M-AUTOMOTIV</span>.
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
                                Adresse e-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"
                                autoComplete="username"
                                placeholder="votre email"
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="mb-4 relative">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition pr-10"
                                autoComplete="current-password"
                                placeholder="••••••••"
                            />
                            <div
                                className="absolute right-3 top-9 cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
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
                                <span className="ml-1 text-xs text-gray-600">Se souvenir de moi</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-xs text-[#ff6c04] hover:text-[#5a217b] font-medium"
                                >
                                    Mot de passe oublié?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#5a217b] hover:bg-[#381454] text-white font-medium py-2 px-3 text-sm rounded-md transition duration-300 ease-in-out"
                        >
                            {processing ? "Connexion en cours..." : "Se connecter"}
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-gray-600 text-xs">
                                Vous n'avez pas de compte ?{" "}
                                <Link
                                    href={route("register")}
                                    className="text-[#ff6c04] hover:text-[#5a217b] font-medium"
                                >
                                    S'inscrire
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
