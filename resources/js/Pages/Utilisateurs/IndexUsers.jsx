import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React from "react";

export default function IndexUsers({ auth, users }) {
    return (
        <Authenticated
            user={auth.user}
            header={<h2 className="mb-4">Liste des Utilisateurs</h2>}
        >
            <Head title="Utilisateurs" />

            <Link href="/utilisateurs/add" className="btn btn-success mb-3">
                Ajouter un utilisateur
            </Link>

            <table className="table table-bordered">
                <thead className="table-light">
                <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Rôle test</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users && users.length > 0 ? (
                    users
                        .filter((user) => user.id !== auth.user.id)
                        .map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <select name="role" className="form-control" >
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                    <option value="manager">Manager</option>
                                </select>
                            </td>
                            <td>
                                <button
                                className="btn btn-sm btn-warning me-2">
                                    Modifier
                                </button>
                                <button
                                className="btn btn-sm btn-danger">
                                    Suppprimer
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5">Aucun utilisateur trouvé.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </Authenticated>
    );
}
