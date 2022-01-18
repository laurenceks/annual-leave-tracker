import FormInput from "../../common/forms/FormInput";
import {useContext, useRef} from "react"
import validateForm from "../../../functions/formValidation";
import {GlobalAppContext} from "../../../App";
import useFetch from "../../../hooks/useFetch";
import {variantPairings} from "../../common/styles";

const EditAccountPasswordForm = () => {

    const [globalAppContext] = useContext(GlobalAppContext);

    const fetchHook = useFetch();

    const formRef = useRef();
    const formReset = useRef();

    const editPassword = (form) => {
        fetchHook({
            type: "editAccountPassword",
            options: {
                method: "POST",
                body: JSON.stringify({
                    ...form.values
                }),
            },
            callback: () => formRef.current.reset()
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
                              bodyText: `Are you sure you want to change your password?`,
                              handleYes: () => editPassword(form)
                          }
                      })
                  })
              }}
              onReset={() => {
                  formReset.current = Date.now();
              }}
        >
            <div className="row align-items-center mb-3">
                <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                    <FormInput type={"password"}
                               id={"inputAccountOldPassword"}
                               label={"Old password"}
                               invalidFeedback={"Please enter your current password"}
                               reset={formReset.current}
                    />
                </div>
                <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                    <FormInput type={"password"}
                               id={"inputAccountNewPassword1"}
                               label={"New password"}
                               invalidFeedback={"Please enter a password at least eight characters long with one lower case letter, one capital, one number and a symbol"}
                               passwordId={2}
                               reset={formReset.current}
                    />
                </div>
                <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                    <FormInput type={"password"}
                               id={"inputAccountNewPassword2"}
                               label={"Confirm new password"}
                               invalidFeedback={"Passwords do not match"}
                               passwordId={2}
                               reset={formReset.current}
                    />
                </div>
                <div className="col-12 col-md-3">
                    <button type="submit" className="btn btn-primary w-100">Change password</button>
                </div>
            </div>
        </form>);
};

export default EditAccountPasswordForm;
