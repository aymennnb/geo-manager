import React, { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function AddSite({ auth, setShowAddForm }) {
    const { data, setData, processing, post, errors } = useForm({
        name: "",
        web: "",
        email: "",
        phone: "+212 ",
        address: "",
        latitude: "",
        longitude: "",
        image: null,
    });

    // S'assurer que le préfixe +212 est toujours présent
    const handlePhoneChange = (e) => {
        let value = e.target.value;

        // Si la valeur ne commence pas par +212, la restaurer
        if (!value.startsWith("+212")) {
            value = "+212 " + value.replace("+212 ", "");
        }

        setData("phone", value);
    };

    // Empêcher la suppression du préfixe avec le clavier
    const handlePhoneKeyDown = (e) => {
        const cursorPosition = e.target.selectionStart;

        // Empêcher la suppression du préfixe avec Backspace ou Delete
        if ((e.key === "Backspace" && cursorPosition <= 5) ||
            (e.key === "Delete" && cursorPosition < 5)) {
            e.preventDefault();
        }

        // Empêcher la sélection et le remplacement du préfixe
        if (e.target.selectionStart < 5) {
            e.target.setSelectionRange(5, 5);
        }
    };

    // S'assurer que le téléphone a toujours le préfixe à l'initialisation et après chaque modification
    useEffect(() => {
        if (!data.phone.startsWith("+212 ")) {
            setData("phone", "+212 " + data.phone.replace("+212 ", ""));
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("sites.create"),{
            onSuccess: () => {
                setShowAddForm(false);
            }
        });
    };

    return (
        <div>
            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h3 className="text-lg font-medium mb-4">Fournir les informations du site</h3>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="mb-4">
                                <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
                                    Photo pour ce site
                                </label>
                                <input
                                    id="image"
                                    type="file"
                                    className="w-full px-3 py-1 border border-gray-300 rounded-md"
                                    onChange={e => setData("image", e.target.files[0])}
                                />
                                {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
                            </div>

                            <div className="mb-6 flex gap-4">
                                <div className="w-1/2">
                                    <label htmlFor="name" className="block text-sm font-bold mb-2">Nom du site</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        placeholder="Nom du site"
                                        onChange={(e) => setData("name", e.target.value)}
                                        className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                                </div>

                                <div className="w-1/2">
                                    <label htmlFor="web" className="block text-sm font-bold mb-2">Site web</label>
                                    <input
                                        id="web"
                                        type="url"
                                        value={data.web}
                                        onChange={(e) => setData("web", e.target.value)}
                                        className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.web && <p className="text-sm text-red-600 mt-1">{errors.web}</p>}
                                </div>
                            </div>

                            <div className="mb-6 flex gap-4">
                                <div className="w-1/2">
                                    <label htmlFor="email" className="block text-sm font-bold mb-2">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                                </div>

                                <div className="w-1/2">
                                    <label htmlFor="phone" className="block text-sm font-bold mb-2">Téléphone</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={data.phone}
                                        onChange={handlePhoneChange}
                                        onKeyDown={handlePhoneKeyDown}
                                        onFocus={(e) => {
                                            // Positionner le curseur après le préfixe +212 lors du focus
                                            setTimeout(() => {
                                                if (e.target.selectionStart < 5) {
                                                    e.target.setSelectionRange(5, 5);
                                                }
                                            }, 0);
                                        }}
                                        className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="address" className="block text-sm font-bold mb-2">Adresse</label>
                                <input
                                    id="address"
                                    type="text"
                                    value={data.address}
                                    placeholder="Adresse complète"
                                    onChange={(e) => setData("address", e.target.value)}
                                    className="w-full border rounded px-3 py-1"
                                />
                                {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                            </div>

                            <div className="mb-6 flex gap-4">
                                <div className="w-1/2">
                                    <label htmlFor="latitude" className="block text-sm font-bold mb-2">Latitude</label>
                                    <input
                                        id="latitude"
                                        type="number"
                                        step="any"
                                        placeholder="Latitude (ex. 33.5731)"
                                        value={data.latitude}
                                        onChange={(e) => setData("latitude", e.target.value)}
                                        className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.latitude && <p className="text-sm text-red-600 mt-1">{errors.latitude}</p>}
                                </div>

                                <div className="w-1/2">
                                    <label htmlFor="longitude" className="block text-sm font-bold mb-2">Longitude</label>
                                    <input
                                        id="longitude"
                                        type="number"
                                        step="any"
                                        placeholder="Longitude (ex. -7.5898)"
                                        value={data.longitude}
                                        onChange={(e) => setData("longitude", e.target.value)}
                                        className="w-full border rounded px-3 py-1"
                                    />
                                    {errors.longitude && <p className="text-sm text-red-600 mt-1">{errors.longitude}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    {processing ? "Enregistrement..." : "Ajouter le site"}
                                </button>
                            </div>
                        </form>

                        {/* Affichage debug si en mode développement */}
                        {import.meta.env.DEV && (
                            <div className="mt-6 p-4 bg-gray-100 rounded">
                                <p className="text-sm font-bold mb-2">Données du formulaire :</p>
                                <pre className="text-sm text-gray-700">{JSON.stringify(data, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
