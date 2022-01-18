import PropTypes from 'prop-types';
import {Toast} from "react-bootstrap";
import {useContext, useEffect, useRef, useState} from "react";
import {GlobalAppContext} from "../../App";
import ToastTransition from "../common/transitions/ToastTransition";
import {variantPairings} from "../common/styles";

const dividers = {
    s: 1000,
    m: 60000,
    h: 3.6e+6,
    d: 8.64e+7,
    w: 6.048e+8,
    mo: 2.628e+9,
    y: 3.154e+10
}

const calculateTimeDiff = (timeInMs) => {
    const diff = Date.now() - timeInMs;
    switch (true) {
        case (diff < dividers.s):
            return "Just now";
        case (diff < dividers.m):
            return Math.floor(diff / dividers.s) + "s";
        case (diff < dividers.h):
            return Math.floor(diff / dividers.m) + "m";
        case (diff < dividers.d):
            return Math.floor(diff / dividers.h) + "h";
        case (diff < dividers.w):
            return Math.floor(diff / dividers.d) + "d";
        case (diff < dividers.mo):
            return Math.floor(diff / dividers.w) + "w";
        case (diff < dividers.y):
            return Math.floor(diff / dividers.mo) + "mo";
        case (diff >= dividers.y):
            return Math.floor(diff / dividers.y) + "y";
        default:
            return diff + "ms";
    }
}

const timeUntilNext = (from, unit = "s") => {
    let divider = dividers[unit];
    return (Math.ceil(from / divider) * divider) - from;
}

function NotificationToast({show, title, timestamp, bodyText, variant, headerClass, id, icon, autoHide, onClick}) {
    const [showState, setShowState] = useState(show);
    const [timestampUpdated, setTimestampUpdated] = useState(null);
    const [timestampText, setTimestampText] = useState("Just now");
    const setToasts = useContext(GlobalAppContext)[0].setStateFunctions.toasts;
    const shownOnce = useRef(false);
    const deleteTimeout = useRef(null);
    const timeStampRef = useRef(timestamp);
    const hovering = useRef(false);
    const visible = useRef(false);
    const clicked = useRef(false);
    const toastNode = useRef();
    const IconComponent = icon || variantPairings[variant].icon

    const close = () => {
        if (!hovering.current) {
            setShowState(false);
        }
    }

    useEffect(() => {
        if (!shownOnce.current) {
            setShowState(true);
            shownOnce.current = true;
        }
    }, [showState]);

    useEffect(() => {
        if (visible.current) {
            //timestamp has been updated and the toast is still showing - update the text to the current time difference
            const timeDiff = calculateTimeDiff(timeStampRef.current);
            setTimestampText(timeDiff);
            setTimeout(() => {
                //trigger new update to timestamp text on the next second
                setTimestampUpdated(Date.now());
            }, timeUntilNext(Date.now(), "s"));
        }
    }, [timestampUpdated]);

    return (
        <Toast style={{whiteSpace: "pre-wrap"}}
               ref={toastNode}
               onClose={close}
               onClick={() => {
                   clicked.current = true;
                   setShowState(false);
                   if(onClick){
                       onClick();
                   }
               }}
               onMouseEnter={() => {
                   if (!clicked.current) {
                       hovering.current = true;
                       if (deleteTimeout.current) {
                           clearTimeout(deleteTimeout.current);
                           deleteTimeout.current = null;
                       }
                       setShowState(true);
                   }
               }}
               onMouseLeave={() => {
                   if (!clicked.current) {
                       hovering.current = false;
                       if (autoHide) {
                           deleteTimeout.current = setTimeout(close, 3000);
                       }
                   }
               }}
               show={showState}
               autohide={autoHide}
               delay={autoHide ? 4000 : null}
               transition={ToastTransition}
               id={id}
               className={`cursor-pointer show`}
               onEnter={() => {
                   if (!visible.current) {
                       visible.current = true;
                       setTimestampUpdated(Date.now());
                       timeStampRef.current = Date.now();
                   }
               }}
               onExited={() => {
                   visible.current = false;
                   setToasts(prevState => prevState.filter(x => x.id !== id));
               }}
        >
            <Toast.Header className={headerClass || `${variantPairings[variant].bg} ${variantPairings[variant].text}`}
                          closeButton={false}>
                <IconComponent className={"smallIcon me-2"}/>
                <p className="fs-5 my-0 me-auto">{title}</p>
                <small>{timestampText}</small>
            </Toast.Header>
            <Toast.Body className={"position-relative"}>
                {bodyText}
            </Toast.Body>
        </Toast>
    );
}

NotificationToast.propTypes = {
    autoHide: PropTypes.bool,
    show: PropTypes.bool,
    timeStamp: PropTypes.number,
    handleClick: PropTypes.func,
    buttonText: PropTypes.string,
    buttonVariant: PropTypes.string,
    bodyText: PropTypes.string,
    headerClass: PropTypes.string,
    id: PropTypes.string,
    timeStampText: PropTypes.string,
    title: PropTypes.string,
    variant: PropTypes.string,
};

NotificationToast.defaultProps = {
    autoHide: true,
    show: false,
    timestamp: Date.now(),
    buttonVariant: "primary",
    bodyText: "The operation was completed successfully",
    headerClass: null,
    icon: null,
    id: `${Date.now().toString(36)}${Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(36)}`,
    timestampText: Date.now(),
    title: "Success",
    variant: "success"
}

export default NotificationToast;
