import FormPeriod from "../../common/forms/FormPeriod";
import FormUser from "../../common/forms/FormUser";
import FormInput from "../../common/forms/FormInput";

const AddFormLocation = ({
                             addData,
                             setAddData
                         }) => {

    return (<div className="row my-3">
        <h3>Add new location</h3>
        <div className="col-12 col-md-4 mb-3 mb-md-0">
            <div className="formInputGroup">
                <FormUser id={"inputAddAllocationUser"}
                          label={"User"}
                          invalidFeedback={"You must select a user"}
                          selected={addData.user}
                          onChange={(e) => {
                              setAddData(prevState => {
                                  return {
                                      ...prevState,
                                      user: e,
                                      userId: e[0]?.id || null,
                                      userFullName: e[0]?.name || null
                                  }
                              })
                          }}/>
            </div>
        </div>
        <div className="col-12 col-md-4 mb-3 mb-md-0">
            <div className="formInputGroup">
                <FormPeriod id={"inputAddAllocationPeriod"}
                            label={"Period"}
                            invalidFeedback={"You must select a period"}
                            selected={addData.period}
                            onChange={(e) => {
                                setAddData(prevState => {
                                    return {
                                        ...prevState,
                                        period: e,
                                        periodId: e[0]?.id || null,
                                        periodName: e[0]?.name || null,
                                    }
                                })
                            }}/>
            </div>
        </div>
        <div className="col-12 col-md-2 mb-3 mb-md-0">
            <div className="formInputGroup">
                <FormInput type={"number"}
                           id={"inputAddBookingHours"}
                           label={"Hours"}
                           invalidFeedback={"You must enter an allowance"}
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
        <div className="col-12 col-md-2 d-flex align-items-center">
            <button type={"submit"} className={"btn btn-success"}>Add</button>
        </div>
    </div>);
}

export default AddFormLocation;