import {useContext} from 'react';
import {GlobalAppContext} from "../../App";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({element}) => {
    const globalContext = useContext(GlobalAppContext)[0];
    return (globalContext.isLoggedIn && globalContext.loginCheckedOnce && (globalContext.user.admin || globalContext.user.superAdmin) ?
            element
            :
            <Navigate to={"/"}/>
    )
};

export default ProtectedRoute;
