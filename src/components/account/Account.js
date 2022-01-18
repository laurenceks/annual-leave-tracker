import {useContext} from "react"
import {GlobalAppContext} from "../../App";
import EditAccountForm from "./accountForms/EditAccountForm";
import EditAccountEmailForm from "./accountForms/EditAccountEmailForm";
import EditAccountPasswordForm from "./accountForms/EditAccountPasswordForm";
import DeleteAccountForm from "./accountForms/DeleteAccountForm";
import {Navigate, NavLink, Route, Routes} from "react-router-dom";

const Account = () => {

    const [globalAppContext] = useContext(GlobalAppContext);

    return (
        <div className="container">
            <div className={"row align-items-center mb-3"}>
                <h1>{globalAppContext.user.firstName}'s account</h1>
                <p className="m-0">{globalAppContext.user.superAdmin ? "Super admin" : globalAppContext.user.admin ? "Admin" : "User"}</p>
            </div>
            <div className="mt-3 mb-5 row">
                <div className="col col-12">
                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <NavLink className="nav-link link-primary"
                                     aria-current="page"
                                     to="/account/profile">
                                Profile
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link link-primary"
                                     aria-current="page"
                                     to="/account/email">
                                Email
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link link-primary"
                                     aria-current="page"
                                     to="/account/password">
                                Password
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link link-danger"
                                     aria-current="page"
                                     to="/account/delete">
                                Delete
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
            <Routes>
                <Route path={"/profile"} element={<EditAccountForm/>}/>
                <Route path={"/email"} element={<EditAccountEmailForm/>}/>
                <Route path={"/password"} element={<EditAccountPasswordForm/>}/>
                <Route path={"/delete"} element={<DeleteAccountForm/>}/>
                <Route path={"*"} element={<Navigate to={"/account/profile"}/>}/>
            </Routes>
        </div>
    );
};

export default Account;
