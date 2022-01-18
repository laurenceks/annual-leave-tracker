import PropTypes from 'prop-types';
import {useNavigate} from "react-router-dom";

const DashboardActionButton = ({text, type, link, colour, icon, isNotInBootstrapGrid}) => {
    const history = useNavigate();
    return (
        <div className={`${!isNotInBootstrapGrid && "col"} flex-grow-1 flex-shrink-0 }`}>
            <button className={`btn dashboardActionButton ${!isNotInBootstrapGrid && "w-100"} ${colour}`}
                    onClick={(e) => {
                        if (type === "link" && link) {
                            history(link);
                        }
                    }}>
                <div className="d-flex justify-content-center align-items-center">
                    {icon && icon}
                    <div>{text}</div>
                </div>
            </button>
        </div>
    );
};

DashboardActionButton.propTypes = {
    link: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.string,
    colour: PropTypes.string,
    isNotInBootstrapGrid: PropTypes.bool,
    icon: PropTypes.node
};
DashboardActionButton.defaultProps = {
    text: "",
    colour: "btn-outline-primary",
    isNotInBootstrapGrid: false,
    icon: null,
    link: null,
    type: null,
};

export default DashboardActionButton;
