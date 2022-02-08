import Table from "../common/tables/Table";
import {useCallback, useEffect, useState} from "react";
import FormInput from "../common/forms/FormInput";
import FormSelect from "../common/forms/FormSelect";
import InputCheckbox from "../common/forms/InputCheckbox";
import useFetch from "../../hooks/useFetch";
import {dateToShortDate} from "../../functions/formatMySqlTimestamp";

const dateTableHeadings = {
    day: "Date",
    week: "W/C",
    month: "Month",
    year: "Year",
};

const dateOffsets = {
    day: 1,
    week: 7,
    month: 0,
    year: 0,
};

const cellValueClasses = {
    approvedBookings: {
        0: "table-light",
    },
    hours: {
        0: "table-light",
    },
};
const trimForClassName = str => (str || "").replace(" ", "-").trim();

const getNextDayOfWeek = (date, day = 0) => {
    const resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + (7 + (day === 6 ? 0 : day + 1) - date.getDay()) % 7);
    return resultDate.toISOString().split('T')[0];
};

const constrainDate = (date, type, fromOrTo, weekStart = 0) => {
    const d = new Date(date);
    const conversions = {
        day: {
            from: () => date,
            to: () => date,
        },
        week: {
            from: () => getNextDayOfWeek(d, weekStart),
            to: () => getNextDayOfWeek(d, weekStart),
        },
        month: {
            from: () => `${date.substr(0, 7)}-01`,
            to: () => `${date.substr(0, 7)}-${new Date(date.substr(0, 4), +date.substr(5, 2), 0).getDate()}`,
        },
        year: {
            from: () => `${date.substr(0, 4)}-01-01`,
            to: () => `${date.substr(0, 4)}-12-31`,
        },
    };
    return conversions[type][fromOrTo]();
};

