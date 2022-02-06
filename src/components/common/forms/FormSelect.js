import PropTypes from 'prop-types';
import InputFeedbackTooltip from "./InputFeedbackTooltip";
import {useEffect, useRef, useState} from "react";
import useInitialise from "../../../hooks/useInitialise";

const FormSelect = ({
                        allowNull,
                        autocomplete,
                        defaultValue,
                        disabled,
                        form,
                        id,
                        inputClass,
                        invalidFeedback,
                        label,
                        onChange,
                        placeholder,
                        reset,
                        options,
                        value,
                        valueCase,
                    }) => {

    const [inputState, setInputState] = useState(defaultValue || value || "");
    const renderedOnce = useRef(false);
    const resetSetOnce = useRef(false);

    useInitialise(() => {
        renderedOnce.current = true;
    })

    useEffect(() => {
        setInputState(value);
    }, [value]);

    useEffect(() => {
        renderedOnce.current && setInputState(defaultValue || value);
    }, [defaultValue]);

    useEffect(() => {
        resetSetOnce.current ? setInputState("") : resetSetOnce.current = true;
    }, [reset]);

    const setValueCase = (value) => {
        return valueCase ? (valueCase === "lower" ? value.toLowerCase() : value.toUpperCase()) : value
    };

    return (<div className={"formInputWrap"}>
        <div className="form-floating">
            <select className={`form-control form-select${inputClass ? ` ${inputClass}` : ""}`}
                    aria-label={label}
                    id={id}
                    name={id}
                    placeholder={placeholder || label}
                    autoComplete={autocomplete}
                    onChange={(e) => {
                        setInputState(e.target.value);
                        onChange && onChange(id, e.target.value);
                    }}
                    form={form}
                    disabled={disabled}
                    value={inputState || ""}
                    data-allownull={allowNull}>
                {options.map(
                    (x, i) => <option key={`${id}-${i}`} value={setValueCase(x.value ?? x)} label={x.label ?? x}/>)}
            </select>
            <label htmlFor={id}>{label}</label>
        </div>
        {invalidFeedback && <InputFeedbackTooltip text={invalidFeedback}/>}
    </div>);
};

FormSelect.propTypes = {
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    form: PropTypes.string,
    id: PropTypes.string,
    inputClass: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    valueCase: PropTypes.string,
    reset: PropTypes.number,
    allowNull: PropTypes.bool,
    disabled: PropTypes.bool,
    options: PropTypes.array
};
FormSelect.defaultProps = {
    form: "",
    id: "input-" + parseInt(Math.random() * 1000000),
    label: "Input",
    placeholder: "Input",
    allowNull: false,
    disabled: false,
    defaultValue: "",
    inputClass: null,
    invalidFeedback: null,
    onChange: null,
    options: [],
    reset: Date.now(),
    valueCase: null
};

export default FormSelect;
