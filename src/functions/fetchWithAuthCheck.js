const fetchWithAuthCheck = (url, options, responseType = "json") => {
    const logoutDueToResponse = () => {
        // window.location = `${(window.location.hostname.startsWith("localhost") || window.location.hostname.startsWith("127") || window.location.hostname.startsWith("192")) && "/#"}/logout`;
        window.location.replace("#/logout");
    }
    return fetch(url, options).then(async response => {
        if (response.status === 401) {
            logoutDueToResponse();
            return;
        }
        if (response.ok) {
            const responseText = await response.text();
            try {
                const responseJson = JSON.parse(responseText)
                if (!responseJson.failedLoginCheck) {
                    return responseType === "json" ? responseJson : responseType === "text" ? responseText : response
                } else {
                    logoutDueToResponse();
                    return Promise.reject({error:401, errorMessage: `401 - permission denied (${responseJson.errorMessage || responseJson.text || responseJson.feedback})`});
                }
            } catch (e) {
                return Promise.reject({error: e, errorMessage: responseText});
            }
        } else {
            return Promise.reject(new Error(await response.text()));
        }
    })
}

export default fetchWithAuthCheck;