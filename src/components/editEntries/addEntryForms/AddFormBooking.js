import FormInput from "../../common/forms/FormInput";
import {useContext, useEffect, useState} from "react";
import useFetch from "../../../hooks/useFetch";
import Table from "../../common/tables/Table";
import {dateToShortDate} from "../../../functions/formatMySqlTimestamp";
import {getRangeClass} from "../../dashboard/dashboardRanges";
import {GlobalAppContext} from "../../../App";

const AddFormBooking = ({
                            addData,
                            setAddData
                        }) => {
    //TODO disable validation for comments
    const fetchHook = useFetch();
    const [existingBookings, setExistingBookings] = useState([]);
    const [allowance, setAllowance] = useState(null);
    const user = useContext(GlobalAppContext)[0]?.user;

    useEffect(() => {
        if (addData.from && addData.to) {
            fetchHook({
                type: "getBookingsByDate",
                options: {
                    body: JSON.stringify({
                        dateFrom: addData.from,
                        dateTo: addData.to
                    })
                },
                dontHandleFeedback: true,
                callback: (response) => {
                    setAllowance(response?.allowance || null);
                    setExistingBookings(response?.bookings || [])
                }
            })
        } else {
            setExistingBookings([]);
        }
    }, [addData.from, addData.to]);

    return (<div className="my-3">
        <h3>Make a new booking</h3>
        <div className="row my-3">
            <div className="col-12 col-md-3 mb-3 mb-md-0">
                <div className="formInputGroup">
                    <FormInput type={"date"}
                               id={"inputAddBookingFrom"}
                               label={"From"}
                               invalidFeedback={"You must enter a date from"}
                               value={addData.from}
                               min={new Date().toISOString().split('T')[0]}
                               onChange={(e, x) => {
                                   setAddData(prevState => {
                                       return {
                                           ...prevState,
                                           from: x,
                                           to: x
                                       }
                                   })
                               }}/>
                </div>
            </div>
            <div className="col-12 col-md-3 mb-3 mb-md-0">
                <div className="formInputGroup">
                    <FormInput type={"date"}
                               id={"inputAddBookingTo"}
                               label={"To"}
                               invalidFeedback={"You must enter a date to"}
                               value={addData.from}
                               disabled={true}
                    />
                </div>
            </div>
            <div className="col-12 col-md-2 mb-3 mb-md-0">
                <div className="formInputGroup">
                    <FormInput type={"number"}
                               id={"inputAddBookingHours"}
                               label={"Hours"}
                               invalidFeedback={"Please enter the hours this will cost"}
                               value={addData.hours}
                               min={0}
                               max={(allowance?.total - allowance?.booked) || null}
                               step={0.01}
                               onChange={(e, x) => {
                                   setAddData(prevState => {
                                       return {
                                           ...prevState,
                                           hours: x
                                       }
                                   })
                               }}/>
                </div>
            </div>
            <div className="col-12 col-md-3 mb-3 mb-md-0">
                <div className="formInputGroup">
                    <FormInput type={"text"}
                               id={"inputAddBookingUserComments"}
                               label={"Comments"}
                               value={addData.userComments}
                               onChange={(e, x) => {
                                   setAddData(prevState => {
                                       return {
                                           ...prevState,
                                           userComments: x
                                       }
                                   })
                               }}/>
                </div>
            </div>
            <div className="col-12 col-md-1 d-flex align-items-center">
                <button type={"submit"} className={"btn btn-success w-100"}>Add</button>
            </div>
        </div>
        {allowance && <div className="row my-3 justify-content-center">
            <div className="col col-12 col-md-6">
                <div className={`alert m-0 alert-${getRangeClass(
                    ((allowance.remaining - addData.hours) / allowance.total) * 100,
                    "remaining") || "secondary"}`}>After this booking you will
                    have <span className="fw-bold">{Math.round(
                        (allowance.remaining - addData.hours) * 100) / 100}</span> hours
                    remaining
                </div>
            </div>
        </div>}
        {existingBookings.length > 0 && <div className="row my-3 justify-content-center">
            <div className="col col-12 col-md-6">
                <h5>Existing bookings</h5>
                {addData.from && addData.to && <h6>{user.payGradeName}/{user.locationName}, {dateToShortDate(addData.from)}-{dateToShortDate(addData.to)}</h6>}
                <Table headers={["Date", "Requested", "Approved", "Total"]}
                       rows={existingBookings.map((x) => [dateToShortDate(x.date),
                           `${x.requestedHours} (${x.requestedBookings})`,
                           `${x.approvedHours} (${x.approvedBookings})`,
                           `${x.totalHours} (${x.totalBookings})`])}
                />
            </div>
        </div>}
    </div>);
}

export default AddFormBooking;