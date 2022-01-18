import React from 'react';
import PropTypes from 'prop-types';
import {NavLink} from "react-router-dom";

const FormLink = ({to, label}) => {
    return (
        <div className={"my-3"}>
            <p className={"small"}><NavLink className={"text-muted"} to={to}>{label}</NavLink></p>
        </div>
    );
};

FormLink.propTypes = {
    to: PropTypes.string,
    label: PropTypes.string
};

FormLink.defaultProps = {
    to: "/",
    label: "Home"
}

export default FormLink;
