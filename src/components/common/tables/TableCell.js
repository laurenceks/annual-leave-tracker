import PropTypes from 'prop-types';
import {IoCheckmarkCircleSharp, IoCloseCircleSharp} from "react-icons/io5";
import FormInput from "../forms/FormInput";
import {useRef} from "react";

const renderCellContent = (x) => {
    if (!x || !x.type) {
        return typeof x === "string" || typeof x === "number" ? x : x?.text ?? "";
    } else {
        switch (x.type) {
            case "tick":
            case "tick-invert":
                return (<span className={`tableIcon ${x.type !== "tick-invert" ?
                    (x.value ? "text-success" : "text-danger") :
                    !x.value ? "text-success" : "text-danger"}`}>
                        {x.value ? <IoCheckmarkCircleSharp/> : <IoCloseCircleSharp/>}
                    </span>)
            case "button":
            case "submit":
                return (<button type={x.type === "submit" ? "submit" : "button"}
                                form={x.type === "submit" && x.form ? x.form : ""}
                                className={`btn ${x.buttonClass || "btn-primary"}`}
                                onClick={x.handler}
                                data-userid={x.id}>{x.text}</button>)
            case "input":
                return (<FormInput {...x.props}/>)
            default:
                return x.text ?? "";
        }
    }
}

const TableCell = ({
                       className,
                       content,
                       align,
                       hoverGroup
                   }) => {
    const hoverMatch = (content?.cellData?.["data-rowGroupId"] === hoverGroup.current || className.includes(
        hoverGroup.current)) && hoverGroup.current;
    return (<td className={`${align} ${hoverMatch ? "hover" : ""} ${className || ""}`}
                colSpan={content?.colspan}
                rowSpan={content?.rowspan}
                onMouseEnter={() => {
                    hoverGroup.set(content?.cellData?.["data-rowGroupId"])
                }}
                onMouseLeave={() => {
                    hoverGroup.set(null)
                }}
                {...content?.cellData}
    >
        {content?.fragment ?? renderCellContent(content)}
    </td>);
};

TableCell.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    align: PropTypes.string,
};

TableCell.defaultProps = {
    title: "Users",
    className: "",
    content: "",
    align: "align-middle"
}

export default TableCell;