const Hours = () => {
    const fetchHook = useFetch();
    const [hoursRows, setHoursRows] = useState([["01/05/2022", "Chertsey SORT", 1, 11.5],
        ["05/05/2022", "Chertsey OTL", 1, 11.5],
        ["25/05/2022", "Guildford", 2, 23]]);
    const [hoursSettings, setHoursSettings] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
        dateGroup: "day",
        splitByLocation: false,
        splitByPayGrade: false,
        groupSplitBy: "locationId",
        weekStart: 0,
    });
    const formatDateCell = useCallback((date) => {
        if (hoursSettings.dateGroup === "day" || hoursSettings.dateGroup === "week") {
            return dateToShortDate(date);
        } else {
            return date;
        }
    }, [hoursSettings.dateGroup]);

    const constrainDates = useCallback((from = null, to = null) => {
        {
            //TODO - is f meant to be from .to?
            let f = new Date(hoursSettings.to);
            let t = new Date(hoursSettings.to);
            if (!!f.getDate() && !!t.getDate()) {
                const from = constrainDate(hoursSettings.from, hoursSettings.dateGroup, "from",
                    hoursSettings.weekStart);
                f = new Date(from);
                if (t <= f) t = new Date(f.setDate(f.getDate() + dateOffsets[hoursSettings.dateGroup]));
                setHoursSettings(prev => {
                    return {
                        ...prev,
                        from: constrainDate(from, hoursSettings.dateGroup, "from", hoursSettings.weekStart),
                        to: constrainDate(t.toISOString().split('T')[0], hoursSettings.dateGroup, "to",
                            hoursSettings.weekStart),
                    };
                });
            } else {
                //invalid date - do something?
            }

        }
    }, [hoursSettings.from, hoursSettings.to, hoursSettings.dateGroup, hoursSettings.weekStart]);

    useEffect(() => {
        constrainDates();
    }, [hoursSettings.dateGroup, hoursSettings.weekStart, constrainDates]);

    useEffect(() => {
        fetchHook({
            type: "getHours",
            options: {
                method: "POST",
                body: JSON.stringify(hoursSettings),
            },
            callback: (response) => {
                if (response.success) {
                    if (hoursSettings.splitByPayGrade || hoursSettings.splitByLocation) {
                        const split = hoursSettings.splitByPayGrade || hoursSettings.splitByLocation;
                        const splitBoth = hoursSettings.splitByPayGrade && hoursSettings.splitByLocation;

                        const splitOne = split ?
                            (splitBoth ?
                                hoursSettings.groupSplitBy :
                                (hoursSettings.splitByLocation ? "locationId" : "payGradeId")) :
                            false;
                        const splitTwo = splitOne === "locationId" ? "payGradeId" : "locationId";

                        const splitName = splitOne === "locationId" ? "locationName" : "payGradeName";
                        const altSplitName = splitOne === "locationId" ? "payGradeName" : "locationName";

                        setHoursRows(response.hoursRaw.map((x, i) => {
                            const previousRow = i > 0 ? response.hoursRaw[i - 1] : null;
                            const classPrefix = "td-rowGroupId-";
                            const cellStrings = {
                                top: `${classPrefix}${x.dateSortValue}`,
                                splitOne: `${classPrefix}${x.dateSortValue}-${x[splitOne]}-${trimForClassName(
                                    x[splitName])}`,
                                splitTwo: `${classPrefix}${x.dateSortValue}-${x[splitOne]}-${trimForClassName(
                                    x[splitName])}-${x[splitTwo]}-${trimForClassName(x[altSplitName])}`,
                            };

                            const cellTemplates = {
                                top: {
                                    className: `${cellStrings.top}`,
                                    cellData: {"data-rowGroupId": cellStrings.top},
                                },
                                splitOne: {
                                    className: `${cellStrings.top} ${cellStrings.splitOne}`,
                                    cellData: {"data-rowGroupId": cellStrings.splitOne},
                                },
                                splitTwo: {
                                    className: `${cellStrings.top} ${cellStrings.splitOne} ${cellStrings.splitTwo}`,
                                    cellData: {"data-rowGroupId": cellStrings.splitTwo},
                                },
                            };

                            return [].concat((i === 0 || x.date !== previousRow.date) ? {
                                ...cellTemplates.top,
                                text: formatDateCell(x.date),
                                sortValue: x.dateSortValue,
                                rowspan: response.hoursRaw.filter((y) => y.date === x.date).length,
                            } : [], (split && x[splitOne] !== previousRow?.[splitOne]) ? {
                                ...cellTemplates.splitOne,
                                sortValue: x[splitName],
                                text: x[splitName],
                                rowspan: splitBoth ?
                                    response.hoursRaw.filter(
                                        (y) => y.date === x.date && y[hoursSettings.groupSplitBy] === x[hoursSettings.groupSplitBy]).length :
                                    null,
                            } : [], splitBoth ? [{
                                ...cellTemplates.splitTwo,
                                sortValue: x[altSplitName],
                                text: x[altSplitName],
                            }] : [], [{
                                sortValue: x.approvedBookings,
                                text: x.approvedBookings,
                                className: `${cellStrings.splitTwo} ${cellValueClasses.approvedBookings[x.approvedBookings] || ""}`,
                            }, {
                                sortValue: x.hours,
                                text: x.hours,
                                className: `${cellStrings.splitTwo} ${cellValueClasses.hours[x.hours] || ""}`,
                            }]);

                        }));
                    } else {
                        setHoursRows(response.hours.map((x) => {
                            return [{
                                sortValue: x.dateSortValue,
                                text: formatDateCell(x.date),
                            }, {
                                text: x.approvedBookings,
                                className: cellValueClasses.approvedBookings[x.approvedBookings] || "",
                            }, {
                                text: x.hours,
                                className: cellValueClasses.hours[x.hours] || "",
                            }];
                        }));
                    }
                }
            },
        });
    }, [hoursSettings]);

