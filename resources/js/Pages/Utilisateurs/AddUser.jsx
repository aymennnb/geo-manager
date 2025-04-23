import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React from "react";

export default function AddUser({ auth }) {
    return (
        <Authenticated
            user={auth.user}
            header={<h2 className="mb-4">Ajouter un Utilisateur</h2>}
        >
            <Head title="add User" />
            <p>Ajouter un Utilisateur</p>
        </Authenticated>
    );
}
