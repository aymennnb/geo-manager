import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Partie gauche - Formulaire */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-4">
                <div className="w-full max-w-sm">
                    <Head title="Inscription" />

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            Rejoignez nous
                        </h1>
                        <p className="text-sm text-gray-600">
                            Créez un compte pour commencer votre exploration géographique et découvrir les différents sites de <br/> M-AUTOMOTIV.                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="name">
                                Nom
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"
                                autoComplete="name"
                                placeholder="Votre nom"
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-1 text-xs" />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                                Adresse e-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"
                                autoComplete="username"
                                placeholder="votremail@exemple.com"
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-1 text-xs" />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                onChange={(e) => setData("password", e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-1 text-xs" />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password_confirmation">
                                Confirmer le mot de passe
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300 transition"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                            />
                            <InputError message={errors.password_confirmation} className="mt-1 text-xs" />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-400 hover:bg-blue-500 text-white font-medium py-2 px-3 text-sm rounded-md transition duration-300 ease-in-out"
                        >
                            {processing ? "Création du compte..." : "S'inscrire"}
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-gray-600 text-xs">
                                Vous avez déjà un compte ?{" "}
                                <Link
                                    href={route("login")}
                                    className="text-blue-500 hover:text-blue-700 font-medium"
                                >
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Partie droite - Illustration (commentée comme dans la page de connexion) */}
            {/*<div className="hidden md:flex w-1/2 bg-gray-50 items-center justify-center p-8">*/}
            {/*    <div className="max-w-md">*/}
            {/*        <img*/}
            {/*            src="/megane.png"*/}
            {/*            alt="Personne en train de lire"*/}
            {/*            className="w-full h-auto"*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}
