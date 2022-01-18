import {useContext, useRef, useState} from 'react';
import FormInput from "../common/forms/FormInput";
import InputCheckbox from "../common/forms/InputCheckbox";
import FormLink from "../common/forms/FormLink";
import validateForm from "../../functions/formValidation.js"
import LoginFeedback from "./LoginFeedback";
import {GlobalAppContext} from "../../App";
import {useNavigate} from "react-router-dom";


const Login = props => {
    const [loginFeedback, setLoginFeedback] = useState(null);
    const loginForm = useRef();
    const [globalAppContext, setGlobalAppContext] = useContext(GlobalAppContext);
    const history = useNavigate();
    const login = formOutput => {
        setLoginFeedback({inProgress: true})
        fetch("./php/login/login.php", {
            method: "POST",
            body: JSON.stringify(formOutput.values)
        }).then((x) => {
            x.json().then((x) => {
                if (x.success) {
                    setGlobalAppContext({...globalAppContext, user: x.user, userId: x.user.userId, isLoggedIn: true, loginCheckedOnce: true});
                    history("/");
                } else {
                    setLoginFeedback({...x, feedbackClass: "bg-danger", inProgress: false})
                }
            })
        });
    }

    return (
        <form ref={loginForm} onSubmit={(e) => {
            validateForm(e, loginForm, login)
        }} noValidate>
            <fieldset disabled={loginFeedback?.inProgress && "disabled"}>
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
                <div className="formInputGroup mb-3">
                    <FormInput type={"email"} placeholder={"you@example.com"}
                               label={"Email address"}
                               id={"inputLoginEmail"}
                               invalidFeedback={"Please enter your email address"}
                               autocomplete="email"
                    />
                    <FormInput type={"password"} placeholder={"Password"} label={"Password"}
                               id={"inputLoginPassword"}
                               invalidFeedback={"Please enter your password"}
                               autocomplete="current-password"
                    />
                </div>
                <InputCheckbox id={"inputLoginRemember"} label={"Remember me"} className={"my-3"}/>
                <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
                {(loginFeedback && !loginFeedback.inProgress) &&
                <LoginFeedback feedbackText={loginFeedback.feedback} feedbackClass={loginFeedback.feedbackClass}/>}
                {(loginFeedback && !loginFeedback.inProgress && loginFeedback.errorType === "emailNotVerified") &&
                <button className="w-100 btn btn-lg btn-primary mt-3" onClick={() =>history("/reVerify")}>Resend verification email</button>}
                <FormLink to={"/forgotPassword"} label={"Forgot password"}/>
                <FormLink to={"/register"} label={"Register"}/>
                <p className="my-3 text-muted">&copy; Laurence Summers 2021</p>
            </fieldset>
        </form>
    );
};

Login.propTypes = {};

export default Login;
