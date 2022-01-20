import fetchWithAuthCheck from "./fetchWithAuthCheck";

const fetchJson = (url, options, successHandler, errorHandler = null) => {

    fetchWithAuthCheck(url, options, "json").then(async (x) => {
        successHandler(x);
    }).catch((e) => {
        if (e.errorMessage) {
            console.error(e.errorMessage || e.feedback || "An internal server error occurred");
        }
        if (errorHandler && e.error !== 401) {
            errorHandler({...e, title: "Server error", feedback: e.feedback || "An internal server error occurred", isError: true});
        }
    });
}

export default fetchJson;