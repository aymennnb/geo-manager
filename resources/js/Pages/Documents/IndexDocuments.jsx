import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head,Link } from "@inertiajs/react";
import React from "react";

function IndexDocuments({ auth }) {
    return (
        <Authenticated user={auth.user} header={<h2>Documents</h2>}>
            <Head title="documents" />
            <Link href={'documents/add'} className="btn btn-success">Ajouter un Site</Link>
            <table className="table">
                <thead>
                    {/* <th>Id</th> */}
                    {/* <th>site_id</th> */}
                    <th>title</th>
                    <th>description</th>
                    <th>file path</th>
                    <th>file type</th>
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
    );
}

export default IndexDocuments;
