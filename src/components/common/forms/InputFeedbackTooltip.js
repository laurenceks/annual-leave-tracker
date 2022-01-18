import React from 'react';
import PropTypes from 'prop-types';

const InputFeedbackTooltip = ({text}) => {
    return (
        <div className="inputFeedbackTooltip px-3 rounded bg-danger w-100 text-light">
            <p className="m-0">{text}</p>
        </div>
    );
};

InputFeedbackTooltip.propTypes = {
    text: PropTypes.string
};
InputFeedbackTooltip.defaultProps = {
    text: "Please enter a valid value"
};

export default InputFeedbackTooltip;
