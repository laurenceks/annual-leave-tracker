import PropTypes from 'prop-types';
import InputFeedbackTooltip from "./InputFeedbackTooltip";
import setCase from "../../../functions/setCase";
import {useEffect, useRef, useState} from "react";
import useInitialise from "../../../hooks/useInitialise";

const FormInput = ({
    autocomplete,
                       defaultValue,
                       disabled,
                       forceCase,
                       form,
                       id,
                       inputClass,
                       invalidFeedback,
                       label,
                       max,
                       min,
                       onChange,
                       passwordId,
                       placeholder,
                       reset,
                       step,
                       type,
                       value,
                   }) => {

    const [inputState, setInputState] = useState(defaultValue || value || "");
    const renderedOnce = useRef(false);
    const resetSetOnce = useRef(false);

    useInitialise(() => {
        renderedOnce.current = true;
    })

    useEffect(() => {
        renderedOnce.current && setInputState(defaultValue || value);
    }, [defaultValue, value]);

    useEffect(() => {
        resetSetOnce.current ? setInputState("") : resetSetOnce.current = true;
    }, [reset]);

    return (
        <div className={"formInputWrap"}>
            <div className="form-floating">
                <input type={type} className={`form-control formInput${inputClass ? ` ${inputClass}` : ""}`}
                       id={id}
                       name={id}
                       placeholder={placeholder || label}
                       autocomplete={autocomplete}
                       data-passwordid={passwordId}
                       min={min}
                       max={max}
                       step={step}
                       onChange={(e) => {
                           const returnValue = type === "number" && e.target.value ? parseInt(e.target.value) : forceCase && forceCase !== "" ? setCase(e.target.value, forceCase) : e.target.value;
                           setInputState(returnValue);

                           if (onChange) {
                               onChange(id, returnValue);
                           }
                       }}
                       form={form}
                       disabled={disabled}
                       value={inputState || ""}
                />
                <label htmlFor={id}>{label}</label>
            </div>
            {invalidFeedback && <InputFeedbackTooltip text={invalidFeedback}/>}
        </div>
    );
};

FormInput.propTypes = {
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    forceCase: PropTypes.string,
    form: PropTypes.string,
    id: PropTypes.string,
    inputClass: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
    passwordId: PropTypes.number,
    step: PropTypes.number,
    reset: PropTypes.number,
    disabled: PropTypes.bool
};
FormInput.defaultProps = {
    form: "",
    id: "input-" + parseInt(Math.random() * 1000000),
    label: "Input",
    placeholder: "Input",
    type: "text",
    disabled: false,
    defaultValue: "",
    forceCase: null,
    inputClass: null,
    invalidFeedback: null,
    max: null,
    min: null,
    onChange: null,
    passwordId: null,
    step: 1,
    reset: Date.now()
};

export default FormInput;
