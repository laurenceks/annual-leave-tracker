import fetchJson from "../functions/fetchJson";
import useFeedback from "./useFeedback";
import {useContext} from "react";
import {GlobalAppContext} from "../App.js";

const fetchOptions = {
    getAllocations: {url: "./php/allocations/getAllocations.php", method: "GET"},
    addAllocation: {url: "./php/allocations/addAllocation.php", method: "POST"},
    editAllocation: {url: "./php/allocations/editAllocation.php", method: "POST"},
    deleteAllocation: {url: "./php/allocations/deleteAllocation.php", method: "POST"},
    restoreAllocation: {url: "./php/allocations/restoreAllocation.php", method: "POST"},
    getBookings: {url: "./php/bookings/getBookingsForCurrentUser.php", method: "GET"},
    addBooking: {url: "./php/bookings/addBooking.php", method: "POST"},
    editBooking: {url: "./php/bookings/editBooking.php", method: "POST"},
    deleteBooking: {url: "./php/bookings/deleteBooking.php", method: "POST"},
    restoreBooking: {url: "./php/bookings/restoreBooking.php", method: "POST"},
    getLocations: {url: "./php/locations/getAllLocations.php", method: "POST"},
    addLocation: {url: "./php/locations/addLocation.php", method: "POST"},
    editLocation: {url: "./php/locations/editLocation.php", method: "POST"},
    deleteLocation: {url: "./php/locations/deleteLocation.php", method: "POST"},
    restoreLocation: {url: "./php/locations/restoreLocation.php", method: "POST"},
    getPeriods: {url: "./php/periods/getAllPeriods.php", method: "POST"},
    addPeriod: {url: "./php/periods/addPeriod.php", method: "POST"},
    editPeriod: {url: "./php/periods/editPeriod.php", method: "POST"},
    deletePeriod: {url: "./php/periods/deletePeriod.php", method: "POST"},
    restorePeriod: {url: "./php/periods/restorePeriod.php", method: "POST"},
    getPayGrades: {url: "./php/payGrades/getAllPayGrades.php", method: "GET"},
    addPayGrade: {url: "./php/payGrades/addPayGrade.php", method: "POST"},
    editPayGrade: {url: "./php/payGrades/editPayGrade.php", method: "POST"},
    deletePayGrade: {url: "./php/payGrades/deletePayGrade.php", method: "POST"},
    restorePayGrade: {url: "./php/payGrades/restorePayGrade.php", method: "POST"},
    getUsers: {url: "./php/users/getAllUsers.php", method: "GET"},
    getUsersMin: {url: "./php/users/getAllUsersMin.php", method: "GET"},
    deleteUser: {url: "./php/users/deleteUser.php", method: "POST"},
    approveUser: {url: "./php/users/approveUser.php", method: "POST"},
    makeUserAdmin: {url: "./php/users/makeUserAdmin.php", method: "POST"},
    makeUserSuperAdmin: {url: "./php/users/makeUserSuperAdmin.php", method: "POST"},
    makeAdminUser: {url: "./php/users/makeAdminUser.php", method: "POST"},
    manuallyVerifyUser: {url: "./php/users/manuallyVerifyUser.php", method: "POST"},
    suspendUser: {url: "./php/users/suspendUser.php", method: "POST"},
    unsuspendUser: {url: "./php/users/unsuspendUser.php", method: "POST"},
    getItemsAndLocations: {url: "./php/items/getAllItemsAndLocations.php", method: "GET"},
    getRates: {url: "./php/items/getRates.php", method: "POST"},
    addTransaction: {url: "./php/items/addTransaction.php", method: "POST"},
    editAccount: {url: "./php/account/editAccount.php", method: "POST"},
    editAccountEmail: {url: "./php/account/editAccountEmail.php", method: "POST"},
    editAccountPassword: {url: "./php/account/editAccountPassword.php", method: "POST"},
    deleteAccount: {url: "./php/account/deleteAccount.php", method: "POST"},
    getDashboardData: {url: "./php/dashboard/getDashboardData.php", method: "POST"},
}

const useFetch = () => {
    let controller = new AbortController();
    const handleFeedback = useFeedback();
    const setToasts = useContext(GlobalAppContext)[0].setStateFunctions.toasts;
    let slowFetchToastId = null

    return ({
                type,
                options = {},
                callback = null,
                feedbackOptions = {},
                dontHandleFeedback = false,
                retainedSettings = {}
            }) => {
        const slowFetchTimeout = setTimeout(() => {
            slowFetchToastId = `${Date.now().toString(36)}${Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(36)}`;
            setToasts(prevState => {
                return [...prevState, {
                    title: "Still loading",
                    bodyText: "The server is taking a long time to respond - your data will load when ready or click here to cancel",
                    variant: "warning",
                    id: slowFetchToastId,
                    autoHide: false,
                    onClick: () => {
                        controller.abort();
                        controller = new AbortController();
                        setToasts(prevState => {
                            return [...prevState, {
                                title: "Request aborted",
                                bodyText: "You cancelled the request to the server - the operation was not completed",
                                variant: "danger",
                                id: `${Date.now().toString(36)}${Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(36)}`,
                            }]
                        })
                    }
                }]
            })
        }, 2000)
        fetchJson(fetchOptions[type].url, {
            signal: controller.signal,
            method: fetchOptions[type].method,
            ...options
        }, (response) => {
            clearTimeout(slowFetchTimeout);
            if (slowFetchToastId) {
                setToasts(prevState => prevState.filter(x => x.id !== slowFetchToastId));
            }
            if (callback) {
                callback({...response, retainedSettings}, handleFeedback);
                if (!dontHandleFeedback) {
                    handleFeedback({...response, customOptions: feedbackOptions})
                }
            } else if (!dontHandleFeedback) {
                handleFeedback({...response, customOptions: feedbackOptions})
            }
        }, (response) => {
            clearTimeout(slowFetchTimeout);
            if (slowFetchToastId) {
                setToasts(prevState => prevState.filter(x => x.id !== slowFetchToastId));
            }
            handleFeedback({...response, customOptions: {...feedbackOptions, breakWords: true}})
        });
    }
}

export default useFetch;