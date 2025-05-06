import React, { useEffect, useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import AddUser from "@/Pages/Utilisateurs/AddUser.jsx";
import EditUser from "@/Pages/Utilisateurs/EditUser.jsx";

// Les Messages de Confirmation
import ConfirmResetPassword from "@/components/ConfirmResetPassword";
import ConfirmSupprimeUser from "@/components/ConfirmSupprimeUser";
import ChangeRoleConfirm from "@/components/ChangeRoleConfirm";
import ConfirmSuppUsers from "@/Components/ConfirmSuppUsers";
import ConfirmChangeGroupRole from "@/Components/ConfirmChangeGroupRole";
import ModalWrapper from "@/Components/ModalWrapper";
import toast from 'react-hot-toast';
import {FaBackward} from "react-icons/fa6";
import {TbPlayerTrackNextFilled} from "react-icons/tb";


export default function IndexUsers({ auth, users, flash }) {
    const { data, setData, post, processing, errors, delete: destroy } = useForm({
        users_ids:[],
        user_id: "",
        role: "",
        name_user: "",
        role_group:"",
        searchTerm:"",
        start_date: "", // Ajout du champ pour la date de début
        end_date: ""    // Ajout du champ pour la date de fin
    });

    const [showAddForm, setShowAddForm] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    const [userToReset, setUserToReset] = useState(null);
    const [showConfirmChangeRole, setShowConfirmChangeRole] = useState(false);
    const [userToChangeRole, setUserToChangeRole] = useState(null);
    const [confirmedChange, setConfirmedChange] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);

    const [UsersToDelete,setUsersToDelete] = useState([]);
    const [showConfirmGroupModal, setShowConfirmGroupModal] = useState(false);

    const [selectedRole, setSelectedRole] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [usersToChange, setUsersToChange] = useState([]);

    // Ajout pour la pagination
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredUsers, setFilteredUsers] = useState([]);

    // Filtrer les utilisateurs en fonction des critères de recherche et dates
    useEffect(() => {
        if (!users) return;

        let filtered = users.filter(user =>
            user.id !== auth.user.id && // Exclure l'utilisateur actuel
            user.name && user.name.toLowerCase().includes(data.searchTerm.toLowerCase())
        );

        // Filtrage par date de création
        if (data.start_date) {
            const startDate = new Date(data.start_date);
            filtered = filtered.filter(user => new Date(user.created_at) >= startDate);
        }

        if (data.end_date) {
            const endDate = new Date(data.end_date);
            // Ajuster la fin de la journée pour inclure toute la journée
            endDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(user => new Date(user.created_at) <= endDate);
        }

        setFilteredUsers(filtered);
        setCurrentPage(1); // Réinitialiser à la première page lors d'une nouvelle recherche
    }, [data.searchTerm, data.start_date, data.end_date, users, auth.user.id]);

    // Initialiser filteredUsers avec users au chargement (en excluant l'utilisateur actuel)
    useEffect(() => {
        if (users) {
            setFilteredUsers(users.filter(user => user.id !== auth.user.id));
        }
    }, [users, auth.user.id]);

    // Fonction pour obtenir les éléments de la page courante
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredUsers.slice(startIndex, endIndex);
    };

    // Fonction pour gérer le changement de page
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredUsers.length / itemsPerPage)) {
            setCurrentPage(pageNumber);
        }
    };

    // Gestionnaire pour le champ de recherche et les filtres de date
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    // Options pour le nombre d'éléments par page
    const usersPerPageOptions = [5, 10, 20, 25, 50, 100, 150,200,300,400,600,1000];
    const totalUsers = filteredUsers.length;
    const availableOptions = usersPerPageOptions.filter(option => option <= totalUsers || option === usersPerPageOptions[0]);

    const openEditUser = (user) => {
        setUserToEdit(user);
        setShowEditForm(true);
    };

    const handleRoleChange = (userId, userName, currentRole, newRole) => {
        setUserToChangeRole({
            id: userId,
            userName: userName,
            LastRole: currentRole,
            newRole: newRole,
        });
        setShowConfirmChangeRole(true);
    };

    const confirmChangeRole = () => {
        if (userToChangeRole) {
            setData({
                ...data,
                user_id: userToChangeRole.id,
                role: userToChangeRole.newRole,
            });
            setConfirmedChange(true);
        }
    };

    useEffect(() => {
        if (confirmedChange && data.user_id && data.role) {
            post(route("users.updateRole"), {
                onSuccess: () => {
                    setShowConfirmChangeRole(false);
                    setUserToChangeRole(null);
                    setConfirmedChange(false);
                    setData(prevData => ({
                        ...prevData,
                        user_id: "",
                        role: "",
                    }));
                },
            });
        }
    }, [confirmedChange, data.user_id, data.role]);

    const cancelChangeRole = () => {
        setShowConfirmChangeRole(false);
        setUserToChangeRole(null);
    };

    const handleSelectUser = (documentId) => {
        if (data.users_ids.includes(documentId)) {
            setData("users_ids", data.users_ids.filter((id) => id !== documentId));
        } else {
            setData("users_ids", [...data.users_ids, documentId]);
        }
    };

    const openResetPasswordConfirmation = (userId, userName) => {
        setUserToReset({ id: userId, name: userName });
        setShowConfirmReset(true); // Met à jour l'état pour afficher le modal
    };

    const handleUsersDelete = () => {
        const selectedusers = users
            .filter((user) => data.users_ids.includes(user.id))
            .map((user) => ({ id: user.id, name: user.name }));

        setUsersToDelete(selectedusers);
        setShowConfirmGroupModal(true);
    };

    const confirmUsersGroupDelete = () => {
        post(route("utilisateurs.UsersDelete"), {
            onSuccess: () => {
                setData("users_ids", []);
                setShowConfirmGroupModal(false);
            },
        });
    };

    const cancelGroupDelete = () => {
        setShowConfirmGroupModal(false);
    };


    const resetPassword = () => {
        post(route('users.resetPassword', userToReset.id), {
            preserveScroll: true,
        });
        setShowConfirmReset(false);
    };

    const askResetPassword = (userId, userName) => {
        setUserToReset({ id: userId, name: userName });
        setShowConfirmReset(true);
    };

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

    const handleUsersRoleChange = (e) => {
        const role = e.target.value;
        if (!role) {
            toast.error('Veuillez choisir un rôle avant de continuer.');
            return;
        }
        setData('role_group',role);
        const selectedUsers = users.filter((u) => data.users_ids.includes(u.id));
        setUsersToChange(selectedUsers);
        setShowConfirmModal(true);
    };

    const confirmRoleChange = () => {
        post(route('utilisateurs.changeGroupRole'), {
            onSuccess: () => {
                setData(prevData => ({
                    ...prevData,
                    users_ids: []
                }));
                setShowConfirmModal(false);
            },
            onError: () => {
                toast.error("Une erreur est survenue lors de la modification du rôle.");
            }
        });
    };

    useEffect(() => {
        if (flash.message.success) {
            toast.success(flash.message.success);
        }
        if (flash.message.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);


    return (
        <Authenticated user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Utilisateurs</h2>}>
            <Head title="Utilisateurs" />
            <div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="mr-1 text-lg font-medium text-gray-900">
                                    Liste des utilisateurs
                                </h3>
                                <div className="flex space-x-3">
                                    {data.users_ids.length > 0 && (
                                        <>
                                            <button
                                                onClick={handleUsersDelete}
                                                disabled={data.users_ids.length === 0}
                                                className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:text-red-900 transition"
                                            >
                                                Supprimer
                                            </button>
                                            <select
                                                style={{ height: "36px" }}
                                                className="border w-48 border-gray-300 rounded-[7px] py-1"
                                                onChange={handleUsersRoleChange}
                                            >
                                                <option value="">-- choisir un role --</option>
                                                <option value="admin">Admin</option>
                                                <option value="manager">Manager</option>
                                                <option value="user">Utilisateur</option>
                                            </select>
                                        </>
                                    )}
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                                    >
                                        Ajouter un utilisateur
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-end gap-4 mb-7">
                                <div className="relative flex-1">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        style={{height:'33px'}}
                                        type="text"
                                        name="searchTerm"
                                        value={data.searchTerm}
                                        onChange={handleFilterChange}
                                        className="block w-full pl-10 pr-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Rechercher par nom..."
                                    />
                                </div>

                                {/* Champ pour la date de début */}
                                <div className="flex flex-col w-40">
                                    <label htmlFor="start_date" className="text-xs font-medium text-gray-700 mb-1">Date de début:</label>
                                    <input
                                        type="date"
                                        className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        id="start_date"
                                        name="start_date"
                                        value={data.start_date}
                                        onChange={handleFilterChange}
                                    />
                                </div>

                                {/* Champ pour la date de fin */}
                                <div className="flex flex-col w-40">
                                    <label htmlFor="end_date" className="text-xs font-medium text-gray-700 mb-1">Date de fin:</label>
                                    <input
                                        type="date"
                                        className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        id="end_date"
                                        name="end_date"
                                        value={data.end_date}
                                        onChange={handleFilterChange}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-xs font-medium text-gray-700 mb-1">Par page:</label>
                                    <select
                                        id="itemsPerPage"
                                        className="w-24 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1); // Réinitialiser à la première page lors du changement d'items par page
                                        }}
                                    >
                                        {availableOptions.map(option => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto">
                                <table className="border-collapse table-auto w-full whitespace-nowrap">
                                    <thead>
                                    <tr className="text-left bg-gray-50">
                                        <th className="px-6 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
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
                                    {getCurrentPageItems().length > 0 ? (
                                        getCurrentPageItems().map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.users_ids.includes(user.id)}
                                                        onChange={() => handleSelectUser(user.id)}
                                                    />
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                                <td className="px-6 whitespace-nowrap text-sm text-gray-500">
                                                    <select
                                                        className="border border-gray-300 rounded-[7px] p-1.1"
                                                        defaultValue={user.role}
                                                        onChange={(e) => handleRoleChange(
                                                            user.id,
                                                            user.name,
                                                            user.role,
                                                            e.target.value
                                                        )}
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
                                                        <button
                                                            onClick={() => openEditUser(user)}
                                                            className="text-yellow-600 hover:text-yellow-900 px-2 py-1 rounded bg-yellow-100"
                                                        >
                                                            Modifier
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUser(user.id, user.role, user.name)}
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
                                            <td colSpan="9" className="px-6 py-4 text-center text-sm text-gray-500">
                                                Aucun utilisateur trouvé.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            {filteredUsers.length > 0 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex justify-end text-sm text-gray-500">
                                        {filteredUsers.length} utilisateur(s) trouvé(s)
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1 rounded-md ${
                                                currentPage === 1
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                        >
                                            <FaBackward/>
                                        </button>
                                        <span className="px-3 py-1 bg-gray-100 rounded-md">
                                            Page {currentPage} sur {Math.ceil(filteredUsers.length / itemsPerPage)}
                                        </span>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage >= Math.ceil(filteredUsers.length / itemsPerPage)}
                                            className={`px-3 py-1 rounded-md ${
                                                currentPage >= Math.ceil(filteredUsers.length / itemsPerPage)
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                        >
                                            <TbPlayerTrackNextFilled/>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {import.meta.env.DEV && (
                        <div className="mt-4 p-2 bg-gray-100 rounded">
                            <p>IDs des utilisateurs sélectionnés :</p>
                            <pre>{JSON.stringify(data, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
            {showEditForm && userToEdit && (
                <ModalWrapper title="Editer un utilisateur" onClose={() => setShowEditForm(false)}>
                    <EditUser auth={auth} user={userToEdit} setShowEditForm={setShowEditForm} showEditForm={showEditForm}/>
                </ModalWrapper>
            )}
            {showAddForm && (
                <ModalWrapper
                    title="Ajouter un nouveau utilisateur"
                    onClose={() => setShowAddForm(false)}
                >
                    <AddUser auth={auth} setShowAddForm={setShowAddForm} />
                </ModalWrapper>
            )}
            {showConfirmChangeRole && (
                <ChangeRoleConfirm
                    UserToChangeRole={userToChangeRole}
                    confirmChangeRole={confirmChangeRole}
                    cancelChangeRole={cancelChangeRole}
                />
            )}
            {/* Div de confirmation du réinitialisation du mot de passe */}
            {showConfirmReset && (
                <ConfirmResetPassword
                    userToReset={userToReset}
                    onConfirm={resetPassword}
                    onCancel={() => setShowConfirmReset(false)}
                />
            )}
            {/* Div de confirmation suppression */}
            {showConfirmDelete && (
                <ConfirmSupprimeUser
                    userToDelete={userToDelete}
                    confirmDelete={confirmDelete}
                    cancelDelete={cancelDelete}
                />
            )}
            {showConfirmGroupModal && (
                <ConfirmSuppUsers
                    UsersToDelete={UsersToDelete}
                    onConfirm={confirmUsersGroupDelete}
                    onCancel={cancelGroupDelete}
                />
            )}
            {showConfirmModal && (
                <ConfirmChangeGroupRole
                    usersToChange={usersToChange}
                    newRole={data.role_group}
                    onConfirm={confirmRoleChange}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}
        </Authenticated>
    );
}
