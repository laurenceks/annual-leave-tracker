import {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import naturalSort from "../../../functions/naturalSort";
import FormTypeahead from "./FormTypeahead";
import useInitialise from "../../../hooks/useInitialise";
import useFetch from "../../../hooks/useFetch";

const FormPayGrade = ({
                          lastUpdated,
                          filterValues,
                          defaultSelected,
                          label,
                          ...props
                      }) => {

    const [payGrades, setPayGrades] = useState([]);
    const [updated, setUpdated] = useState(lastUpdated);
    const payGradesLoadedOnce = useRef(false);
    const fetchHook = useFetch();

    useInitialise(() => {
        setUpdated(Date.now());
    });

    useEffect(() => {
        const getPayGrades = () => {
            fetchHook({
                type: "getPayGrades",
                callback: (x) => {
                    payGradesLoadedOnce.current = true;
                    if (filterValues) {
                        setPayGrades(x.payGrades.filter((x) => {
                            return filterValues.values.indexOf(x[filterValues.key]) === -1
                        }).concat(defaultSelected || []).sort((a, b) => naturalSort(a.name, b.name))
                            .filter((x) => !x.deleted))
                    } else {
                        setPayGrades(x.payGrades.sort((a, b) => naturalSort(a.name, b.name)).filter((x) => !x.deleted))
                    }
                }
            })
        }

        getPayGrades();
    }, [updated]);

    return <FormTypeahead {...props} label={label} defaultSelected={defaultSelected} options={payGrades}/>;
}

FormPayGrade.propTypes = {
    lastUpdated: PropTypes.number,
    label: PropTypes.string,
};
FormPayGrade.defaultProps = {
    lastUpdated: null,
    label: "Pay grade",
};

export default FormPayGrade;
