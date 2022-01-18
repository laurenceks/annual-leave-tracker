import {useContext, useState} from 'react';
import {GlobalAppContext} from "../App";
import TopNav from "./nav/TopNav";
import {Navigate, Route, Routes} from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import Account from "./account/Account";
import AcknowledgeModal from "./Bootstrap/AcknowledgeModal";
import ToastStack from "./Bootstrap/ToastStack";
import ConfirmModal from "./Bootstrap/ConfirmModal";
import Users from "./users/Users";
import ProtectedRoute from "./common/ProtectedRoute";
import Logout from "./login/Logout";
import EditEntries from "./editEntries/EditEntries";

const Main = () => {
    const [globalAppContext] = useContext(GlobalAppContext);
    const [acknowledgeModalOptions, setAcknowledgeModalOptions] = useState({show: false});
    const [confirmModalOptions, setConfirmModalOptions] = useState({});
    const [toasts, setToasts] = useState([]);

    globalAppContext.setStateFunctions = {
        acknowledgeModal: setAcknowledgeModalOptions,
        confirmModal: setConfirmModalOptions,
        toasts: setToasts,
    };

    return (
        <div className="contentContainer w-100">
            <TopNav user={globalAppContext.user}/>
            <div className="main my-5 mx-auto px-1 px-md-0">
                <Routes>
                    <Route path="/logout" element={<Logout/>}/>
                    <Route path="/" exact element={<Dashboard/>}/>
                    <Route path="/bookings" element={<EditEntries type={"booking"}/>}/>
                    <Route path="/account/*" element={<Account/>}/>
                    <Route path="/locations" element={<ProtectedRoute element={<EditEntries type={"location"}/>}/>}/>
                    <Route path="/users" element={<ProtectedRoute element={<Users userId={globalAppContext.userId}/>}/>}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </div>
            <AcknowledgeModal {...acknowledgeModalOptions}/>
            <ToastStack toasts={toasts}/>
            <ConfirmModal {...confirmModalOptions}/>
        </div>
    );
};

Main.propTypes = {};

export default Main;
