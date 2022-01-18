import FormInput from "../../common/forms/FormInput";

const AddFormBooking = ({addData, setAddData}) => {
    //TODO disable validation for comments
    return (
        <div className="row my-3">
            <h3>Make a new booking</h3>
            <div className="col-12 col-md-3 mb-3 mb-md-0">
                <div className="formInputGroup">
                    <FormInput type={"date"}
                               id={"inputAddBookingFrom"}
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
                                       return {...prevState, hours: x}
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