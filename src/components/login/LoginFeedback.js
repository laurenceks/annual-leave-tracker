import React from 'react';
import PropTypes from 'prop-types';

const LoginFeedback = ({feedbackClass, feedbackText, marginTop}) => {
    return (
        <div className={`p-3 ${marginTop && "mt-3"} rounded ${feedbackClass}`}>
            <p className="text-light m-0">{feedbackText}</p>
        </div>
    );
};

LoginFeedback.propTypes = {
    feedbackClass: PropTypes.string,
    feedbackText: PropTypes.string,
    marginTop: PropTypes.bool
};

LoginFeedback.defaultProps = {
    feedbackClass: "bg-danger",
    feedbackText: "An unknown error occurred",
    marginTop: true
}

export default LoginFeedback;
