import React from 'react';
import PropTypes from 'prop-types';

const InputCheckboxGroup = ({boxes, type, name, onChange, state}) => {
    return (
        <div className="btn-group" role="group" aria-label={`${type} button group of ${name}`}>
            {boxes.map((x, i) => {
                return (
                    <React.Fragment key={`${name}-${i}`}>
                        <input type={type} className="btn-check"
                               name={name}
                               id={`${name}-${type}-${i}`}
                               autoComplete="off"
                               data-value={x.value}
                               onChange={onChange}
                               checked={type === "radio" ? state === x.value || false : state?.indexOf(x.value) || 0 > -1}
                        />
                        <label className="btn btn-outline-primary"
                               htmlFor={`${name}-${type}-${i}`}>
                            {x.label}
                        </label>
                    </React.Fragment>)
            })}
        </div>
    );
};

InputCheckboxGroup.propTypes = {
    type: PropTypes.string,
    name: PropTypes.string,
    onChange: PropTypes.func,
    boxes: PropTypes.array
};

InputCheckboxGroup.defaultProps = {
    type: "radio",
    name: "radioGroup" + Math.random()*100000,
    boxes: []
};



export default InputCheckboxGroup;
