import React from "react";

const ChangeRoleConfirm = ({ UserToChangeRole, confirmChangeRole, cancelChangeRole }) => {

    const handleConfirm = () => {
        confirmChangeRole();
    };

    const handleCancel = () => {
        cancelChangeRole();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Confirmer le Changement du Role
                </h2>
                <p className="text-gray-600 mb-6">
                    Voulez-vous vraiment changer le rôle de {UserToChangeRole?.userName} de {UserToChangeRole?.LastRole} à {UserToChangeRole?.newRole} ?
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangeRoleConfirm;
