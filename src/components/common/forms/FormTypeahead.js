import {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import {Typeahead} from "react-bootstrap-typeahead";
import InputFeedbackTooltip from "./InputFeedbackTooltip";
import setCase from "../../../functions/setCase";

const checkIfAncestorsHaveIsInvalidClass = (e) => {
    //make sure invalid classes of parent wrap persists between focus and blurs
    if (e.target.closest(".is-invalid")) {
        e.target.classList.add("is-invalid")
    }
}

const FormTypeahead = ({
                           allowNew,
                           defaultSelected,
                           disabled,
                           form,
                           id,
                           inputClass,
                           invalidFeedback,
                           filterValues,
                           forceCase,
                           label,
                           labelKey,
                           onBlur,
                           onChange,
                           options,
                           selected,
                           useFloatingLabel,
                           ...props
                       }) => {

    const [selectedState, setSelectedState] = useState(defaultSelected);
    const typeaheadInputRef = useRef();

    useEffect(() => {
        setSelectedState(selected);
    }, [selected]);

    useEffect(() => {
        setSelectedState(defaultSelected);
    }, [defaultSelected]);

    const inputProps = {
        useFloatingLabel: useFloatingLabel,
        id: id,
        floatingLabelText: label,
        className: inputClass,
        ...props.inputProps
    };

    return (
        <div className={"formInputWrap"}>
            <Typeahead
                {...props}
                allowNew={allowNew}
                ref={typeaheadInputRef}
                id={id}
                form={form}
                inputProps={{...inputProps}}
                disabled={disabled || (options?.length <= 1 && !allowNew)}
                options={options}
                selected={selectedState}
                onFocus={checkIfAncestorsHaveIsInvalidClass}
                onChange={(e) => {
                    forceCase && e[0] && (e[0][labelKey] = setCase(e[0][labelKey], forceCase));
                    setSelectedState(e);
                    onChange && onChange(e, typeaheadInputRef);
                }}
                onBlur={(e) => {
                    checkIfAncestorsHaveIsInvalidClass(e);
                    selectedState.length === 0 && typeaheadInputRef.current.clear();
                    onBlur && onBlur(e, typeaheadInputRef);
                }}
                labelKey={labelKey}
            />
            {invalidFeedback && <InputFeedbackTooltip text={invalidFeedback}/>}
        </div>
    );
};

FormTypeahead.propTypes = {
    form: PropTypes.string,
    id: PropTypes.string,
    label: PropTypes.string,
    labelKey: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    useFloatingLabel: PropTypes.bool,
    defaultSelected: PropTypes.array,
    selected: PropTypes.array,
    onBlur: PropTypes.func,
    onChange: PropTypes.func
};
FormTypeahead.defaultProps = {
    form: "",
    id: "input-" + parseInt(Math.random() * 1000000),
    label: "Input",
    labelKey: "name",
    disabled: false,
    useFloatingLabel: true,
    defaultValue: null,
    forceCase: null,
    inputClass: null,
    invalidFeedback: null,
    max: null,
    min: null,
    onBlur: null,
    onChange: null,
    passwordId: null,
    defaultSelected: [],
    selected: [],
    step: 1,
};

export default FormTypeahead;
