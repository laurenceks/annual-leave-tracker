import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Transition} from 'react-transition-group';

const duration = 400;

const CollapseTransition = ({in: inProp, children, onEnter, onExited, colourVariant}) => {
    const height = 60;
    const defaultStyle = {
        transition: `opacity ${duration}ms cubic-bezier(0.25, 1, 0.5, 1), max-height ${duration}ms cubic-bezier(0.25, 1, 0.5, 1)`,
        opacity: 0,
        display: "block",
        maxHeight: 0,
        overflow: "hidden"
    }

    const transitionStyles = {
        entering: {opacity: 1, maxHeight: height + "px"},
        entered: {opacity: 1, maxHeight: height + "px"},
        exiting: {
            opacity: 0,
            maxHeight: 0,
            transition: `opacity ${duration}ms cubic-bezier(0.76, 0, 0.24, 1), max-height ${duration}ms cubic-bezier(0.76, 0, 0.24, 1)`,
        },
        exited: {
            opacity: 0,
            maxHeight: 0,
            transition: `opacity ${duration}ms cubic-bezier(0.76, 0, 0.24, 1), max-height ${duration}ms cubic-bezier(0.76, 0, 0.24, 1)`,
        },
    };

    const [inState, setInState] = useState(inProp);

    useEffect(() => {
        setInState(inProp)
    }, [inProp]);

    return (
        <Transition
            in={inState}
            timeout={duration}
            onEnter={onEnter}
            onExited={onExited}>
            {(state) => (
                <div style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}
                     className={colourVariant && `text-${colourVariant}`}
                >
                    {children}
                </div>
            )}
        </Transition>
    )
}

CollapseTransition.propTypes = {
    colourVariant: PropTypes.string,
    in: PropTypes.bool,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
};

CollapseTransition.defaultProps = {
    colourVariant: null,
    in: false,
    onEnter: undefined,
    onExited: undefined,
}

export default CollapseTransition;