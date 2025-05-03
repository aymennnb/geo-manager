import React from 'react';

const ConfirmSitesDelete = ({ sitesToDelete, onConfirm, onCancel }) => {
    const handleConfirm = () => {
        onConfirm();
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Confirmer la Suppression des Sites
                </h2>
                <p className="text-gray-600 mb-6">
                    Voulez-vous vraiment supprimer les sites suivants ?
                </p>
                <ul className="text-sm text-gray-700 mb-6 list-disc list-inside max-h-40 overflow-y-auto">
                    {sitesToDelete.map((site, index) => (
                        <li key={index}>{site.name ?? `Site ID: ${site.id}`}</li>
                    ))}
                </ul>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmSitesDelete;
