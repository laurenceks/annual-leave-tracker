import {useRef, useState} from 'react';
import PropTypes from "prop-types";
import LoginFeedback from "./LoginFeedback";
import validateForm from "../../functions/formValidation";
import FormInput from "../common/forms/FormInput";

const ResetPassword = ({token, selector}) => {
    const [resetPasswordFeedback, setResetPasswordFeedback] = useState({icon: null, success: false, inProgress: false});
    const resetPasswordForm = useRef();
    const resetPassword = formOutput => {
        setResetPasswordFeedback({...resetPasswordFeedback, inProgress: true})
        fetch("./php/login/resetPassword/resetPassword.php", {
            method: "POST",
            body: JSON.stringify({...formOutput.values, token: token, selector: selector})
        }).then((x) => {
            x.json().then((x) => {
                setResetPasswordFeedback({
                    ...resetPasswordFeedback,
                    ...x,
                    inProgress: false,
                    feedbackClass: x.success ? "bg-success" : "bg-danger"
                })
            })
        });
    }

    return (
        <>
            {resetPasswordFeedback.icon && <div className="my-3 w-100 d-flex justify-content-center">
                {resetPasswordFeedback.icon}
            </div>}
            <form className={"loginForm align-middle mt-0"}
                  ref={resetPasswordForm}
                  onSubmit={(e) => {
                      validateForm(e, resetPasswordForm, resetPassword)
                  }}
                  noValidate>
                <fieldset disabled={resetPasswordFeedback.inProgress && "disabled"}>
                    {(!resetPasswordFeedback.success) &&
                    <div>
                        <div className="mb-3 formInputGroup">
                            <FormInput type={"password"}
                                       placeholder={"New password"}
                                       label={"New password"}
                                       id={"inputPasswordResetPassword"}
                                       inputClass={""}
                                       invalidFeedback={"Please enter a password at least eight characters long with one lower case letter, one capital, one number and a symbol"}
                                       passwordId={1}
                                       autocomplete={"new-password"}
                            />
                            <FormInput type={"password"}
                                       placeholder={"Confirm new password"}
                                       label={"Confirm new password"}
                                       id={"inputPasswordResetConfirmPassword"}
                                       inputClass={""}
                                       invalidFeedback={"Passwords do not match"}
                                       passwordId={1}
                                       autocomplete={"new-password"}
                            />
                        </div>
                        <button className="w-100 btn btn-lg btn-primary" type="submit">Reset password</button>
                    </div>
                    }
                    {(resetPasswordFeedback.feedback && !resetPasswordFeedback.inProgress) &&
                    <LoginFeedback feedbackText={resetPasswordFeedback.feedback}
                                   feedbackClass={resetPasswordFeedback.feedbackClass}/>}
                    <p className="my-3 text-muted">&copy; Laurence Summers 2021</p>
                </fieldset>
            </form>
        </>
    );
};

ResetPassword.propTypes = {
    token: PropTypes.string,
    selector: PropTypes.string
};

ResetPassword.defaultProps = {
    token: null,
    selector: null
}

export default ResetPassword;
