import {useContext, useEffect, useState} from "react";
import {GlobalAppContext} from "../App.js";
import {variantPairings} from "../components/common/styles";

const useFeedback = (initialResponse) => {
    const setStateFunctions = useContext(GlobalAppContext)[0].setStateFunctions
    const [response, setResponse] = useState(initialResponse);

    useEffect(() => {
        if (response) {
            if (response.success) {
                setStateFunctions.toasts(prevState => {
                    return [...prevState, {
                        title: response.title || response.feedback || "Operation successful",
                        bodyText: response.title ? response.feedback : "The operation was completed successfully",
                        id: `${Date.now().toString(36)}${Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString(36)}`,
                        ...response?.customOptions
                    }]
                });
                if (response.callback) {
                    response.callback(response);
                }
            } else {
                setStateFunctions.acknowledgeModal(prevState => {
                    return {
                        ...defaultState,
                        ...prevState,
                        headerClass: response?.customOptions?.variant ? variantPairings[response.customOptions.variant].header : defaultState.headerClass,
                        show: true,
                        bodyText: response.feedback || "An unknown error occurred",
                        title: response.title || "Error",
                        ...response?.customOptions
                    }
                })
            }
        }
    }, [response]);

    const defaultState = {
        headerClass: variantPairings.warning.header,
        yesButtonVariant: "primary",
        handleClick: () => {
            setStateFunctions.acknowledgeModal(prevState => {
                return {
                    ...prevState,
                    show: false,
                }
            })
            if (response.callback) {
                response.callback(response);
            }
        }
    }

    return setResponse
}

export default useFeedback;