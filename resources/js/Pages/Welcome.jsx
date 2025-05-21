import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { CgLogIn } from "react-icons/cg";
import { RiUserAddLine } from "react-icons/ri";
import {useWindowWidth} from "@/hooks/useWindowWidth.js";

export default function Welcome({ auth }) {
    const [activeTab, setActiveTab] = useState('sites');

    const width = useWindowWidth();
    const isMobile = width < 875;

    const features = [
        'Géolocalisation précise de tous les sites sur une carte avec navigation fluide.',
        'Consultation des informations complètes de chaque site',
        'Accès direct aux documents associés à chaque site.',
        'Recherche et filtrage avancés des sites'
    ];

    const advantages = [
        'Interface claire, intuitive et facile à prendre en main pour tous les profils.',
        'Gestion des accès selon les rôles (admin, utilisateur, manager) avec authentification sécurisée.',
        'Toutes les modifications sont immédiatement visibles, sans rechargement manuel.',
        'Export des données selon les besoins métiers'
    ];

    return (
        <>
            <Head title="M-AUTOMOTIV - Géolocalisation" />
            <div className="bg-gray-50 min-h-screen flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <div className={isMobile ? "text-xl font-bold text-orange-500" : "text-2xl font-bold text-orange-500"}><img  style={{
                            maxHeight: "60px",
                            maxWidth: isMobile ? "180px" : "none"  // 180px sur mobile, illimité sur PC
                        }}
                        src={`/storage/logo-m-automotiv-white.png`}
                        /></div>
                        <nav className="flex items-center gap-4">
                            {auth ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md px-4 py-2 text-white bg-[#5a217b] hover:bg-[#381454] transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md px-4 py-2 text-[#5a217b] ring-1 ring-[#5a217b] hover:text-[#5a217b] hover:bg-[#5a217b]/10 transition-colors"
                                    >
                                        {isMobile ? <CgLogIn/> : "Connexion" }
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md px-4 py-2 text-white bg-[#5a217b] hover:bg-[#381454] transition-colors"
                                    >
                                        {isMobile ? <RiUserAddLine/> : "Inscription" }
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Main */}
                <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                            Gestion des Sites et Documents {isMobile ? <br/> : null}<span className="text-[#ff6c04]">M-AUTOMOTIV</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Localisez et gérez tous les sites M-AUTOMOTIV avec leurs documents associés grâce à notre application de géolocalisation intuitive.
                        </p>
                    </motion.div>

                    {/* Tabs */}
                    <div className="flex justify-center mb-8">
                        <div className="w-full max-w-md grid grid-cols-2 rounded-md shadow-sm overflow-hidden">
                            {['sites', 'features'].map((tab, index) => (
                                <button
                                    key={tab}
                                    type="button"
                                    className={`w-full px-5 py-2 text-sm font-medium text-center transition-colors duration-200 ${
                                        activeTab === tab
                                            ? 'bg-[#5a217b] text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                    }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab === 'sites' ? 'Sites' : 'Fonctionnalités'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'sites' ? (
                        <motion.div
                            className="mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="h-64 bg-gray-200 flex items-center justify-center text-center">
                                    <div className="text-gray-500">
                                        <MapPin size={40} className="mx-auto mb-2 text-[#ff6c04]" />
                                        <p>Carte interactive des sites</p>
                                        <p className="text-sm mt-2">Connectez-vous pour accéder à la carte</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="bg-white rounded-lg shadow-md p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Fonctionnalités principales */}
                                <div>
                                    <h3 className="text-xl font-semibold text-[#5a217b] mb-4">Fonctionnalités principales</h3>
                                    <ul className="space-y-3">
                                        {features.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#5a217b]/20 flex items-center justify-center text-[#5a217b] mr-3">
                                                    <span className="text-sm font-medium">{index + 1}</span>
                                                </div>
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Avantages */}
                                <div>
                                    <h3 className="text-xl font-semibold text-[#5a217b] mb-4">Avantages</h3>
                                    <ul className="space-y-3">
                                        {advantages.map((item, index) => (
                                            <li key={index} className="flex items-start">
                                                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#ff6c04]/20 flex items-center justify-center text-[#ff6c04] mr-3">
                                                    <span className="text-sm font-medium">✓</span>
                                                </div>
                                                <span className="text-gray-700">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Call to Action */}
                            <div className="mt-8 text-center">
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center px-6 py-3 text-white bg-[#5a217b] hover:bg-[#381454] rounded-md transition-colors"
                                >
                                    Créer un compte pour commencer
                                    <ArrowRight size={16} className="ml-2" />
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                        <div>
                            <div className="text-xl font-bold text-orange-500">M-AUTOMOTIV</div>
                            <p className="text-sm text-gray-500 mt-1">Gestion et géolocalisation des sites et documents</p>
                        </div>
                        <div className="text-sm text-gray-500">
                            © 2025 M-AUTOMOTIV, Tous droits réservés.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
