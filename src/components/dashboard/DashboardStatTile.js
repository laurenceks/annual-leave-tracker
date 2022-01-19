import PropTypes from 'prop-types';
import {variantPairings} from "../common/styles";

const DashboardStatTile = ({title, number, colourClass, isNotInBootstrapGrid, icon}) => {
    const classMap = {
        "good": {
            bg: variantPairings.success.bg,
            text: variantPairings.success.text
        },
        "ok": {
            bg: variantPairings.warning.bg,
            text: variantPairings.warning.text
        },
        "bad": {
            bg: variantPairings.danger.bg,
            text: variantPairings.danger.text
        },
        "null": {
            bg: "bg-light",
            text: "text-dark"
        },
    }
    return (
        <div className={`${!isNotInBootstrapGrid && "col"} flex-grow-1 flex-shrink-0 }`}>
            <div
                className={`d-flex align-bottom rounded ${classMap[colourClass]?.bg} dashboardStatTileContainer px-2 py-1 position-relative shadow-sm`}>
                <div className="d-flex flex-grow-0 align-items-end dashboardStatTileTitleWrap">
                    <p className={`fs-4 text-end lh-1 py-1 m-0 ${classMap[colourClass]?.text} dashboardStatTileTitle`}>{title}</p>
                </div>
                <div className="d-flex flex-grow-1 align-items-end">
                    <p className={`m-0 text-center lh-1 w-100 dashboardStatTileNumber ${classMap[colourClass]?.text}`}>{number}</p>
                </div>
                {icon && <div className="dashboardStatTileIconContainer">
                    {icon}
                </div>}
            </div>
        </div>
    );
};

DashboardStatTile.propTypes = {
    title: PropTypes.string,
    number: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    colourClass: PropTypes.string,
    isNotInBootstrapGrid: PropTypes.bool,
    icon: PropTypes.node
};
DashboardStatTile.defaultProps = {
    title: "",
    number: "",
    colourClass: null,
    isNotInBootstrapGrid: false,
    icon: null
};

export default DashboardStatTile;
