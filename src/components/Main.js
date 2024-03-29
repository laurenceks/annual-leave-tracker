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
import Hours from "./hours/Hours";

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

    return (<div className="contentContainer w-100">
        <TopNav user={globalAppContext.user}/>
        <div className="main my-5 mx-auto px-1 px-md-0">
            <Routes>
                <Route path="/logout" element={<Logout/>}/>
                <Route path="/" exact element={<Dashboard/>}/>
                <Route path="/bookings" element={<EditEntries type={"booking"} title={"bookings"}/>}/>
                <Route path="/account/*" element={<Account/>}/>
                <Route path="/locations"
                       element={<ProtectedRoute element={<EditEntries type={"location"} title={"locations"}/>}/>}/>
                <Route path="/hours" element={<ProtectedRoute element={<Hours/>}/>}/>
                <Route path="/payGrades"
                       element={<ProtectedRoute element={<EditEntries type={"payGrade"} title={"pay grades"}/>}/>}/>
                <Route path="/periods"
                       element={<ProtectedRoute element={<EditEntries type={"period"} title={"periods"}/>}/>}/>
                <Route path="/allowances"
                       element={<ProtectedRoute element={<EditEntries type={"allowance"}
                                                                      title={"allowances"}
                                                                      includeDeleted={false}/>}/>}/>
                <Route path="/requests"
                       element={<ProtectedRoute element={<EditEntries type={"request"}
                                                                      title={"requests"}
                                                                      includeDeleted={false}
                                                                      resultsKey="bookings"
                                                                      splitOn="status"
                                                                      splitKeys={["requested", "approved", "denied"]}
                                                                      sortIndex={2}/>}/>}/>
                <Route path="/staff"
                       element={<ProtectedRoute element={<EditEntries type={"staff"}
                                                                      title={"staff"}
                                                                      includeDeleted={false}
                                                                      resultsKey="staff"
                                                                      splitOn="status"/>}/>}/>
                <Route path="/users" element={<ProtectedRoute element={<Users userId={globalAppContext.userId}/>}/>}/>
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
        </div>
        <AcknowledgeModal {...acknowledgeModalOptions}/>
        <ToastStack toasts={toasts}/>
        <ConfirmModal {...confirmModalOptions}/>
    </div>);
};

Main.propTypes = {};

export default Main;