//TODO: constrain dates by grouping type
    return (<div className="container">
        <div className="row mt-3 mb-0 mb-md-3">
            <div className="col-12 col-md-4 mb-3 mb-md-0">
                <div className="formInputGroup">
                    <FormInput type={"date"}
                               id={"inputAddBookingFrom"}
                               label={"From"}
                               invalidFeedback={"You must enter a date from"}
                               value={hoursSettings.from}
                               onChange={(e, x) => {
                                   setHoursSettings(prevState => {
                                       return {
                                           ...prevState,
                                           from: x,
                                       };
                                   });
                               }}/>
                </div>
            </div>
            <div className="col-12 col-md-4 mb-3 mb-md-0">
                <div className="formInputGroup">
                    <FormInput type={"date"}
                               id={"inputAddBookingTo"}
                               label={"To"}
                               invalidFeedback={"You must enter a date to"}
                               value={hoursSettings.to}
                               onChange={(e, x) => {
                                   setHoursSettings(prevState => {
                                       return {
                                           ...prevState,
                                           to: x,
                                       };
                                   });
                               }}/>
                </div>
            </div>
            <div className="col-12 col-md-4 mb-3 mb-md-0">
                <div className="formInputGroup">
                    <FormSelect id={"inputHoursDateGroup"}
                                label={"Group dates by"}
                                options={["Day", "Week", "Month", "Year"]}
                                value={hoursSettings.dateGroup}
                                valueCase="lower"
                                onChange={(e, x) => {
                                    setHoursSettings(prevState => {
                                        return {
                                            ...prevState,
                                            dateGroup: x,
                                        };
                                    });
                                }}/>
                </div>
            </div>
        </div>
        <div className="row mb-3 mt-0 mt-md-3">
            <div className="col-12 col-md-4 mb-3 mb-md-0">
                <p className="mb-1 form-text">Split by</p>
                <div className="row mb-1">
                    <div className="col col-6">
                        <InputCheckbox id="inputHoursSplitByLocation" label="Location" onChange={(e, x) => {
                            setHoursSettings(prevState => {
                                return {
                                    ...prevState,
                                    splitByLocation: x,
                                };
                            });
                        }}/>
                    </div>
                    <div className="col col-6">
                        <InputCheckbox id="inputHoursSplitByPayGrade" label="Pay grade" onChange={(e, x) => {
                            setHoursSettings(prevState => {
                                return {
                                    ...prevState,
                                    splitByPayGrade: x,
                                };
                            });
                        }}/>
                    </div>
                </div>
            </div>
            {hoursSettings.splitByLocation && hoursSettings.splitByPayGrade &&
            <div className="col-12 col-md-4 mb-4 mb-md-0">
                <div className="formInputGroup">
                    <FormSelect id={"inputHoursGroupSplitBy"} label={"Group split by"} options={[{
                        value: "locationId",
                        label: "Location",
                    }, {
                        value: "payGradeId",
                        label: "Pay grade",
                    }]} value={hoursSettings.groupSplitBy} onChange={(e, x) => {
                        setHoursSettings(prevState => {
                            return {
                                ...prevState,
                                groupSplitBy: x,
                            };
                        });
                    }}/>
                </div>
            </div>}
            {hoursSettings.dateGroup === "week" && <div className="col-12 col-md-4 mb-4 mb-md-0">
                <div className="formInputGroup">
                    <FormSelect id={"inputHoursWeekStart"} label={"Week starts on"} options={[{
                        value: 0,
                        label: "Monday",
                    }, {
                        value: 1,
                        label: "Tuesday",
                    }, {
                        value: 2,
                        label: "Wednesday",
                    }, {
                        value: 3,
                        label: "Thursday",
                    }, {
                        value: 4,
                        label: "Friday",
                    }, {
                        value: 5,
                        label: "Saturday",
                    }, {
                        value: 6,
                        label: "Sunday",
                    }]} value={hoursSettings.weekStart} onChange={(e, x) => {
                        setHoursSettings(prevState => {
                            return {
                                ...prevState,
                                weekStart: parseInt(x),
                            };
                        });
                    }}/>
                </div>
            </div>}
        </div>
        <Table headers={[dateTableHeadings[hoursSettings.dateGroup]].concat(
            hoursSettings.splitByLocation || hoursSettings.splitByPayGrade ?
                ((hoursSettings.splitByLocation && hoursSettings.splitByPayGrade) ?
                    (hoursSettings.groupSplitBy === "locationId" ? "Location" : "Pay grade") :
                    (hoursSettings.splitByLocation ? "Location" : "Pay grade")) :
                [], "Approved", "Hours")}
               rows={hoursRows}
            //disable sorting if more than one split grouping
               allowSorting={!(hoursSettings.splitByLocation && hoursSettings.splitByPayGrade)}
               allowFiltering={!(hoursSettings.splitByLocation && hoursSettings.splitByPayGrade)}
               hoverClass={!(hoursSettings.splitByPayGrade || hoursSettings.splitByLocation)}/>
    </div>);
};

export default Hours;
