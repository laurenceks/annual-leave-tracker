import {Navigate, Route, Routes} from "react-router-dom";
import Login from "./login/Login";
import Register from "./login/Register";
import ForgotPassword from "./login/ForgotPassword";
import Verify from "./login/Verify";
import ReVerify from "./login/ReVerify";
import TextPage from "./login/policies/TextPage";
import PrivacyPolicy from "./login/policies/PrivacyPolicy";

const NotAuthorised = () => {

    return (<div className="container loginContainer">
        <div className="row justify-content-center align-content-md-center align-content-start h-100">
            <div className="col col-12 col-md-5 d-none d-md-flex align-items-center justify-content-end h-auto">
                <img src="./img/logo/logo.svg"
                     alt="Annual Leave Tracker logo"
                     className="w-100 h-100 loginLogo"
                     style={{
                         maxWidth: "200px"
                     }}
                />
            </div>
            <div className="col col-12 col-md-5 d-flex d-md-none align-items-center justify-content-center h-auto">
                <img src="./img/logo/logoWide.svg"
                     alt="Annual Leave Tracker logo"
                     className="w-100 h-100 loginLogo my-4"
                     style={{maxWidth: "300px"}}
                />
            </div>
            <div className="col col-12 col-md-7 justify-content-center">
                <div className="loginForm px-md-3">
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
                    </Routes></div>
            </div>
        </div>
    </div>);
};

export default NotAuthorised;
