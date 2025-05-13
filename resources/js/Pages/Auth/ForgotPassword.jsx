import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left side - Form */}
            <motion.div
                initial={{ x: '100%', opacity: 0 }}  // Commence depuis la droite
                animate={{ x: 0, opacity: 1 }}      // Arrive au centre
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    duration: 0.8
                }}
                className="w-full h-[95vh] flex items-center justify-center p-8">
                <div className="w-full max-w-sm">
                    <Head title="Forgot Password" />

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            Mot de passe oublié ?
                        </h1>
                        <p className="text-sm text-gray-600">
                            Indiquez votre adresse e-mail pour recevoir un lien de réinitialisation de mot de passe.
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
                                className="w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition" // text-base = 16px
                                autoComplete="username"
                                placeholder="votre email"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-1 text-xs" />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#5a217b] hover:bg-[#381454] text-white font-medium py-2 px-3 text-sm rounded-md transition duration-300 ease-in-out"
                        >
                            {processing ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-gray-600 text-xs">
                                Retour à{" "}
                                <Link
                                    href={route("login")}
                                    className="text-[#ff6c04] hover:text-[#5a217b] font-medium"
                                >
                                    Connexion
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
