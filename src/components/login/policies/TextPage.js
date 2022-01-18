import {NavLink} from "react-router-dom";
import PropTypes from "prop-types";

const TextPage = ({children, previousRoute}) => {
    return (
        <div>
            {children}
            <NavLink className="btn btn-primary my-5 w-100" to={previousRoute || "/"}>Go back</NavLink>
        </div>
    );
};

TextPage.propTypes = {
    previousRoute: PropTypes.string
}

export default TextPage;
