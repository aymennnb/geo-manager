import React, { useEffect, useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import AddUser from "@/Pages/Utilisateurs/AddUser.jsx";
import EditUser from "@/Pages/Utilisateurs/EditUser.jsx";
import ConfirmResetPassword from "@/components/ConfirmResetPassword";


export default function IndexUsers({ auth, users }) {
    const { data, setData, post, processing, errors, delete: destroy } = useForm({
        user_id: "",
        role: "",
        name_user: "",
    });

    const [showAddForm, setShowAddForm] = useState(false);
    const [showAddFormModif, setShowAddFormModif] = useState(false); // ajouté car il était manquant

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    const [userToReset, setUserToReset] = useState(null);

    const handleEditClick = (userId) => {
        const selectedUser = users.find((user) => user.id === userId);
        setShowAddFormModif(true);
        setData({
            ...data,
            id: selectedUser.id,
            name: selectedUser.name,
            email: selectedUser.email,
            role: selectedUser.role,
        });
    };

    const openResetPasswordConfirmation = (userId, userName) => {
        setUserToReset({ id: userId, name: userName });
        setShowConfirmReset(true); // Met à jour l'état pour afficher le modal
    };

    useEffect(() => {
        if (data.user_id && data.role) {
            post(route("users.updateRole"), {
                user_id: data.user_id,
                role: data.role,
                preserveScroll: true,
            });
        }
    }, [data]);

    const handleRoleChange = (userId, newRole, userName) => {
        if (confirm(`Voulez-vous vraiment changer le rôle de ${userName} en ${newRole} ?`)) {
            setData({
                ...data,
                user_id: userId,
                role: newRole,
                name_user: userName,
            });
        }
    };

    // const askResetPassword = (userId, userName) => {
    //     setUserToReset({
    //         id: userId,
    //         name: userName,
    //     });
    //     setShowConfirmReset(true);
    // };

    const resetPassword = () => {
        post(route('users.resetPassword', userToReset.id), {
            preserveScroll: true,
        });
        setShowConfirmReset(false);  // Ferme la fenêtre de confirmation après la réinitialisation
    };

    const askResetPassword = (userId, userName) => {
        setUserToReset({ id: userId, name: userName });
        setShowConfirmReset(true); // Affiche le modal
    };

    // const confirmResetPassword = () => {
    //     if (userToReset) {
    //         post(route('users.resetPassword', userToReset.id), {
    //             preserveScroll: true,
    //             onSuccess: () => {
    //                 setShowConfirmReset(false);
    //                 setUserToReset(null);
    //             }
    //         });
    //     }
    // };

    // const resetPassword = (userId, userName) => {
    //     if (confirm(`Réinitialiser le mot de passe de ${userName} à "12345678" ?`)) {
    //         post(route('users.resetPassword', userId), {
    //             preserveScroll: true,
    //         });
    //     }
    // };

    const deleteUser = (userId, userRole,userName) => {
        setUserToDelete({ id: userId, role: userRole,name_user_to_delete:userName});
        setShowConfirmDelete(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            destroy(`/utilisateurs/delete/${userToDelete.id}`);
            setShowConfirmDelete(false);
            setUserToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowConfirmDelete(false);
        setUserToDelete(null);
    };

    return (
        <Authenticated user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Utilisateurs</h2>}>
            <Head title="Utilisateurs" />
            <div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Liste des utilisateurs
                                </h3>
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                >
                                    Ajouter un utilisateur
                                </button>
                            </div>

                            {showAddForm && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                    <div style={{ width: '60%' }} className="bg-white p-4 rounded-lg shadow-lg">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-medium text-gray-900">Ajouter un utilisateur</h3>
                                            <button
                                                onClick={() => setShowAddForm(false)}
                                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                            >
                                                Retour
                                            </button>
                                        </div>
                                        <AddUser auth={auth} setShowAddForm={setShowAddForm} />
                                    </div>
                                </div>
                            )}

                            {showConfirmReset && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg w-[450px]">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                            Confirmer la réinitialisation
                                        </h2>
                                        <p className="text-gray-600 mb-6">
                                            Voulez-vous vraiment réinitialiser le mot de passe de {userToReset?.name} à la valeur par défaut ?
                                        </p>
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                onClick={() => setShowConfirmReset(false)}
                                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                onClick={() => confirmResetPassword()}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                            >
                                                Confirmer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Div de confirmation suppression */}
                            {showConfirmDelete && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                            Confirmer la suppression
                                        </h2>
                                        <p className="text-gray-600 mb-6">
                                            Voulez-vous vraiment supprimer ce {userToDelete?.role} nommé {userToDelete?.name_user_to_delete} ?
                                        </p>
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                onClick={cancelDelete}
                                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                            >
                                                Annuler
                                            </button>
                                            <button
                                                onClick={confirmDelete}
                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Confirmer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}


                            <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                                <table className="border-collapse table-auto w-full whitespace-nowrap">
                                    <thead>
                                    <tr className="text-left bg-gray-50">
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Email Vérifié</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Création</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Mise à jour</th>
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {users && users.length > 0 ? (
                                        users.filter((user) => user.id !== auth.user.id).map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                <td className="px-6 whitespace-nowrap text-sm text-gray-500">
                                                    <select
                                                        className="border border-gray-300 rounded p-1.1"
                                                        defaultValue={user.role}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value, user.name)}
                                                    >
                                                        <option value="admin">Admin</option>
                                                        <option value="manager">Manager</option>
                                                        <option value="user">Utilisateur</option>
                                                    </select>
                                                    {errors.role && (
                                                        <div className="text-red-500 text-xs mt-1">{errors.role}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{user.email_verified_at ? "Oui" : "Non"}</td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm">
                                                    <button
                                                        type="button"
                                                        onClick={() => askResetPassword(user.id, user.name)}
                                                        className="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded bg-indigo-100"
                                                    >
                                                        Réinitialiser
                                                    </button>
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(user.created_at).toLocaleString("fr-FR")}</td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(user.updated_at).toLocaleString("fr-FR")}</td>
                                                <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Link
                                                            href={`/utilisateurs/edit/${user.id}`}
                                                            className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded bg-yellow-100"
                                                        >
                                                            Modifier
                                                        </Link>
                                                        <button
                                                            onClick={() => deleteUser(user.id, user.role,user.name)}
                                                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded bg-red-100"
                                                        >
                                                            Supprimer
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                                Aucun utilisateur trouvé.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {showConfirmReset && (
                <ConfirmResetPassword
                    userToReset={userToReset}
                    onConfirm={resetPassword}
                    onCancel={() => setShowConfirmReset(false)}
                />
            )}
        </Authenticated>
    );
}
