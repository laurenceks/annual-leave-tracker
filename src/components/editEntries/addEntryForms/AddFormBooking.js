import FormInput from "../../common/forms/FormInput";
import {useEffect, useState} from "react";
import useFetch from "../../../hooks/useFetch";
import Table from "../../common/tables/Table";
import {dateToShortDate} from "../../../functions/formatMySqlTimestamp";

const AddFormBooking = ({
                            addData,
                            setAddData
                        }) => {
    //TODO disable validation for comments
    const fetchHook = useFetch();
    const [existingBookings, setExistingBookings] = useState([]);

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
                    setExistingBookings(response?.bookings || [])
                    console.log(response)
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
                               min={addData.from}
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
                <button type={"submit"} className={"btn btn-success"}>Add</button>
            </div>
        </div>
        <div className="row my-3">
            <div className="col col-12 col-md-4">
                //TODO: allowance here
            </div>
        </div>
        <div className="row my-3 justify-content-center">
            <div className="col col-12 col-md-6">
                <Table headers={["Date", "Requested", "Approved", "Total"]}
                       rows={existingBookings.map((x) => [dateToShortDate(x.date),
                           `${x.requestedHours} (${x.requestedBookings})`,
                           `${x.approvedHours} (${x.approvedBookings})`,
                           `${x.totalHours} (${x.totalBookings})`])}
                />
            </div>
        </div>
    </div>);
}

export default AddFormBooking;