import FormInput from "../../common/forms/FormInput";

const AddFormBooking = ({addData, setAddData}) => {

    return (
        <div className="row my-3">
            <h3>Make a new booking</h3>
            <div className="col-12 col-md-3 mb-3 mb-md-0">
                <div className="formInputGroup">
                    <FormInput type={"date"}
                               id={"inputNewBookingFrom"}
                               label={"From"}
                               invalidFeedback={"You must enter a date from"}
                               value={addData.from}
                               onChange={(e, x) => {
                                   setAddData(prevState => {
                                       return {...prevState, from: x, to:x}
                                   })
                               }}/>
                </div>
            </div>
            <div className="col-12 col-md-3 mb-3 mb-md-0">
                <div className="formInputGroup">
                    <FormInput type={"date"}
                               id={"inputNewBookingTo"}
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
                               id={"inputNewBookingHours"}
                               label={"Hours"}
                               invalidFeedback={"You must enter the number of hours this will take"}
                               value={addData.hours}
                               onChange={(e, x) => {
                                   setAddData(prevState => {
                                       return {...prevState, hours: x}
                                   })
                               }}/>
                </div>
            </div>
            <div className="col-12 col-md-3 mb-3 mb-md-0">
                <div className="formInputGroup">
                    <FormInput type={"text"}
                               id={"inputNewBookingUserComments"}
                               label={"Comments"}
                               value={addData.userComments}
                               onChange={(e, x) => {
                                   setAddData(prevState => {
                                       return {...prevState, userComments: x}
                                   })
                               }}/>
                </div>
            </div>
            <div className="col-12 col-md-1 d-flex align-items-center">
                <button type={"submit"} className={"btn btn-success"}>Add</button>
            </div>
        </div>
    );
}

export default AddFormBooking;