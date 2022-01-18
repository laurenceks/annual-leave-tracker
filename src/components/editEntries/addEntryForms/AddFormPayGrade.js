import FormInput from "../../common/forms/FormInput";

const AddFormPayGrade = ({addData, setAddData}) => {

    return (
        <div className="row my-3">
            <h3>Add new pay grade</h3>
            <div className="col-12 col-md-4 mb-3 mb-md-0">
                <div className="formInputGroup">
                    <FormInput type={"text"}
                               id={"inputAddPayGradeName"}
                               label={"Name"}
                               invalidFeedback={"You must name the new pay grade"}
                               forceCase={"title"}
                               value={addData.name}
                               onChange={(e, x) => {
                                   setAddData(prevState => {
                                       return {...prevState, name: x}
                                   })
                               }}/>
                </div>
            </div>
            <div className="col-12 col-md-2 d-flex align-items-center">
                <button type={"submit"} className={"btn btn-success"}>Add</button>
            </div>
        </div>
    );
}

export default AddFormPayGrade;