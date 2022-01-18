import React, {useContext, useRef, useState} from 'react';
import TableSection from "../common/tables/TableSection";
import useFetch from "../../hooks/useFetch";
import {GlobalAppContext} from "../../App";
import {variantPairings} from "../common/styles";
import useInitialise from "../../hooks/useInitialise";
import {maskUserData} from "../../functions/maskUserData";

const Users = () => {
    class usersTableTemplate {
        constructor() {
            this.all = {
                headers: ["Name", "Email", "Permissions", {
                    text: "Active",
                    className: "text-center"
                }, {text: "Verified", className: "text-center"}, {
                    text: "Approved",
                    className: "text-center"
                }, {text: "Suspended", className: "text-center"}], rows: []
            };
            this.active = {headers: ["Name", "Email", {colspan: 4, text: "Permissions"}], rows: []};
            this.unapproved = {headers: ["Name", {colspan: 3, text: "Email"}], rows: []};
            this.unverified = {headers: ["Name", "Email", {colspan: 2, text: ""}], rows: []}
            this.suspended = {headers: ["Name", {colspan: 3, text: "Email"}], rows: []}
        }
    }

    const defaultConfirmOptions = {
        title: "Are you sure?",
        headerClass: variantPairings.warning.header,
        show: true,
        yesButtonVariant: "warning"
    };

    const fetchHook = useFetch();
    const setModalOptions = useContext(GlobalAppContext)[0].setStateFunctions.confirmModal;
    const [usersTableData, setUsersTableData] = useState(new usersTableTemplate());
    const [isOneOfManySuperAdmins, setIsOneOfManySuperAdmins] = useState(false);
    const [globalAppContext, setGlobalAppContext] = useContext(GlobalAppContext);
    const usersLoadedOnce = useRef(false);

    const changeUserStatus = (args, type) => {
        setModalOptions(prevState => {
            return {...prevState, show: false}
        })
        fetchHook({
            type, options: {
                body: JSON.stringify({...args, userId: args.id})
            }, callback: getUsers
        })
    }

    const getUsers = () => {
        fetchHook({
            type: "getUsers",
            dontHandleFeedback: !usersLoadedOnce.current,
            callback: (x) => {
                usersLoadedOnce.current = true
                const newUsersList = new usersTableTemplate();
                setIsOneOfManySuperAdmins(x.isOneOfManySuperAdmins)
                x.users.forEach((user) => {
                        const userFullName = `${user.firstName} ${user.lastName}`
                        newUsersList.all.rows.push(
                            [
                                user.firstName + " " + user.lastName,
                                user.email,
                                (user.superAdmin ? "Super admin" : user.admin ? "Admin" : "User"),
                                {
                                    type: "tick",
                                    value: user.verified && user.approved && !user.suspended,
                                    className: "text-center"
                                },
                                {
                                    type: "tick",
                                    value: user.verified,
                                    className: "text-center"
                                },
                                {
                                    type: "tick",
                                    value: user.approved,
                                    className: "text-center"
                                },
                                {
                                    type: "tick-invert",
                                    value: user.suspended,
                                    className: "text-center"
                                }
                            ]
                        )
                        if (user.verified && user.approved && !user.suspended) {
                            newUsersList.active.rows.push(
                                [
                                    user.firstName + " " + user.lastName,
                                    user.email,
                                    (user.superAdmin ? "Super admin" : user.admin ? "Admin" : "User"),
                                    (user.superAdmin || !globalAppContext.user.superAdmin) ? {className: "buttonCell"} :
                                        {
                                            type: "button",
                                            buttonClass: `${variantPairings.primary.button} btn-sm`,
                                            text: `Make ${user.admin ? "super admin" : "admin"}`,
                                            id: user.userId,
                                            className: "text-center buttonCell",
                                            handler: () => {
                                                setModalOptions((prevState, e) => {
                                                    return {
                                                        ...prevState,
                                                        ...defaultConfirmOptions,
                                                        bodyText: user.admin ? `${userFullName} will become a super admin and cannot then be demoted by other users` : `${userFullName} will become an admin and can then only be demoted by a super admin`,
                                                        handleYes: () => changeUserStatus({
                                                            userFullName,
                                                            id: user.userId
                                                        }, user.admin ? "makeUserSuperAdmin" : "makeUserAdmin")
                                                    }
                                                })
                                            }
                                        }, ((user.admin && !user.superAdmin) && globalAppContext.user.superAdmin) ?
                                    {
                                        type: "button",
                                        buttonClass: `${variantPairings.warning.button} btn-sm`,
                                        text: `Make user`,
                                        id: user.userId,
                                        className: "text-center buttonCell",
                                        handler: () => {
                                            setModalOptions((prevState, e) => {
                                                return {
                                                    ...prevState,
                                                    ...defaultConfirmOptions,
                                                    bodyText: `${userFullName} will lose their admin rights`,
                                                    handleYes: () => changeUserStatus({
                                                        userFullName,
                                                        id: user.userId
                                                    }, "makeAdminUser")
                                                }
                                            })
                                        }
                                    } : {className: "buttonCell"},
                                    ((globalAppContext.user.admin && !user.admin) || (globalAppContext.user.superAdmin && !user.superAdmin)) ?
                                        {
                                            type: "button",
                                            buttonClass: `${variantPairings.danger.button} btn-sm`,
                                            text: `Suspend user`,
                                            id: user.userId,
                                            className: "text-center buttonCell",
                                            handler: () => {
                                                setModalOptions((prevState, e) => {
                                                    return {
                                                        ...prevState,
                                                        ...defaultConfirmOptions,
                                                        headerClass: variantPairings.danger.header,
                                                        yesButtonVariant: "danger",
                                                        bodyText: `${userFullName} will lose access to the system`,
                                                        handleYes: () => changeUserStatus({
                                                            userFullName,
                                                            id: user.userId
                                                        }, "suspendUser")
                                                    }
                                                })
                                            },
                                        } : {className: "buttonCell"}
                                ]
                            )
                        } else if (!user.verified) {
                            newUsersList.unverified.rows.push(
                                [
                                    user.firstName + " " + user.lastName,
                                    user.email,
                                    {
                                        type: "button",
                                        text: "Deny and delete",
                                        buttonClass: `${variantPairings.danger.button} btn-sm`,
                                        id: user.userId,
                                        className: "text-center buttonCell",
                                        handler: () => {
                                            setModalOptions((prevState, e) => {
                                                return {
                                                    ...prevState,
                                                    ...defaultConfirmOptions,
                                                    bodyText: `This will deny ${userFullName}'s request and delete their account`,
                                                    handleYes: () => changeUserStatus({
                                                        userFullName,
                                                        id: user.userId,
                                                        maskedFirstName: maskUserData(user.firstName),
                                                        maskedLastName: maskUserData(user.lastName),
                                                        maskedEmail: maskUserData(user.email),
                                                    }, "deleteUser")
                                                }
                                            })
                                        }
                                    },
                                    {
                                        type: "button",
                                        text: "Manually verify",
                                        buttonClass: `${variantPairings.danger.button} btn-sm`,
                                        id: user.userId,
                                        className: "text-center buttonCell",
                                        handler: () => {
                                            setModalOptions((prevState, e) => {
                                                return {
                                                    ...prevState,
                                                    ...defaultConfirmOptions,
                                                    bodyText: `${userFullName} will be verified and have access once approved`,
                                                    handleYes: () => changeUserStatus({
                                                        userFullName,
                                                        id: user.userId
                                                    }, "manuallyVerifyUser")
                                                }
                                            })
                                        }
                                    }
                                ]
                            )
                        } else if (!user.approved) {
                            newUsersList.unapproved.rows.push(
                                [
                                    user.firstName + " " + user.lastName,
                                    user.email,
                                    {
                                        type: "button",
                                        text: "Approve",
                                        buttonClass: `${variantPairings.success.button} btn-sm`,
                                        id: user.userId,
                                        className: "text-center buttonCell",
                                        handler: () => {
                                            setModalOptions((prevState, e) => {
                                                return {
                                                    ...prevState,
                                                    ...defaultConfirmOptions,
                                                    bodyText: `${userFullName} will have system access`,
                                                    handleYes: () => changeUserStatus({
                                                        userFullName,
                                                        id: user.userId
                                                    }, "approveUser")
                                                }
                                            })
                                        }
                                    }, {
                                    type: "button",
                                    text: "Deny and delete",
                                    buttonClass: `${variantPairings.danger.button} btn-sm`,
                                    id: user.userId,
                                    className: "text-center buttonCell",
                                    handler: () => {
                                        setModalOptions((prevState, e) => {
                                            return {
                                                ...prevState,
                                                ...defaultConfirmOptions,
                                                bodyText: `This will deny ${userFullName}'s request and delete their account`,
                                                handleYes: () => changeUserStatus({
                                                    userFullName,
                                                    id: user.userId,
                                                    maskedFirstName: maskUserData(user.firstName),
                                                    maskedLastName: maskUserData(user.lastName),
                                                    maskedEmail: maskUserData(user.email),
                                                }, "deleteUser")
                                            }
                                        })
                                    }
                                }
                                ]
                            )
                        } else if (user.suspended) {
                            newUsersList.suspended.rows.push(
                                [
                                    user.firstName + " " + user.lastName,
                                    user.email,
                                    {
                                        type: "button",
                                        text: "Reactivate",
                                        buttonClass: `${variantPairings.warning.button} btn-sm`,
                                        id: user.userId,
                                        className: "text-center buttonCell",
                                        handler: () => {
                                            setModalOptions((prevState, e) => {
                                                return {
                                                    ...prevState,
                                                    ...defaultConfirmOptions,
                                                    bodyText: `This will reinstate ${userFullName}'s account`,
                                                    handleYes: () => changeUserStatus({
                                                        userFullName,
                                                        id: user.userId
                                                    }, "unsuspendUser")
                                                }
                                            })
                                        }
                                    },
                                    ((globalAppContext.user.admin && !user.admin) || (globalAppContext.user.superAdmin && !user.superAdmin)) ?
                                        {
                                            type: "button",
                                            buttonClass: `${variantPairings.danger.button} btn-sm`,
                                            text: `Delete user`,
                                            id: user.userId,
                                            className: "text-center buttonCell",
                                            handler: () => {
                                                setModalOptions((prevState, e) => {
                                                    return {
                                                        ...prevState,
                                                        ...defaultConfirmOptions,
                                                        bodyText: `This will delete ${userFullName}'s account and they will have to re-register to regain access to the system`,
                                                        handleYes: () => changeUserStatus({
                                                            userFullName,
                                                            maskedFirstName: maskUserData(user.firstName),
                                                            maskedLastName: maskUserData(user.lastName),
                                                            maskedEmail: maskUserData(user.email),
                                                            id: user.userId
                                                        }, "deleteUser")
                                                    }
                                                })
                                            }
                                        } : {className: "buttonCell"}
                                ]
                            )
                        }
                    }
                )
                setUsersTableData(newUsersList);
            }
        });
    }

    useInitialise(() => {
        //get user list
        getUsers();
    });

    return (
        <div>
            <h1 className="mb-5">Restocker users for {globalAppContext.user.organisation}</h1>
            <TableSection title={"All users"} tableProps={usersTableData.all}/>
            <TableSection title={"Active users"} tableProps={usersTableData.active}/>
            <TableSection title={"Unapproved users"} tableProps={usersTableData.unapproved}/>
            <TableSection title={"Unverified users"} tableProps={usersTableData.unverified}/>
            <TableSection title={"Suspended users"} tableProps={usersTableData.suspended}/>
            {isOneOfManySuperAdmins && <div>
                <h1>Renounce super admin rights</h1>
                <p>Click below to renounce your super admin rights. You will no longer be able to promote admins to
                    super admin privileges unless you are re-promoted by another super admin. There must be at least
                    one
                    super admin for your organisation - see below for a list of super admins for your
                    organisation.</p>
                <button className="btn btn-danger" onClick={(e) => {
                    setModalOptions((prevState, e) => {
                        return {
                            ...prevState,
                            ...defaultConfirmOptions,
                            bodyText: "You will lose your super admin privileges and can only regain them on promotion by a super admin",
                            handleYes: () => {
                                setGlobalAppContext({
                                    ...globalAppContext,
                                    user: {...globalAppContext.user, superAdmin: 0}
                                });
                                changeUserStatus({
                                    userFullName: `${globalAppContext.user.firstName} ${globalAppContext.user.lastName}`,
                                    id: globalAppContext.user.userId
                                }, "makeUserAdmin")
                            }
                        }
                    })
                }
                }>Renounce super admin
                </button>
            </div>}
        </div>
    );
};

export default Users;
