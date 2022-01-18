import {useContext} from "react";
import {GlobalAppContext} from "../../App";

const Logout = () => {
    const setGlobalAppContext = useContext(GlobalAppContext)[1];

    fetch("./php/login/logout.php", {
        method: "GET",
    }).then((x) => {
        setGlobalAppContext({loginCheckedOnce: true, isLoggedIn: false});
    });
    return null;
};


export default Logout;