import {useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import naturalSort from "../../../functions/naturalSort";
import FormTypeahead from "./FormTypeahead";
import useInitialise from "../../../hooks/useInitialise";
import useFetch from "../../../hooks/useFetch";

const FormUser = ({
                      lastUpdated,
                      filterValues,
                      defaultSelected,
                      label,
                      ...props
                  }) => {

    const [users, setUsers] = useState(defaultSelected);
    const [updated, setUpdated] = useState(lastUpdated);
    const usersLoadedOnce = useRef(false);
    const fetchHook = useFetch();

    useInitialise(() => {
        setUpdated(Date.now());
    });

    useEffect(() => {
        const getUsers = () => {
            fetchHook({
                type: "getUsersMin",
                callback: (x) => {
                    usersLoadedOnce.current = true;
                    if (filterValues) {
                        setUsers(x.users.filter((x) => {
                            return filterValues.values.indexOf(x[filterValues.key]) === -1
                        }).concat(defaultSelected || []).sort((a, b) => naturalSort(a.name, b.name))
                            .filter((x) => !x.deleted))
                    } else {
                        setUsers(x.users.sort((a, b) => naturalSort(a.name, b.name)).filter((x) => !x.deleted))
                    }
                }
            })
        }

        getUsers();
    }, [updated]);

    return <FormTypeahead {...props} defaultSelected={defaultSelected} label={label} labelKey="name" options={users || []}/>;
}

FormUser.propTypes = {
    lastUpdated: PropTypes.number,
    label: PropTypes.string,
};
FormUser.defaultProps = {
    lastUpdated: null,
    label: "name",
};

export default FormUser;
