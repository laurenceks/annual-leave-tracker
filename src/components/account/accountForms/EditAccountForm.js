import FormInput from "../../common/forms/FormInput";
import {useContext, useRef, useState} from "react"
import validateForm from "../../../functions/formValidation";
import {GlobalAppContext} from "../../../App";
import useFetch from "../../../hooks/useFetch";

const EditAccountForm = () => {

    const [globalAppContext, setGlobalAppContext] = useContext(GlobalAppContext);

    const fetchHook = useFetch();

    const [user, setUser] = useState({
        email: globalAppContext.user.email,
        firstName: globalAppContext.user.firstName,
        lastName: globalAppContext.user.lastName
    });

    const formRef = useRef();

    const editAccount = (form) => {
        fetchHook({
            type: "editAccount",
            options: {
                method: "POST",
                body: JSON.stringify(form.values),
            },
            callback: () => {
                setGlobalAppContext(prevState => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            firstName: form.values.inputAccountFirstName,
                            lastName: form.values.inputAccountLastName
                        }
                    }
                })
            }
        })
    }

    return (
        <form ref={formRef}
              id={"profileForm"}
              onSubmit={(e) => {
                  validateForm(e, formRef, editAccount)
              }}>
            <div className="row align-items-center mb-3">
                <div className="col-12 col-md-3 mb-3 mb-md-0">
                    <p className="m-0 text-md-end">ID {globalAppContext.userId}</p>
                </div>
                <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                    <FormInput type={"text"}
                               id={"inputAccountFirstName"}
                               label={"First name"}
                               forceCase="capitalise"
                               invalidFeedback={"You must enter your first name"}
                               onChange={(id, val) => {
                                   setUser({
                                       ...user,
                                       firstName: val
                                   });
                               }}
                               value={user.firstName}
                    />
                </div>
                <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                    <FormInput type={"text"}
                               id={"inputAccountLastName"}
                               label={"Last name"}
                               forceCase="capitalise"
                               invalidFeedback={"You must enter your last name"}
                               onChange={(id, val) => {
                                   setUser({
                                       ...user,
                                       lastName: val
                                   });
                               }}
                               value={user.lastName}
                    />
                </div>
                <div className="col-12 col-md-3">
                    <button type="submit" className="btn btn-primary w-100">Update</button>
                </div>
            </div>
        </form>
    );
};

export default EditAccountForm;
