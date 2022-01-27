import {Navigate, Route, Routes} from "react-router-dom";
import Login from "./login/Login";
import Register from "./login/Register";
import ForgotPassword from "./login/ForgotPassword";
import Verify from "./login/Verify";
import ReVerify from "./login/ReVerify";
import TextPage from "./login/policies/TextPage";
import PrivacyPolicy from "./login/policies/PrivacyPolicy";

const NotAuthorised = () => {

    return (<div className="container min-vh-100">
        <div className="row justify-content-center align-content-md-center align-content-start h-100">
            <div className="col col-12 col-md-4 my-3 m-md-0 d-flex align-items-center justify-content-center">
                <img src="./img/logo/logo.svg"
                     alt="Annual Leave Tracker logo"
                     className="w-100 h-100 loginLogo d-none d-md-inline"
                     style={{maxWidth: "200px"}}
                />
                <img src="./img/logo/logoWide.svg"
                     alt="Annual Leave Tracker logo"
                     className="w-100 h-100 loginLogo d-inline d-md-none mb-3"
                     style={{maxWidth: "300px"}}
                />
            </div>
            <div className="col col-12 col-md-8 loginForm">
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
        </div>
    </div>);
};

export default NotAuthorised;
