import {Navigate, Route, Routes} from "react-router-dom";
import Login from "./login/Login";
import Register from "./login/Register";
import ForgotPassword from "./login/ForgotPassword";
import Verify from "./login/Verify";
import ReVerify from "./login/ReVerify";
import TextPage from "./login/policies/TextPage";
import PrivacyPolicy from "./login/policies/PrivacyPolicy";

const NotAuthorised = () => {

    return (
        <div className="loginForm align-middle">
            <img src="./img/logo/tempLogo.svg" alt="Annual Leave Tracker logo" className="w-100 p-3 mb-4"/>
            <Routes>
                <Route path="/verify" element={<Verify/>}/>
                <Route path="/reVerify" element={<ReVerify/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/forgotPassword" element={<ForgotPassword/>}/>
                <Route path="/resetPassword" element={<Verify type={"password"}/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/privacy"
                       element={<TextPage>
                           <PrivacyPolicy
                               appName={"Annual Leave Tracker"}
                               url={window.location.pathName}
                               websiteName={"Annual Leave Tracker"}
                               email={"help@annual-leave-tracker.com"}
                           />
                       </TextPage>}/>
                <Route path="*" element={<Navigate to="/login"/>}/>
            </Routes>
        </div>
    );
};

export default NotAuthorised;
