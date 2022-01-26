import {useRef, useState} from 'react';
import FormInput from "../common/forms/FormInput";
import FormLink from "../common/forms/FormLink";
import validateForm from "../../functions/formValidation.js"
import LoginFeedback from "./LoginFeedback";
import {useNavigate} from "react-router-dom";
import Copyright from "./Copyright";

const Forgot = () => {
    const [forgotFeedback, setForgotFeedback] = useState({inProgress: false});
    const forgotForm = useRef();
    const history = useNavigate();
    const forgot = formOutput => {
        setForgotFeedback({
            ...forgotFeedback,
            inProgress: true
        })
        fetch("./php/login/forgot/forgot.php", {
            method: "POST",
            body: JSON.stringify(formOutput.values)
        }).then((x) => {
            x.json().then((x) => {
                setForgotFeedback({
                    ...forgotFeedback, ...x,
                    inProgress: false,
                    feedbackClass: x.success ? "bg-success" : "bg-danger",
                })
            })
        });
    }

    return (<form ref={forgotForm} onSubmit={(e) => {
            validateForm(e, forgotForm, forgot)
        }} noValidate>
            <fieldset disabled={forgotFeedback.inProgress && "disabled"}><h1 className="h3 mb-3 fw-normal">Forgot
                password</h1>
                {(!forgotFeedback.feedback || forgotFeedback.keepFormActive) && <>
                    <div className="formInputGroup mb-3">
                        <FormInput type={"email"} placeholder={"you@example.com"}
                                   label={"Email address"}
                                   id={"inputForgotEmail"}
                                   invalidFeedback={"Please enter your email address"}
                                   autocomplete={"email"}
                        />
                    </div>
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Send password reset</button>
                </>}
                {(forgotFeedback?.feedback && !forgotFeedback?.inProgress) &&
                <LoginFeedback feedbackText={forgotFeedback.feedback} feedbackClass={forgotFeedback.feedbackClass}/>}
                {forgotFeedback?.feedback === "Email not verified" &&
                <button className="w-100 btn btn-lg btn-primary mt-3" onClick={() => history("/reVerify")}>Resend
                    verification email</button>}
                <FormLink to={"/login"} label={"Back to login"}/>
                <Copyright/>
            </fieldset>
        </form>);
};

export default Forgot;