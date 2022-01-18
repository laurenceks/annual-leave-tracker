import FormInput from "../../common/forms/FormInput";

const AddFormPeriod = ({addData, setAddData}) => {

    return (
        <div className="row my-3">
            <h3>Add new period</h3>
            <div className="col-12 col-md-4 mb-3 mb-md-0">
                <div className="formInputGroup">
                    <FormInput type={"text"}
                               id={"inputAddPeriodName"}
                               label={"Name"}
                               invalidFeedback={"You must name the period"}
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
                    <FormInput type={"date"}
                               id={"inputAddPeriodFrom"}
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
                               id={"inputAddPeriodTo"}
                               label={"To"}
                               min={addData.from}
                               invalidFeedback={"You must enter a date to"}
                               value={addData.from}
                    />
                </div>
            </div>
            <div className="col-12 col-md-1 d-flex align-items-center">
                <button type={"submit"} className={"btn btn-success"}>Add</button>
            </div>
        </div>
    );
}

export default AddFormPeriod;