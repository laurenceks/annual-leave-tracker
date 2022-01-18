import React from 'react';
import PropTypes from 'prop-types';
import {NavLink} from "react-router-dom";

const NavColButton = ({cols, variant, to, text}) => {
    return (
        <div className={`mb-3 mb-md-0 col ${cols && "col-12 col-md-" + cols}`}>
            <NavLink className={`btn btn-${variant} w-100`} to={to}>{text}</NavLink>
        </div>
    );
};

NavColButton.propTypes = {
    variant: PropTypes.string,
    cols: PropTypes.number
};

NavColButton.defaultProps = {
    variant: "primary",
    cols: null
}

export default NavColButton;
