import {isValidElement, useEffect, useRef, useState} from "react";
import PropTypes from 'prop-types';
import TableCell from "./TableCell";
import naturalSort from "../../../functions/naturalSort";
import {IoArrowDown, IoArrowUp} from "react-icons/io5";
import ArrowIconTransition from "../transitions/ArrowIconTransition";

const Table = ({
                   title,
                   headers,
                   rows,
                   tableClassName,
                   fullWidth,
                   rowEnter,
                   rowLeave,
                   defaultHoverGroup,
                   defaultSortHeading,
                   defaultSortIndex,
                   defaultSortDirection,
                   hoverClass,
                   allowSorting,
                   length,
                   updated,
                   showPaginationButtons,
               }) => {

    const headerIndex = headers.findIndex((x) => (x.text || x) === defaultSortHeading);
    const [sortSettings, setSortSettings] = useState({
        index: headerIndex >= 0 ? headerIndex : defaultSortIndex || 0,
        ascending: ["descending", "desc", "dsc", "d", "down", "bigToSmall", "largeToSmall", "ZtoA", 0, false].indexOf(
            defaultSortDirection) === -1,
    });
    const [showSortArrow, setShowSortArrow] = useState(false);
    const [currentHeadingHoverIndex, setCurrentHeadingHoverIndex] = useState(null);
    const [currentHoverGroup, setCurrentHoverGroup] = useState(defaultHoverGroup);
    const [tableRows, setTableRows] = useState(rows);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const columnCount = useRef(0);
    const pageCount = useRef(null);
    const pageNumbers = useRef([]);

    const countColumnsInRow = (a, b) => a + (b?.colspan || 1);

    useEffect(() => {
        setCurrentPageIndex(0);
    }, [updated]);

    useEffect(() => {
        const countPages = (arr) => {
            pageCount.current = length ? Math.ceil(arr.length / length) || null : null;
            pageNumbers.current = pageCount.current ? [...Array(pageCount.current).keys()].map(x => ++x) : [];
        };

        const sortTableRows = (a, b, columnStructure = null,
                               aIndex = sortSettings.index + (columnCount.current - a.length),
                               bIndex = sortSettings.index + (columnCount.current - b.length)) => {
            if (columnStructure) {
                const col = columnStructure.reduce((a, b, c) => c < sortSettings.index ? a + b : a, 0);
                aIndex = columnStructure?.length === a.length ? aIndex : col;
                bIndex = columnStructure?.length === b.length ? bIndex : col;
            }
            if (a[aIndex]?.alwaysAtStart || b[bIndex]?.alwaysAtEnd) {
                return sortSettings.ascending ? 1 : -1;
            } else if (a[aIndex]?.alwaysAtEnd || b[bIndex]?.alwaysAtStart) {
                return sortSettings.ascending ? -1 : 1;
            } else {
                return naturalSort(
                    a[aIndex]?.sortValue ?? a[aIndex]?.text ?? a[aIndex]?.props?.defaultValue ?? a[aIndex],
                    b[bIndex]?.sortValue ?? b[bIndex]?.text ?? b[bIndex]?.props?.defaultValue ?? b[bIndex]);
            }
        };

        columnCount.current = headers.reduce((a, b) => a + (b.colspan || 1), 0);
        const currentStart = currentPageIndex * (length || 0);

        let sortedRows = [...rows];
        if (allowSorting) {
            const maxCols = headers.reduce(countColumnsInRow, 0);
            const columnStructures = [];
            if (sortedRows.some(x => x.some((x) => x?.rowspan && x?.rowspan > 1))) {
                let groupedRows = [];
                let rowIndex = 0;
                sortedRows.forEach((rowArray) => {
                    const rowLength = rowArray.find((x) => x.rowspan)?.rowspan;
                    if (rowLength) {
                        columnStructures.push(rowArray.map((x) => (x.rowspan && x.rowspan > 1) ? 0 : 1));
                        groupedRows.push(sortedRows.slice(rowIndex, rowIndex + rowLength));
                        rowIndex += rowLength;
                    }
                });
                if (!columnStructures.every((x) => x[sortSettings.index])) {
                    groupedRows.sort((a, b) => sortTableRows(a[0], b[0]));
                    !sortSettings.ascending && groupedRows.reverse();
                } else {
                    groupedRows.forEach((x, i) => {
                        if (!x.some((x) => x.some((x) => x.type === "input"))) { //for each row group, sort each inner row
                            x.sort((a, b) => sortTableRows(a, b, columnStructures[i]));
                            !sortSettings.ascending && x.reverse();
                        }

                        //then move cells with a rowspan to the first row
                        const maxFindCols = Math.min(x.reduce((a, b) => Math.max(a, b.reduce(countColumnsInRow, 0)), 0),
                            maxCols);
                        const spannedRowCells = [...x.find((y) => y.length === maxFindCols)].filter(
                            (y) => y.rowspan && y.rowspan > 1);

                        x = x.map(y => y.filter(z => !z.rowspan || z.rowspan === 1));
                        const firstValues = [...x[0]];
                        x[0] = columnStructures[i].map((y) => y ? firstValues.shift() : spannedRowCells.shift());
                        groupedRows[i] = x;
                    });
                }
                countPages(groupedRows);
                length && (groupedRows = groupedRows.splice(currentStart, length));
                sortedRows = groupedRows.reduce((a, b) => [...a, ...b], []);
            } else {
                sortedRows.sort(sortTableRows);
                !sortSettings.ascending && sortedRows.reverse();
                countPages(sortedRows);
                length && (sortedRows = sortedRows.splice(currentStart, length));
            }
        }
        setTableRows(sortedRows);
    }, [sortSettings, rows, currentPageIndex]);
    return (<div className={`table-responsive ${fullWidth && "w-100"}`}>
        {(rows && rows.length > 0) ? <>
            <table className={`table ${hoverClass ? "table-hover" : ""} ${tableClassName}`}>
                <thead>
                <tr onMouseEnter={() => setShowSortArrow(true)} onMouseLeave={() => setShowSortArrow(false)}>
                    {headers.map((x, i) => {
                        return x ?
                            (<th key={`${title}-th-${i}`}
                                 colSpan={x.colspan}
                                 rowSpan={x.rowspan}
                                 className={`${allowSorting && " cursor-pointer user-select-none"} ${x.className || ""}`}
                                 data-index={i}
                                 onMouseEnter={(e) => setCurrentHeadingHoverIndex(parseInt(e.target.dataset.index))}
                                 onClick={() => {
                                     setSortSettings(prevState => {
                                         return {
                                             ascending: i === prevState.index ? !prevState.ascending : true,
                                             index: i,
                                         };
                                     });
                                 }}>
                                <div className="d-flex flex-row align-items-center">
                                    {(x.text || x.length > 0 || isValidElement(x)) &&
                                    <ArrowIconTransition in={(showSortArrow && (sortSettings.index === i || currentHeadingHoverIndex === i))}
                                                         colourVariant={sortSettings.index !== i ? "secondary" : null}>
                                        {(sortSettings.ascending || sortSettings.index !== i ?
                                            <IoArrowDown className="d-block"/> :
                                            <IoArrowUp className="d-block"/>)}
                                    </ArrowIconTransition>}
                                    <div>{x.text ?? x}</div>
                                </div>
                            </th>) :
                            null;
                    })}
                </tr>
                </thead>
                <tbody>
                {tableRows.map((x, i) => {
                    return (<tr key={`${title}-tr-${i}`} onMouseEnter={rowEnter} onMouseLeave={rowLeave}>
                        {x.map((y, j) => {
                            return <TableCell key={`${title}-tr-${i}-td-${j}`}
                                              content={y}
                                              className={y?.className}
                                              align={y?.cellAlignClass}
                                              hoverGroup={{
                                                  current: currentHoverGroup,
                                                  set: setCurrentHoverGroup,
                                              }}/>;

                        })}
                    </tr>);
                })}
                </tbody>
            </table>
            {(length && pageCount.current > 1 && showPaginationButtons) && <nav aria-label="Table pages">
                <ul className="pagination justify-content-center">
                    <li className={`page-item user-select-none ${currentPageIndex === 0 ?
                        "disabled" :
                        "cursor-pointer"}`}>
                        <button className="page-link"
                                aria-label="Previous"
                                onClick={() => setCurrentPageIndex(prevState => Math.max(0, --prevState))}>
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>
                    {pageNumbers.current.map((x, i) => {
                        return <li key={`table-${title}-page-${i + 1}`}
                                   className={`page-item user-select-none ${currentPageIndex === i ?
                                       "active" :
                                       "cursor-pointer"}`}>
                            <button className="page-link"
                                    onClick={i !== currentPageIndex ?
                                        (() => setCurrentPageIndex(i)) :
                                        null}>{x}</button>
                        </li>;
                    })}
                    <li className={`page-item user-select-none ${currentPageIndex === pageCount.current - 1 ?
                        "disabled" :
                        "cursor-pointer"}`}>
                        <button className="page-link"
                                aria-label="Next"
                                onClick={() => setCurrentPageIndex(
                                    prevState => Math.min(pageCount.current - 1, ++prevState))}>
                            <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                </ul>
            </nav>}
        </> : <p className=" p-3 my-3 bg-light text-dark rounded-3 text-center">No data to display</p>}
    </div>);
};

Table.propTypes = {
    defaultSortHeading: PropTypes.string,
    title: PropTypes.string,
    tableClassName: PropTypes.string,
    headers: PropTypes.array,
    rows: PropTypes.array,
    fullWidth: PropTypes.bool,
    allowSorting: PropTypes.bool,
    showPaginationButtons: PropTypes.bool,
    hoverClass: PropTypes.bool,
    rowEnter: PropTypes.func,
    rowLeave: PropTypes.func,
    defaultSortIndex: PropTypes.number,
    length: PropTypes.number,
};

Table.defaultProps = {
    defaultSortHeading: null,
    title: `table-${Date.now().toString(36)}`,
    tableClassName: null,
    headers: [],
    rows: [],
    fullWidth: false,
    hoverClass: true,
    allowSorting: true,
    showPaginationButtons: true,
    rowEnter: null,
    rowLeave: null,
    defaultSortIndex: 0,
    length: 10,
};

export default Table;
