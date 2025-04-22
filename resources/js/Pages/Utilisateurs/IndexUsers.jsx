import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head,Link } from "@inertiajs/react";
import React from "react";

function IndexUsers() {
  return (
    <Authenticated
            user={auth.user}
            header={<h2 className="mb-4">Les Utilisateurs</h2>}
            >
            <Head title="Utilisateurs" />
            <Link href={''} className="btn btn-success">Ajouter un Site</Link>
            <table className="table">
                <thead>
                    {/* <th>Id</th> */}
                    <th>title</th>
                    <th>description</th>
                    <th>file</th>
                    <th>type</th>
                    {/* <th>site_id</th> */}
                    <th>uploaded by</th>
                    <th>actions</th>
                </thead>
                <tbody>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tbody>
            </table>
        </Authenticated>
  )
}

export default IndexUsers