import React, {useRef, useState} from 'react';
import FormInput from "../common/forms/FormInput";
import InputCheckbox from "../common/forms/InputCheckbox";
import FormLink from "../common/forms/FormLink";
import validateForm from "../../functions/formValidation.js"
import LoginFeedback from "./LoginFeedback";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import "@gouch/to-title-case";
import fetchJson from "../../functions/fetchJson";
import FormTypeahead from "../common/forms/FormTypeahead";
import useInitialise from "../../hooks/useInitialise";

const Register = () => {
    const [registerFeedback, setRegisterFeedback] = useState({success: false, inProgress: false});
    const [organisations, setOrganisations] = useState([]);
    const [organisation, setOrganisation] = useState({});
    const registerForm = useRef();

    useInitialise(() => {
        fetchJson("./php/common/getUserOrganisations.php", {
            method: "GET",
        }, (x) => {
            setOrganisations(x);
        })
    });

    const register = formOutput => {
        setRegisterFeedback({...registerFeedback, inProgress: true})
        fetchJson("./php/login/register.php", {
            method: "POST",
            body: JSON.stringify({...formOutput.values, organisation: organisation})
        }, (x) => {
            setRegisterFeedback({
                ...registerFeedback,
                ...x,
                inProgress: false,
                feedbackClass: x.success ? "bg-success" : "bg-danger",
            })
        });
    }
    return (
        <form ref={registerForm}
              onSubmit={(e) => {
                  validateForm(e, registerForm, register, {organisation: organisation})
              }}
              noValidate>
            <fieldset disabled={(registerFeedback.inProgress || !organisations) && "disabled"}>
                {!registerFeedback.success &&
                <><h1 className="h3 mb-3 fw-normal">Register</h1>
                    <div className="mb-3 formInputGroup">
                        <FormInput type={"text"}
                                   placeholder={"John"}
                                   label={"First name"}
                                   id={"inputRegisterFirstName"}
                                   inputClass={""}
                                   invalidFeedback={"Please enter your first name"}
                                   autocomplete={"given-name"}
                        />
                        <FormInput type={"text"}
                                   placeholder={"Smith"}
                                   label={"Last name"}
                                   id={"inputRegisterLastName"}
                                   inputClass={""}
                                   invalidFeedback={"Please enter your last name"}
                                   autocomplete={"family-name"}
                        />
                    </div>
                    <div className="mb-3 formInputGroup">
                        <FormInput type={"email"}
                                   placeholder={"you@example.com"}
                                   label={"Email address"}
                                   id={"inputRegisterEmail"}
                                   inputClass={""}
                                   invalidFeedback={"Please enter a valid email address"}
                                   autocomplete={"email"}
                        />
                        <FormInput type={"password"}
                                   placeholder={"Password"}
                                   label={"Password"}
                                   id={"inputRegisterPassword"}
                                   inputClass={""}
                                   invalidFeedback={"Please enter a password at least eight characters long with one lower case letter, one capital, one number and a symbol"}
                                   passwordId={1}
                                   autocomplete={"new-password"}
                        />
                        <FormInput type={"password"}
                                   placeholder={"Confirm password"}
                                   label={"Confirm password"}
                                   id={"inputRegisterConfirmPassword"}
                                   inputClass={""}
                                   invalidFeedback={"Passwords do not match"}
                                   passwordId={1}
                                   autocomplete={"new-password"}
                        />
                    </div>
                    <div className="mb-3 formInputGroup">
                        <FormTypeahead id={"inputRegisterOrganisationWrap"}
                                       inputProps={
                                           {
                                               id: "inputRegisterOrganisation",
                                               useFloatingLabel: true,
                                               floatingLabelText: "Organisation",
                                               className: "formInput",
                                               "data-statename": "organisation"
                                           }
                                       }
                                       allowNew
                                       forceCase="titleCase"
                                       onChange={(e) => {
                                           if (e[0] && (organisations))
                                               setOrganisation(e[0] ? {
                                                   ...e[0],
                                                   organisation: e[0].customOption ? e[0].organisation.toTitleCase() : e[0].organisation
                                               } : {})
                                       }}
                                       labelKey="organisation"
                                       options={organisations}
                                       invalidFeedback={"Please select your organisation, or add a new one"}
                                       autocomplete={"organization"}
                        />
                        {organisation && organisation.customOption &&
                        <p className="my-3 text-muted small">{organisation.organisation}
                            will be saved as a new
                            organisation with you as the admin</p>}
                    </div>
                    <InputCheckbox id={"inputRegisterTsandCs"}
                                   label={"I agree to the terms and conditions"}
                                   invalidFeedback={"You must agree to the terms and conditions"}
                                   checkRequired={true}
                                   className={"mb-3"}
                    />
                    <button className="w-100 btn btn-lg btn-primary" type="submit">Register</button>
                </>
                }
                {
                    (registerFeedback.feedback && !registerFeedback.inProgress) &&
                    <LoginFeedback feedbackText={registerFeedback.feedback}
                                   feedbackClass={registerFeedback.feedbackClass}/>
                }
                <FormLink to={"/login"}
                          label={registerFeedback.success ? "Back to login" : "Login with an existing account"}/>
                <FormLink to={"/privacy"}
                          label={"Privacy policy"}/>
                <p className="my-3 text-muted">&copy; Laurence Summers 2021</p>
            </fieldset>
        </form>
    );
};

export default Register;
