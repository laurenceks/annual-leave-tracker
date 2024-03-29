import {NavLink} from "react-router-dom";
import PropTypes from "prop-types";

const TextPage = ({
                      children,
                      previousRoute
                  }) => {
    return (<div className="position-fixed w-100 h-100 top-0 start-0 p-4 p-md-5 bg-white" style={{overflowY: "scroll"}}>
        <div className="main m-auto">{children}
            <div className="text-center">
                <NavLink className="btn btn-primary my-5 w-100" to={previousRoute || "/"} style={{maxWidth: "450px"}}>Go
                    back</NavLink>
            </div>
        </div>
    </div>);
};

TextPage.propTypes = {
    previousRoute: PropTypes.string
}

export default TextPage;
