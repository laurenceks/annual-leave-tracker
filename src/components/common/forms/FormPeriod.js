import {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import naturalSort from "../../../functions/naturalSort";
import FormTypeahead from "./FormTypeahead";
import useInitialise from "../../../hooks/useInitialise";
import useFetch from "../../../hooks/useFetch";

const FormPeriod = ({
                        lastUpdated,
                        filterValues,
                        defaultSelected,
                        label,
                        ...props
                    }) => {

    const [periods, setPeriods] = useState(defaultSelected);
    const [updated, setUpdated] = useState(lastUpdated);
    const periodsLoadedOnce = useRef(false);
    const fetchHook = useFetch();

    useInitialise(() => {
        setUpdated(Date.now());
    });

    useEffect(() => {
        const getPeriods = () => {
            fetchHook({
                type: "getPeriods",
                callback: (x) => {
                    periodsLoadedOnce.current = true;
                    if (filterValues) {
                        setPeriods(x.periods.filter((x) => {
                            return filterValues.values.indexOf(x[filterValues.key]) === -1
                        }).concat(defaultSelected || []).sort((a, b) => naturalSort(a.name, b.name))
                            .filter((x) => !x.deleted))
                    } else {
                        setPeriods(x.periods.sort((a, b) => naturalSort(a.name, b.name)).filter((x) => !x.deleted))
                    }
                }
            })
        }

        getPeriods();
    }, [updated]);

    return <FormTypeahead {...props} defaultSelected={defaultSelected} label={label} labelKey="name" options={periods || []}/>;
}

FormPeriod.propTypes = {
    lastUpdated: PropTypes.number,
    label: PropTypes.string,
};
FormPeriod.defaultProps = {
    lastUpdated: null,
    label: "Period",
};

export default FormPeriod;
