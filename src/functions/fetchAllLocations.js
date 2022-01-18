import fetchJson from "./fetchJson";

const fetchAllLocations = (callback) => {
    fetchJson("./php/locations/getAllLocations.php", {
        method: "GET"
    }, callback);
}

export default fetchAllLocations;