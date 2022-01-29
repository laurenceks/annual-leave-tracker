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
import Copyright from "./Copyright";
import {NavLink} from "react-router-dom";

const Register = () => {
    const [registerFeedback, setRegisterFeedback] = useState({
        success: false,
        inProgress: false
    });
    const [registerOptions, setRegisterOptions] = useState({
        organisations: [],
        locations: [],
        payGrades: []
    });
    const [registerData, setRegisterData] = useState({
        organisation: null,
        location: {},
        payGrade: {}
    });
    const registerForm = useRef();

    useInitialise(() => {
        fetchJson("./php/login/getRegisterOptions.php", {
            method: "GET",
        }, (x) => {
            setRegisterOptions({
                organisations: x.organisations || [],
                locations: x.locations || [],
                payGrades: x.payGrades || [],
            });
        })
    });

    const register = formOutput => {
        setRegisterFeedback({
            ...registerFeedback,
            inProgress: true
        })
        console.log({
            ...formOutput.values, ...registerData
        })
        fetchJson("./php/login/register.php", {
            method: "POST",
            body: JSON.stringify({
                ...formOutput.values, ...registerData
            })
        }, (x) => {
            setRegisterFeedback({
                ...registerFeedback, ...x,
                inProgress: false,
                feedbackClass: x.success ? "bg-success" : "bg-danger",
            })
        });
    }
    return (<form ref={registerForm}
                  onSubmit={(e) => {
                      validateForm(e, registerForm, register, {organisation: registerData})
                  }}
                  noValidate>
        <fieldset disabled={(registerFeedback.inProgress || !registerOptions) && "disabled"}>
            {!registerFeedback.success && <><h1 className="h3 mb-3 fw-normal">Register</h1>
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
                               invalidFeedback={"Passwords must be at least eight characters with one lower case letter, one capital, one number and a symbol"}
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
                                   inputProps={{
                                       id: "inputRegisterOrganisation",
                                       useFloatingLabel: true,
                                       floatingLabelText: "Organisation",
                                       className: "formInput",
                                       "data-statename": "organisation"
                                   }}
                                   allowNew
                                   forceCase="titleCase"
                                   value={[registerData.organisation || {}]}
                                   onChange={(e) => {
                                       setRegisterData(prevState => ({
                                           ...prevState,
                                           organisation: e[0] ? {
                                               ...e[0],
                                               organisation: e[0].customOption ? e[0].name.toTitleCase() : e[0].name
                                           } : null
                                       }))
                                   }}
                                   labelKey="name"
                                   options={registerOptions.organisations}
                                   invalidFeedback={"Please select your organisation, or add a new one"}
                                   autocomplete={"organization"}
                    />
                    {registerData.organisation && registerData.organisation.customOption ?
                        <p className="my-3 text-muted small">{registerData.organisation.organisation} will be saved as a
                            new organisation with you as the admin</p> :
                        registerData.organisation && <>
                            <FormTypeahead id={"inputRegisterPayGrade"}
                                           inputProps={{
                                               id: "inputRegisterPayGrade",
                                               useFloatingLabel: true,
                                               floatingLabelText: "Pay grade",
                                               className: "formInput",
                                               "data-statename": "paygrade"
                                           }}
                                           forceCase="titleCase"
                                           value={[registerData.payGrade || {}]}
                                           onChange={(e) => {
                                               setRegisterData(prevState => ({
                                                   ...prevState,
                                                   payGrade: e[0] || null
                                               }))
                                           }}
                                           labelKey="name"
                                           options={!registerData?.organisation?.customOption && registerData?.organisation?.id ?
                                               registerOptions.payGrades.filter(
                                                   (x) => x.organisationId === registerData.organisation.id) :
                                               registerOptions.payGrades}
                                           invalidFeedback={"Please select your pay grade"}
                            />
                            <FormTypeahead id={"inputRegisterLocation"}
                                           inputProps={{
                                               id: "inputRegisterLocation",
                                               useFloatingLabel: true,
                                               floatingLabelText: "Location",
                                               className: "formInput",
                                               "data-statename": "location"
                                           }}
                                           forceCase="titleCase"
                                           value={[registerData.location || {}]}
                                           onChange={(e) => {
                                               setRegisterData(prevState => ({
                                                   ...prevState,
                                                   location: e[0] || null
                                               }))
                                           }}
                                           labelKey="name"
                                           options={!registerData?.organisation?.customOption && registerData?.organisation?.id ?
                                               registerOptions.locations.filter(
                                                   (x) => x.organisationId === registerData.organisation.id) :
                                               registerOptions.locations}
                                           invalidFeedback={"Please select your pay location"}
                            />

                        </>}
                </div>
                <InputCheckbox id={"inputRegisterTsandCs"}
                               label={<>I agreed to the <NavLink className={"text-muted"} to={"/termsAndConditions"}>terms and conditions</NavLink></>}
                               invalidFeedback={"You must agree to the terms and conditions"}
                               checkRequired={true}
                               className={"mb-3"}
                />
                <button className="w-100 btn btn-lg btn-primary" type="submit">Register</button>
            </>}
            {(registerFeedback.feedback && !registerFeedback.inProgress) &&
            <LoginFeedback feedbackText={registerFeedback.feedback}
                           feedbackClass={registerFeedback.feedbackClass}/>}
            <FormLink to={"/login"}
                      label={registerFeedback.success ? "Back to login" : "Login with an existing account"}/>
            <FormLink to={"/privacy"}
                      label={"Privacy policy"}/>
            <Copyright/>
        </fieldset>
    </form>);
};

export default Register;
