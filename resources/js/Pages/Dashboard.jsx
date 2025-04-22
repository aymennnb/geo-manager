import Authenticated from "@/Layouts/AuthenticatedLayout.jsx";
import { Head,usePage } from "@inertiajs/react";
// import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { APIProvider,Map,AdvancedMarker,Pin,InfoWindow, Marker } from "@vis.gl/react-google-maps";


export default function Dashboard({ auth,sitesMaps }) {
    // const { isLoaded, loadError } = useLoadScript({
    //     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    // });
    const position = { lat: 33.60344061525949,lng: -7.5352409240222435 };

    // const sitess = [
    // {
    //     id:20,
    //     name:'M-AUTOMOTIV',
    //     description: 'Succursale M-AUTOMOTIV Dacia, Ain Sbaa',
    //     latitude: '33.60349548399073',
    //     longitude: '-7.53523108999698'
    // },
    // {
    //     id:21,
    //     name:'M-AUTOMOTIV',
    //     description: 'Automotive Service Center',
    //     latitude: '33.5923445',
    //     longitude: '-7.5352409240222435'
    // }
    // ];

    // if (loadError) {
    //     return <div>Erreur de chargement de la carte</div>;
    // }
    return (
        <Authenticated user={auth.user} header={<h2>Maps</h2>}>
            <Head title="Maps" />
            <div style={{ width: "100%", height: "90vh"}}>
                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                    <Map
                        center={position}
                        zoom={10}
                        mapId={import.meta.env.VITE_MAP_ID}
                        style={{ width: "100%", height: "100%", borderRadius: "10px" }}
                    >
                        {sitesMaps.map((site) => (
                            <AdvancedMarker
                                key={site.id}
                                position={{
                                    lat: parseFloat(site.latitude),
                                    lng: parseFloat(site.longitude),
                                }}
                                title={site.name}
                            />
                        ))}
                    </Map>
                </APIProvider>
                {/* {isLoaded ? (
                    <GoogleMap
                        center={{
                            lat: 33.60344061525949,
                            lng: -7.5352409240222435,
                        }}
                        zoom={10}
                        mapContainerStyle={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "10px",
                        }}
                    />
                ) : (
                    <div>Chargement de la carte...</div>
                )} */}
            </div>
        </Authenticated>
    );
}
