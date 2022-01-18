import {Transition} from 'react-transition-group';
import {useEffect, useState} from "react";

const duration = 400;

const ToastTransition = ({in: inProp, children}) => {
    const height = document.getElementById(children.props.id)?.offsetHeight || 0;
    const defaultStyle = {
        transition: `opacity ${duration}ms cubic-bezier(0.25, 1, 0.5, 1), max-height ${duration}ms cubic-bezier(0.25, 1, 0.5, 1)`,
        opacity: 0,
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

    const [inState, setInState] = useState(children.props.show);

    useEffect(() => {
        setInState(inProp)
    }, [inProp]);

    return (
        <Transition
            in={inState}
            timeout={duration}
            onEnter={children.props.onEnter}
            onExited={children.props.onExited}>
            {(state) => (
                <div style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}
                >
                    {children}
                </div>
            )}
        </Transition>
    )
}

export default ToastTransition;