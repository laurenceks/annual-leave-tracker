import React from 'react';
import PropTypes from 'prop-types';
import {variantPairings} from "../common/styles";

const ModalHighlight = ({
                            variety,
                            children
                        }) => {
    return (<>
        <span className={`rounded px-1 ${variantPairings[variety]?.header || "text-dark bg-light"}`}>{children}</span>
    </>);
};

ModalHighlight.propTypes = {
    variety: PropTypes.string
};

ModalHighlight.defaultProps = {
    variety: null
}

export default ModalHighlight;
