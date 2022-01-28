import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Transition} from 'react-transition-group';

const duration = 400;

const ArrowIconTransition = ({in: inProp, children, onEnter, onExited, colourVariant}) => {
    const width = 16;
    const defaultStyle = {
        transition: `opacity ${duration}ms cubic-bezier(0.25, 1, 0.5, 1), max-width ${duration}ms cubic-bezier(0.25, 1, 0.5, 1)`,
        opacity: 0,
        display: "inline-block"
    }

    const transitionStyles = {
        entering: {opacity: 1, maxWidth: width + "px"},
        entered: {opacity: 1, maxWidth: width + "px"},
        exiting: {
            opacity: 0,
            maxWidth: 0,
            transition: `opacity ${duration}ms cubic-bezier(0.76, 0, 0.24, 1), max-width ${duration}ms cubic-bezier(0.76, 0, 0.24, 1)`,
        },
        exited: {
            opacity: 0,
            maxWidth: 0,
            transition: `opacity ${duration}ms cubic-bezier(0.76, 0, 0.24, 1), max-width ${duration}ms cubic-bezier(0.76, 0, 0.24, 1)`,
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

ArrowIconTransition.propTypes = {
    colourVariant: PropTypes.string,
    in: PropTypes.bool,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
};

ArrowIconTransition.defaultProps = {
    colourVariant: null,
    in: false,
    onEnter: undefined,
    onExited: undefined,
}

export default ArrowIconTransition;