import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from "react";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Main content */}
            <div className="w-full md:w-2/2 h-[95vh] flex items-center justify-center p-8">
                <div className="w-full max-w-sm">
                    <Head title="Email Verification" />

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            Vérification de votre email
                        </h1>
                        <p className="text-sm text-gray-600">
                            Merci de vérifier votre adresse avant de continuer sur <br/> <span className="text-orange-500">M-AUTOMOTIV</span>.
                        </p>
                    </div>

                    <div className="mb-4 text-sm text-gray-600">
                        Merci de vous être inscrit ! Avant de commencer, pourriez-vous vérifier
                        votre adresse email en cliquant sur le lien que nous venons de vous envoyer ?
                        Si vous n'avez pas reçu l'email, nous vous en enverrons volontiers un autre.
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-sm font-medium text-green-600">
                            Un nouveau lien de vérification a été envoyé à l'adresse email
                            que vous avez fournie lors de l'inscription.
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#5a217b] hover:bg-[#381454] text-white font-medium py-2 px-3 text-sm rounded-md transition duration-300 ease-in-out"
                        >
                            {processing ? "Envoi en cours..." : "Renvoyer l'email de vérification"}
                        </button>

                        <div className="mt-4 flex items-center justify-center">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-xs text-[#ff6c04] hover:text-[#5a217b] font-medium"
                            >
                                Se déconnecter
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
