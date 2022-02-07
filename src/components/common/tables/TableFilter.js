import PropTypes from 'prop-types';
import setCase from "../../../functions/setCase";
import {useEffect, useRef, useState} from "react";
import useInitialise from "../../../hooks/useInitialise";

const TableFilter = ({
                       allowNull,
                       autocomplete,
                       defaultValue,
                       disabled,
                       forceCase,
                       form,
                       id,
                       inputClass,
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

    const getReturnValue = rawValue => {
        let returnValue = "";
        if (type === "number" && rawValue) {
            returnValue = Number(rawValue);
            max && (returnValue = Math.min(returnValue, max));
            min && (returnValue = Math.max(returnValue, min));
        } else if (type === "date" && rawValue) {
            returnValue = new Date(rawValue).getTime();
            max && (returnValue = Math.min(returnValue, new Date(max).getTime()));
            min && (returnValue = Math.max(returnValue, new Date(min).getTime()));
            returnValue = new Date(returnValue).toISOString().split('T')[0];
        } else {
            returnValue = forceCase && forceCase !== "" ? setCase(rawValue, forceCase) : rawValue;
        }
        return returnValue;
    };

    useInitialise(() => {
        renderedOnce.current = true;
    });

    useEffect(() => {
        setInputState(value);
    }, [value]);

    useEffect(() => {
        const newValue = getReturnValue(inputState);
        setInputState(newValue);
        onChange && onChange(id, newValue);
    }, [min, max]);

    useEffect(() => {
        renderedOnce.current && setInputState(defaultValue || value);
    }, [defaultValue]);

    useEffect(() => {
        resetSetOnce.current ? setInputState("") : resetSetOnce.current = true;
    }, [reset]);

    return (<input type={type}
                   className={`form-control form-control-sm TableFilter${inputClass ? ` ${inputClass}` : ""}`}
                   id={id}
                   name={id}
                   placeholder={placeholder}
                   autoComplete={autocomplete}
                   data-passwordid={passwordId}
                   min={min}
                   max={max}
                   step={step}
                   onChange={(e) => {
                       const returnValue = getReturnValue(e.target.value);
                       setInputState(returnValue);
                       onChange && onChange(id, returnValue);
                   }}
                   form={form}
                   disabled={disabled}
                   value={inputState || ""}
                   data-allownull={allowNull}/>);
};

TableFilter.propTypes = {
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    forceCase: PropTypes.string,
    form: PropTypes.string,
    id: PropTypes.string,
    inputClass: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    passwordId: PropTypes.number,
    step: PropTypes.number,
    reset: PropTypes.number,
    allowNull: PropTypes.bool,
    disabled: PropTypes.bool,
};
TableFilter.defaultProps = {
    form: "",
    id: "input-" + parseInt(Math.random() * 1000000),
    placeholder: "Filter",
    type: "text",
    allowNull: false,
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
    reset: Date.now(),
};

export default TableFilter;
