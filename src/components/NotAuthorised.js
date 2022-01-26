import {Navigate, Route, Routes} from "react-router-dom";
import Login from "./login/Login";
import Register from "./login/Register";
import ForgotPassword from "./login/ForgotPassword";
import Verify from "./login/Verify";
import ReVerify from "./login/ReVerify";
import TextPage from "./login/policies/TextPage";
import PrivacyPolicy from "./login/policies/PrivacyPolicy";

const NotAuthorised = () => {

    return (<div className="d-flex justify-content-center align-items-md-center loginContainer">
        <div className="container">
            <div className="row justify-content-center align-items-start gx-4">
                <div className="col col-12 col-md-4" style={{maxWidth: "350px"}}>
                    <img src="./img/logo/logo.svg"
                         alt="Annual Leave Tracker logo"
                         className="w-100 h-100 loginLogo d-none d-md-inline"/>
                    <img src="./img/logo/logoWide.svg"
                         alt="Annual Leave Tracker logo"
                         className="w-100 h-100 loginLogo d-inline d-md-none mb-3"/>
                </div>
                <div className="col col-12 col-md-8 loginForm align-items-start">
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
        </div>
    </div>);
};

export default NotAuthorised;
