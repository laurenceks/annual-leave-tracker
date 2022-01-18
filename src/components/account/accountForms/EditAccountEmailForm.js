import FormInput from "../../common/forms/FormInput";
import {useContext, useRef, useState} from "react"
import validateForm from "../../../functions/formValidation";
import {GlobalAppContext} from "../../../App";
import useFetch from "../../../hooks/useFetch";
import {variantPairings} from "../../common/styles";

const EditAccountEmailForm = () => {

    const [globalAppContext, setGlobalAppContext] = useContext(GlobalAppContext);

    const fetchHook = useFetch();

    const [user, setUser] = useState({
        email: globalAppContext.user.email,
        firstName: globalAppContext.user.firstName,
        lastName: globalAppContext.user.lastName
    });

    const formRef = useRef();
    const formReset = useRef();

    const editEmail = (form) => {
        fetchHook({
            type: "editAccountEmail",
            options: {
                method: "POST",
                body: JSON.stringify({
                    ...form.values,
                    firstName: globalAppContext.user.firstName,
                    lastName: globalAppContext.user.lastName
                }),
            },
            callback: (response) => {
                setGlobalAppContext(prevState => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            email: form.values.inputAccountEmail,
                        }
                    }
                });
                formRef.current.reset()
            }
        })
    }

    return (
        <form ref={formRef}
              onSubmit={(e) => {
                  validateForm(e, formRef, (form) => {
                      globalAppContext.setStateFunctions.confirmModal(prevState => {
                          return {
                              ...prevState,
                              show: true,
                              headerClass: variantPairings.warning.header,
                              yesButtonVariant: "warning",
                              bodyText: `Are you sure you want to change your email to ${form.values.inputAccountEmail}?`,
                              handleYes: () => editEmail(form)
                          }
                      })
                  })
              }}
              onReset={() => {
                  formReset.current = Date.now();
              }}>
            <div className="row mb-3 align-items-center">
                <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                    <FormInput type={"text"}
                               id={"inputAccountEmail"}
                               label={"Email address"}
                               onChange={(id, val) => {
                                   setUser({
                                       ...user,
                                       email: val
                                   });
                               }}
                               value={user.email}
                    />
                </div>
                <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                    <FormInput type={"password"}
                               id={"inputAccountPassword1"}
                               label={"Password"}
                               invalidFeedback={"Please enter your password"}
                               passwordId={1}
                               reset={formReset.current}
                    />
                </div>
                <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                    <FormInput type={"password"}
                               id={"inputAccountPassword2"}
                               label={"Confirm password"}
                               invalidFeedback={"Passwords do not match"}
                               passwordId={1}
                               reset={formReset.current}
                    />
                </div>
                <div className="col-12 col-md-3">
                    <button type="submit" className="btn btn-primary w-100">Change email</button>
                </div>
            </div>
        </form>
    );
};

export default EditAccountEmailForm;
