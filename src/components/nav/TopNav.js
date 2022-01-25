import PropTypes from 'prop-types';
import {NavLink, useNavigate} from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import {IoPersonCircle} from "react-icons/io5";
import {searchOptions} from "./searchOptions";
import naturalSort from "../../functions/naturalSort";
import FormTypeahead from "../common/forms/FormTypeahead";
import {useState} from "react";

const TopNav = ({user}) => {
    const history = useNavigate()
    const [searchState, setSearchState] = useState([]);
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
            <div className="container-fluid">
                <NavLink to={"/"} className="navbar-brand">
                    <img alt="AL tracker logo" src="./img/logo/tempLogoNav.svg" style={{height: "35px"}}/>
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to={"/"} className="nav-link rounded-3 mx-1 px-2">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to={"/bookings"} className="nav-link rounded-3 mx-1 px-2">Bookings</NavLink>
                        </li>
                        {(user?.admin || user?.superAdmin) ?
                            <li className="nav-item dropdown mx-1">
                                <div
                                    className="nav-link dropdown-toggle m-0 dropdown-icon d-flex align-items-center rounded-3"
                                    id="adminDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    <p className="m-0 px-2">Admin</p>
                                </div>
                                <ul className="dropdown-menu shadow" aria-labelledby="adminDropdown">
                                    <li><NavLink className="dropdown-item" to={"/allowances"}>Allowances</NavLink></li>
                                    <li><NavLink className="dropdown-item" to={"/locations"}>Locations</NavLink></li>
                                    <li><NavLink className="dropdown-item" to={"/payGrades"}>Pay grades</NavLink></li>
                                    <li><NavLink className="dropdown-item" to={"/periods"}>Periods</NavLink></li>
                                    <li><NavLink className="dropdown-item" to={"/requests"}>Requests</NavLink></li>
                                    <li><NavLink className="dropdown-item" to={"/staff"}>Staff</NavLink></li>
                                    <li><NavLink className="dropdown-item" to={"/users"}>Users</NavLink></li>
                                </ul>
                            </li>
                            : ""
                        }
                    </ul>
                    <form className="d-flex">
                        <FormTypeahead className="me-2"
                                       aria-label="Search"
                                       label={"Search"}
                                       labelKey={"label"}
                                       useFloatingLabel={false}
                                       selected={searchState}
                                       options={searchOptions.filter((x) => (user.admin || user.superAdmin) ? true : !x.adminOnly).sort((a, b) => {
                                           return naturalSort(a.label, b.label);
                                       })}
                                       renderMenuItemChildren={(option) => {
                                           return (
                                               <>
                                                   <h6 className="m-0 searchMenuItemLabel fw-bold">{option.label}</h6>
                                                   {option.description &&
                                                   <p className=""
                                                      style={{whiteSpace: "normal"}}>{option.description}</p>}
                                               </>
                                           );
                                       }}
                                       onChange={(e, ref) => {
                                           setSearchState(e);
                                           if (e[0]) {
                                               history(e[0]?.link || "/");
                                               ref.current.clear();
                                               setSearchState([])
                                           }
                                       }}
                                       onBlur={(e, ref) => setSearchState([])}
                        />
                    </form>
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                            <div
                                className="nav-link dropdown-toggle m-0 dropdown-icon d-flex align-items-center rounded-3 my-2 my-lg-0 ms-lg-1"
                                id="userDropdown"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false">
                                <IoPersonCircle className="smallIcon mx-2 mx-lg-0"/>
                                <NavLink className="m-0 mx-2 d-lg-none" to={"/account"}>{user.email}</NavLink>
                            </div>
                            <ul className="dropdown-menu userDropdown shadow" aria-labelledby="userDropdown">
                                <li className="d-none d-lg-block"><NavLink className="dropdown-item"
                                                                           to={`/account`}>{user.email}</NavLink></li>
                                <li className="d-none d-lg-block">
                                    <hr className="dropdown-divider"/>
                                </li>
                                <li className="d-block d-lg-none"><NavLink className="dropdown-item"
                                                                           to={"/account"}>Profile</NavLink></li>
                                <li><NavLink className="dropdown-item" to={"/logout"}>Logout</NavLink></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

TopNav.propTypes = {
    user: PropTypes.object
};

export default TopNav;
