import FormInput from "../../common/forms/FormInput";
import {useContext, useRef} from "react"
import validateForm from "../../../functions/formValidation";
import {GlobalAppContext} from "../../../App";
import useFetch from "../../../hooks/useFetch";
import {maskUserData} from "../../../functions/maskUserData";
import {useNavigate} from "react-router-dom";

const DeleteAccountForm = () => {

    const [globalAppContext] = useContext(GlobalAppContext);
    const maskedEmail = maskUserData(globalAppContext.user.email);
    const maskedFirstName = maskUserData(globalAppContext.user.firstName);
    const maskedLastName = maskUserData(globalAppContext.user.lastName);

    const fetchHook = useFetch();
    const history = useNavigate();
    const formRef = useRef();
    const formReset = useRef();

    const deleteAccount = (form) => {
        fetchHook({
            type: "deleteAccount",
            options: {
                method: "POST",
                body: JSON.stringify({...form.values}),
            },
            callback: (response) => {
                if (response.success) {
                    formRef.current.reset()
                    history("/logout")
                }
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
                              bodyText: `Are you sure you want to delete you account?\n\nYour account will be permanently deleted. A masked version of your email address (${maskedEmail}) and name (${maskedFirstName} ${maskedLastName}) will be kept to reconcile previous changes. Your full email address will be deleted.\n\nTo regain access you will need to register again from scratch.\n\n`,
                              handleYes: () => {
                                  globalAppContext.setStateFunctions.confirmModal(prevState => {
                                      return {
                                          ...prevState,
                                          show: true,
                                          bodyText: "Are you really sure? This action CANNOT be undone!",
                                          handleYes: () => deleteAccount({
                                              ...form,
                                              values: {
                                                  ...form.values,
                                                  userId: globalAppContext.userId,
                                                  maskedEmail,
                                                  maskedFirstName,
                                                  maskedLastName
                                              }
                                          })
                                      }
                                  })
                              }
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
                    <p className="m-0 text-md-end">Confirm your password to delete your account</p>
                </div>
                <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                    <FormInput type={"password"}
                               id={"inputAccountDeletePassword1"}
                               label={"Current password"}
                               invalidFeedback={"Please enter your current password"}
                               passwordId={3}
                               reset={formReset.current}
                               autocomplete={"current-password"}
                    />
                </div>
                <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                    <FormInput type={"password"}
                               id={"inputAccountDeletePassword2"}
                               label={"Confirm password"}
                               invalidFeedback={"Passwords do not match"}
                               passwordId={3}
                               reset={formReset.current}
                               autocomplete={"current-password"}
                    />
                </div>
                <div className="col-12 col-md-3">
                    <button type="submit" className="btn btn-danger w-100">Delete account</button>
                </div>
            </div>
        </form>)
};

export default DeleteAccountForm;
