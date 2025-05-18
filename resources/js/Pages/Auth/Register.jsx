import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useWindowWidth } from "@/hooks/useWindowWidth.js";
import { motion } from "framer-motion"; // Import de framer-motion

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const width = useWindowWidth();
    const isMobile = width < 768;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className={`min-h-screen flex flex-col md:flex-row relative`}
             style={isMobile ? {
                 backgroundImage: "url('/storage/megane.webp')",
                 backgroundSize: "cover",
                 backgroundPosition: "center",
                 backgroundAttachment: "fixed"
             } : {}}>
            {/* Partie gauche - Formulaire avec animation */}
            <motion.div
                className="w-full md:w-1/2 h-[95vh] flex items-center justify-center p-8"
                initial={{ x: '-100%', opacity: 0 }}  // Commence depuis la gauche
                animate={{ x: 0, opacity: 1 }}       // Arrive au centre
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    duration: 0.8
                }}
            >
                <div className="w-full max-w-sm">
                    <Head title="Inscription" />

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            Rejoignez nous
                        </h1>
                        <p className="text-sm text-gray-600">
                            {isMobile ? <span className="text-white">Créez un compte pour commencer votre exploration géographique et découvrir les différents sites de</span> : <span>Créez un compte pour commencer votre exploration géographique et découvrir les différents sites de</span>} <br/> <span className="text-orange-500">M-AUTOMOTIV</span>.</p>
                    </div>

                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label className="block text-white text-sm font-medium mb-1" htmlFor="name">
                                Nom
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className={isMobile
                                    ? "w-full opacity-80 px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"
                                    : "w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"}
                                autoComplete="name"
                                placeholder="Votre nom"
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-1 text-xs" />
                        </div>

                        <div className="mb-4">
                            <label className="block text-white text-sm font-medium mb-1" htmlFor="email">
                                Adresse e-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={isMobile
                                    ? "w-full opacity-80 px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"
                                    : "w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"}                                autoComplete="username"
                                placeholder="votre email"
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-1 text-xs" />
                        </div>

                        <div className="mb-4 relative">
                            <label htmlFor="password" className="block text-white text-sm font-medium mb-1">Mot de passe</label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className={isMobile
                                    ? "w-full opacity-80 px-3 py-2 pr-10 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"
                                    : "w-full px-3 py-2 pr-10 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"}
                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                            <span
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-9 cursor-pointer text-gray-500"
                            >
                    {showPassword ? <HiEyeOff /> : <HiEye />}
                </span>
                            <InputError message={errors.password} className="mt-1 text-xs" />
                        </div>

                        {/* Confirmation mot de passe */}
                        <div className="mb-4 relative">
                            <label htmlFor="password_confirmation" className="block text-white text-sm font-medium mb-1">Confirmer le mot de passe</label>
                            <input
                                id="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                className={isMobile
                                    ? "w-full opacity-80 px-3 py-2 pr-10 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"
                                    : "w-full px-3 py-2 pr-10 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"}                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                            <span
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute right-3 top-9 cursor-pointer text-gray-500"
                            >
                    {showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                </span>
                            <InputError message={errors.password_confirmation} className="mt-1 text-xs" />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#5a217b] hover:bg-[#381454] text-white font-medium py-2 px-3 text-sm rounded-md transition duration-300 ease-in-out"
                        >
                            {processing ? "Création du compte..." : "S'inscrire"}
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-gray-600 text-xs">
                                {isMobile ? <span className="text-white">Vous avez déjà un compte ?</span> : <span>Vous avez déjà un compte ?</span>}{" "}
                                <Link
                                    href={route("login")}
                                    className="text-[#ff6c04] hover:text-blue-700 font-medium"
                                >
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>

            {/* Partie droite - Illustration (avec style amélioré) */}
            {!isMobile &&
                <motion.div
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 10,
                        duration: 0.8
                    }}
                    className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full relative">
                        <img
                            src={`/storage/megane.webp`}
                            alt="Personne en train de lire"
                            className="w-full h-full object-cover object-center"
                            style={{ maxHeight: "100vh" }}
                        />
                        {/* Overlay optionnel pour améliorer la lisibilité du texte sur l'image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-50"></div>

                        {/* Logo ou texte sur l'image (optionnel) */}
                        <div className="absolute bottom-10 left-10 text-white">
                            <h2 className="text-2xl font-bold text-orange-500">M-AUTOMOTIV</h2>
                            <p className="text-sm text-orange-500">Découvrez nos sites</p>
                        </div>
                    </div>
                </motion.div>
            }
        </div>
    );
}
