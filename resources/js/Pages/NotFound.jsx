import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import '../../css/NotFound.css'
import {Head} from "@inertiajs/react";

export default function NotFound({auth}) {
    return (
        <Authenticated user={auth.user} header={<h2>Oups !! Page introuvable</h2>}>
            <Head title="404 - Not Found"/>
        <div className="notfound-container">
            <h1 className="notfound-title">404</h1>
            <p className="notfound-message">Oups ! La page que vous recherchez n'existe pas.</p>
        </div>
        </Authenticated>
    );
}
