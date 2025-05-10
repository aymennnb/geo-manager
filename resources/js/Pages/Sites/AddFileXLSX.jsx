import React from "react";
import { useForm } from "@inertiajs/react";

export default function ImportSitesXLSX({ auth, setshowAddFileForm }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Utilisation de la nouvelle route pour l'importation
        post(route("sites.import"), {
            forceFormData: true,
            onSuccess: () => {
                setshowAddFileForm(false);
                reset(); // Réinitialiser le formulaire après une importation réussie
            },
        });
    };

    return (
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                    <h3 className="text-lg font-medium mb-4">Importer un fichier Excel</h3>

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="mb-6">
                            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                                Sélectionnez un fichier Excel (.xlsx, .xls)
                            </label>
                            <input
                                id="file"
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={(e) => setData("file", e.target.files[0])}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            {errors.file && (
                                <p className="text-sm text-red-600 mt-1">{errors.file}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setshowAddFileForm(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={processing || !data.file}
                                className={`px-4 py-2 text-white rounded ${
                                    processing || !data.file ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                {processing ? "Importation..." : "Importer"}
                            </button>
                        </div>
                    </form>

                    {/* Debug dev-only */}
                    {import.meta.env.DEV && (
                        <div className="mt-6 p-4 bg-gray-100 rounded">
                            <p className="text-sm font-bold mb-2">Données du formulaire :</p>
                            <pre className="text-sm text-gray-700">{JSON.stringify(data, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
