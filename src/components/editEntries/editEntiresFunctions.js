import validateForm from "../../functions/formValidation";
import {statusCells, variantPairings} from "../common/styles";
import naturalSort from "../../functions/naturalSort";
import formatMySqlTimestamp, {dateToShortDate, timestampToDate} from "../../functions/formatMySqlTimestamp";
import setCase from "../../functions/setCase";
import ModalHighlight from "../Bootstrap/modalHighlight";
import FormLocation from "../common/forms/FormLocation";
import FormPayGrade from "../common/forms/FormPayGrade";

const singleEntryRow = (entry, type, functions, editId) => {
    return (entry.id !== editId ? [entry.id, entry.name, !editId ? {
        type: "button",
        id: 1,
        text: "Edit",
        buttonClass: "btn-warning btn-sm",
        handler: () => {
            functions.setEditId(entry.id)
        }
    } : {text: ""}, !editId ? {
        type: "button",
        id: 1,
        text: "Delete",
        buttonClass: "btn-danger btn-sm",
        handler: () => {
            functions.setModalOptions(prevState => {
                return {
                    ...prevState,
                    show: true,
                    deleteId: entry.id,
                    targetName: entry.name,
                    bodyText: `Are you sure you want to delete ${entry.name}?\n\n${entry.currentStock ?
                        `There ${entry.currentStock > 1 ?
                            "are" :
                            "is"} currently ${entry.currentStock || 0} item${entry.currentStock === 1 ?
                            "" :
                            "s"} at ${entry.name} and you will not be able to alter stock once the entry is deleted.` :
                        "This entry does not currently have any stock."}`,
                    handleYes: () => functions.deleteEntry(entry.id, entry.name)
                }
            })
        }
    } : {text: ""}] : singleEditRow(type, entry, functions))
}

const singleEditRow = (type, entry, functions) => {
    const inputIds = {
        name: `editLocationRow-${entry.id}-name`,
        unit: `editLocationRow-${entry.id}-unit`,
        warningLevel: `editLocationRow-${entry.id}-warningLevel`
    };
    return [entry.id, {
        type: "input",
        props: {
            type: "text",
            id: inputIds.name,
            label: "Location name",
            defaultValue: entry.name,
            form: "editLocationForm",
            forceCase: "title"
        },
        invalidFeedback: "You must specify a name"
    }, {
        type: "submit",
        buttonClass: "btn-success",
        text: "Save",
        id: entry.id,
        className: "text-center buttonCell",
        handler: (e) => {
            validateForm(e, [inputIds.name], (x) => {
                if (x.isValid) {
                    functions.editEntry({
                        name: x.values[inputIds.name],
                        id: entry.id
                    })
                }
            })
        }
    }, {
        type: "button",
        buttonClass: "btn-danger",
        text: "Cancel",
        id: entry.id,
        className: "text-center buttonCell",
        handler: functions.getEntries
    }]
}

const singleUndeleteRow = (deletedEntryList, functions) => {
    return deletedEntryList.map(entry => {
        return ([entry.id, entry.name, {
            text: formatMySqlTimestamp(entry.lastUpdated),
            sortValue: entry.lastUpdated
        }, {
            type: "button",
            text: "Restore",
            buttonClass: "btn-warning btn-sm",
            handler: () => {
                functions.setModalOptions(prevState => {
                    return {
                        ...prevState,
                        show: true,
                        deleteId: entry.id,
                        targetName: entry.name,
                        headerClass: variantPairings.warning.header,
                        yesButtonVariant: "warning",
                        bodyText: `Are you sure you want to restore ${entry.name}?`,
                        handleYes: () => functions.restoreEntry(entry.id, entry.name)
                    }
                })
            }
        }])
    })
}

export const makeRows = (type, entryList, editId, functions) => {
    const rowFunctions = {
        booking: () => entryList.map((booking) => {
            return (booking.id !== editId ? [booking.id, {
                text: dateToShortDate(booking.dateFrom),
                sortValue: booking.dateFrom
            }, {
                text: dateToShortDate(booking.dateTo),
                sortValue: booking.dateTo
            }, booking.hours, {
                text: setCase(booking.status, "capitalise"),
                className: statusCells[booking.status || "default"]
            }, {
                text: booking.userComments,
                className: booking.userComments ? "" : "table-light"
            }, {
                text: booking.managerComments,
                className: booking.managerComments ? "" : "table-light"
            }, !editId ? {
                type: "button",
                id: 1,
                text: "Edit",
                buttonClass: "btn-warning btn-sm",
                handler: () => {
                    functions.setEditId(booking.id)
                    functions.setEditData({
                        useEditData: true,
                        id: booking.id,
                        from: booking.dateFrom,
                        to: booking.dateTo
                    })
                }
            } : {text: ""}, !editId ? {
                type: "button",
                id: 1,
                text: "Delete",
                buttonClass: "btn-danger btn-sm",
                handler: () => {
                    const dirtyBookingName = `from ${booking.dateFrom} to ${booking.dateTo} costing ${booking.hours} hours`;
                    functions.setModalOptions(prevState => {
                        return {
                            ...prevState,
                            show: true,
                            deleteId: booking.id,
                            targetName: dirtyBookingName,
                            bodyText: `Are you sure you want to delete your booking ${dirtyBookingName}?`,
                            handleYes: () => functions.deleteEntry(booking.id, dirtyBookingName)
                        }
                    })
                }
            } : {text: ""}] : makeEditRow(type, booking, functions))
        }),
        request: () => entryList.map((request) => {
            return (request.id !== editId ? [request.id, {
                sortValue: `${request.userFullName}(${request.payGradeName}, ${request.locationName})`,
                fragment: <>
                    <p className="m-0">{request.userFullName}</p>
                    <p className="small m-0 text-muted">{`${request.payGradeName}, ${request.locationName}`}</p>
                </>
            }, {
                sortValue: `${request.dateFrom}-${request.dateTo}`,
                fragment: <>
                    <p className="m-0">{dateToShortDate(request.dateFrom)}</p>
                    <p className="small m-0 text-muted">to</p>
                    <p className="m-0">{dateToShortDate(request.dateTo)}</p>
                </>
            }, {
                sortValue: request.hours,
                fragment: <>
                    <p className="m-0">{request.hours}</p>
                    {request.status === "requested" &&
                    <p className="small m-0 text-muted">{`${request.approvedAtLocationForPayGrade} approved`}</p>}
                </>
            }, {
                text: setCase(request.status, "capitalise"),
                className: `${statusCells[request.status || "default"]} text-center`
            }, {
                sortValue: request.userComments + request.managerComments,
                className: (request.userComments || request.managerComments) ? "" : "table-light",
                fragment: <>
                    {request.userComments && <><p className="m-0 small text-muted">{request.userFullName}</p>
                        <p className="m-0">{request.userComments}</p></>}
                    {request.managerComments && <><p className="m-0 small text-muted">Manager</p>
                        <p className="m-0">{request.managerComments}</p></>}
                </>,
            }, !editId && request.status !== "approved" ? {
                className: "text-center buttonCell",
                form: "editRequestForm",
                fragment: <>
                    <div>
                        <button className="btn btn-warning m-1"
                                onClick={() => functions.setEditId(request.id)}>
                            Edit
                        </button>
                    </div>
                    <div>
                        <button className="btn btn-success m-1"
                                onClick={() => functions.setModalOptions((prevState) => {
                                    return {
                                        ...prevState,
                                        show: true,
                                        headerClass: variantPairings.success.header,
                                        yesButtonVariant: "success",
                                        bodyText: `Are you sure you want to approve ${request.userFullName}'s request?`,
                                        handleYes: () => functions.editEntry({
                                            status: "approved",
                                            managerComments: request.managerComments,
                                            userFullName: request.userFullName,
                                            id: request.id
                                        })
                                    }
                                })}>
                            Approve
                        </button>
                    </div>
                    {request.status !== "denied" && <div>
                        <button className="btn btn-danger m-1"
                                onClick={() => functions.setModalOptions((prevState) => {
                                    return {
                                        ...prevState,
                                        show: true,
                                        deleteId: request.id,
                                        bodyText: `Are you sure you want to deny ${request.userFullName}'s request?`,
                                        handleYes: () => functions.editEntry({
                                            status: "denied",
                                            managerComments: request.managerComments,
                                            userFullName: request.userFullName,
                                            id: request.id
                                        })
                                    }
                                })}>
                            Deny
                        </button>
                    </div>}
                    {request.status === "denied" && <div>
                        <button className="btn btn-warning m-1"
                                onClick={() => functions.setModalOptions((prevState) => {
                                    return {
                                        ...prevState,
                                        show: true,
                                        headerClass: variantPairings.warning.header,
                                        yesButtonVariant: "warning",
                                        bodyText: <>Are you sure you reset {request.userFullName}'s request
                                            to <ModalHighlight variety="warning">requested</ModalHighlight>?`</>,
                                        handleYes: () => functions.editEntry({
                                            feedbackVerb: "reset",
                                            status: "requested",
                                            managerComments: request.managerComments,
                                            userFullName: request.userFullName,
                                            id: request.id
                                        })
                                    }
                                })}>
                            Reset
                        </button>
                    </div>}
                </>
            } : {
                type: "button",
                buttonClass: "btn-warning",
                text: "Edit",
                className: "text-center buttonCell",
                handler: (e) => functions.setEditId(request.id)
            }] : makeEditRow(type, request, functions))
        }),
        period: () => entryList.map(period => {
            return (period.id !== editId ?
                [period.id, period.name, timestampToDate(period.dateFrom), timestampToDate(period.dateTo), !editId ? {
                    type: "button",
                    id: 1,
                    text: "Edit",
                    buttonClass: "btn-warning btn-sm",
                    handler: () => {
                        functions.setEditId(period.id)
                    }
                } : {text: ""}, !editId ? {
                    type: "button",
                    id: 1,
                    text: "Delete",
                    buttonClass: "btn-danger btn-sm",
                    handler: () => {
                        functions.setModalOptions(prevState => {
                            return {
                                ...prevState,
                                show: true,
                                deleteId: period.id,
                                targetName: period.name,
                                bodyText: `Are you sure you want to delete ${period.name}?\n\nThe period will also be removed from any lists containing it.`,
                                handleYes: () => functions.deleteEntry(period.id, period.name)
                            }
                        })
                    }
                } : {text: ""}] :
                makeEditRow(type, period, functions))
        }),
        staff: () => entryList.map(staff => {
            //TODO space staff colspans correctly
            return (staff.id !== editId ?
                [staff.id, staff.staffFullName, staff.payGradeName, staff.locationName, !editId ? {
                    type: "button",
                    id: 1,
                    text: "Edit",
                    buttonClass: "btn-warning btn-sm",
                    handler: () => {
                        functions.setEditData({
                            locationId: staff.locationId,
                            payGradeId: staff.payGradeId,
                            staffFullName: staff.staffFullName,
                            id: staff.id
                        })
                        functions.setEditId(staff.id)
                    }
                } : null] :
                makeEditRow(type, staff, functions))
        }),
        location: () => entryList.map((entry) => singleEntryRow(entry, type, functions, editId)),
        payGrade: () => entryList.map((entry) => singleEntryRow(entry, type, functions, editId)),
        allowance: () => {
            const newListRows = [];
            entryList.forEach((allowance) => {
                const cellTemplate = {
                    cellData: {"data-rowGroupId": allowance.userId},
                    className: `td-rowGroupId-${allowance.userId}`,
                    text: ""
                };

                allowance.periods?.sort((a, b) => naturalSort(a.name, b.name)).forEach((y, j) => {
                    newListRows.push((j === 0 ? [{
                        ...cellTemplate,
                        rowspan: allowance.periods.length,
                        text: allowance.userId
                    }, {
                        ...cellTemplate,
                        rowspan: allowance.periods.length,
                        text: allowance.userFullName,
                    }, {
                        ...cellTemplate,
                        rowspan: allowance.periods.length,
                        text: allowance.locationName,
                    }, {
                        ...cellTemplate,
                        rowspan: allowance.periods.length,
                        text: allowance.payGradeName,
                    }] : []).concat([{
                        ...cellTemplate,
                        sortValue: y.periodName,
                        text: y.periodName
                    }].concat(
                        (editId !== y.allowanceId && editId !== `${allowance.userId}-${y.periodId}`) || !editId ? [{
                            ...cellTemplate,
                            sortValue: y.hours,
                            text: !y.deleted ? y.hours : "Deleted",
                            className: `${cellTemplate.className}${((!y.hours && y.hours !== 0) || y.deleted) && " table-light"}`
                        }, !editId && {
                            ...cellTemplate,
                            type: "button",
                            text: y.allowanceId ? (y.deleted ? "Restore" : "Edit") : "Add",
                            buttonClass: y.allowanceId || y.deleted ? "btn-warning" : "btn-success",
                            className: "text-center " + cellTemplate.className,
                            handler: () => {
                                functions.setEditId(y.allowanceId || `${allowance.userId}-${y.periodId}`);
                                functions.setEditData({
                                    allowanceId: y.allowanceId,
                                    periodId: y.periodId,
                                    periodName: y.periodName,
                                    userFullName: allowance.userFullName,
                                    userId: allowance.userId,
                                });
                            }
                        }, y.allowanceId && !editId && !y.deleted ? {
                            ...cellTemplate,
                            type: "button",
                            text: "Delete",
                            buttonClass: "btn-danger",
                            className: "text-center " + cellTemplate.className,
                            handler: () => {
                                functions.setModalOptions(prevState => {
                                    return {
                                        ...prevState,
                                        show: true,
                                        bodyText: `Are you sure you want to delete ${allowance.userFullName}'s allowance for ${y.periodName}?\n\nThis will not delete any bookings during this period.`,
                                        handleYes: () => functions.deleteEntry(y.allowanceId,
                                            `${allowance.userFullName}'s allowance for ${y.periodName}`)
                                    }
                                })
                            }
                        } : cellTemplate] : makeEditRow(type, {...y, ...allowance}, functions, editId, entryList))));
                })
            })
            return newListRows;
        }
    }
    return rowFunctions[type]();
}

const makeEditRow = (type, entry, functions, editId, entryList = []) => {
    const editRowFunctions = {
        booking: () => {
            let to = functions.editData.dateTo;
            const inputIds = {
                from: `editBookingRow-${entry.id}-from`,
                to: `editBookingRow-${entry.id}-to`,
                hours: `editBookingRow-${entry.id}-hours`,
                userComments: `editBookingRow-${entry.id}-userComments`
            };
            return [entry.id, {
                type: "input",
                props: {
                    type: "date",
                    id: inputIds.from,
                    label: "From",
                    defaultValue: functions.editData.from ?? "",
                    form: "editPeriodForm",
                    onChange: (e, v) => functions.setEditData(prevState => ({
                        ...prevState,
                        from: v,
                        to: v
                    }))
                },
                invalidFeedback: "You must specify a date from",
                sortValue: entry.dateFrom
            }, {
                type: "input",
                props: {
                    type: "date",
                    id: inputIds.to,
                    label: "To",
                    defaultValue: functions.editData.to,
                    form: "editPeriodForm",
                    disabled: true
                },
                invalidFeedback: "You must specify a date to",
                sortValue: entry.dateFrom
            }, {
                type: "input",
                props: {
                    type: "number",
                    id: inputIds.hours,
                    min: 0,
                    step: 0.01,
                    label: "Hours",
                    defaultValue: entry.hours,
                    form: "editBookingForm",
                },
                invalidFeedback: "You must specify the number of hours this booking will cost",
                sortValue: `${entry.warningLevel} ${entry.unit}`
            }, {
                text: setCase(entry.status, "capitalise")
            }, {
                //TODO disable validation
                type: "input",
                props: {
                    type: "text",
                    id: inputIds.userComments,
                    label: "Comments",
                    defaultValue: entry.userComments,
                    form: "editPeriodForm",
                },
                sortValue: entry.name
            }, {
                text: entry.managerComments
            }, {
                type: "submit",
                buttonClass: "btn-success",
                text: "Save",
                id: entry.id,
                className: "text-center buttonCell",
                form: "editBookingForm",
                handler: (e) => {
                    const dirtyBookingName = `from ${functions.editData.from} to ${functions.editData.to} costing ${functions.editData.hours} hours`;
                    functions.setModalOptions((prevState) => {
                        return {
                            ...prevState,
                            show: true,
                            deleteId: entry.id,
                            targetName: dirtyBookingName,
                            bodyText: <><p>Are you sure you want to edit your booking {dirtyBookingName}?</p>
                                <p className="m-0">This will change the status
                                    to <ModalHighlight variety="warning">Requested</ModalHighlight> and the booking will
                                    need approval by a
                                    manager</p></>,
                            handleYes: () => validateForm(e,
                                [inputIds.from, inputIds.to, inputIds.userComments, inputIds.hours], (x) => {
                                    if (x.isValid) {
                                        functions.editEntry({
                                            ...functions.editData,
                                            hours: x.values[inputIds.hours],
                                            userComments: x.values[inputIds.userComments]
                                        })
                                    }
                                })
                        }
                    })
                }
            }, {
                type: "button",
                buttonClass: "btn-danger",
                text: "Cancel",
                id: entry.id,
                className: "text-center buttonCell",
                handler: functions.getEntries
            }];
        },
        request: () => {
            const inputIds = {
                managerComments: `editRequestRow-${entry.id}-userComments`
            };
            return [entry.id, {
                sortValue: `${entry.userFullName}(${entry.payGradeName}, ${entry.locationName})`,
                fragment: <>
                    <p className="m-0">{entry.userFullName}</p>
                    <p className="small m-0 text-muted">{`${entry.payGradeName}, ${entry.locationName}`}</p>
                </>
            }, {
                sortValue: `${entry.dateFrom}-${entry.dateTo}`,
                fragment: <>
                    <p className="m-0">{dateToShortDate(entry.dateFrom)}</p>
                    <p className="small m-0 text-muted">to</p>
                    <p className="m-0">{dateToShortDate(entry.dateTo)}</p>
                </>
            }, {
                sortValue: entry.hours,
                fragment: <>
                    <p className="m-0">{entry.hours}</p>
                    {entry.status === "requested" &&
                    <p className="small m-0 text-muted">{`${entry.approvedAtLocationForPayGrade} approved`}</p>}
                </>
            }, {
                text: setCase(entry.status, "capitalise"),
                className: `${statusCells[entry.status || "default"]} text-center`
            }, {
                type: "input",
                props: {
                    type: "text",
                    id: inputIds.managerComments,
                    label: "Comments",
                    defaultValue: entry.managerComments,
                    form: "editPeriodForm",
                },
                sortValue: entry.name
            }, {
                className: "text-center buttonCell",
                form: "editRequestForm",
                fragment: <>
                    <button className="btn btn-success m-1"
                            onClick={(e) => functions.editEntry({
                                feedbackVerb: "saved",
                                userFullName: entry.userFullName,
                                status: entry.status,
                                managerComments: document.getElementById(inputIds.managerComments).value,
                                id: entry.id
                            })}>
                        Save
                    </button>
                    <button className="btn btn-danger m-1" onClick={functions.getEntries}>Cancel</button>
                </>
            }];
        },
        period: () => {
            const inputIds = {
                name: `editPeriodRow-${entry.id}-name`,
                from: `editPeriodRow-${entry.id}-from`,
                to: `editPeriodRow-${entry.id}-to`,
            };
            return [entry.id, {
                type: "input",
                props: {
                    type: "text",
                    id: inputIds.name,
                    label: "Period name",
                    defaultValue: entry.name,
                    form: "editPeriodForm",
                    forceCase: "title"
                },
                invalidFeedback: "You must specify a name",
                sortValue: entry.name
            }, {
                type: "input",
                props: {
                    type: "date",
                    id: inputIds.from,
                    label: "From",
                    defaultValue: entry.dateFrom ?? "",
                    form: "editPeriodForm",
                },
                invalidFeedback: "You must specify a date from",
                sortValue: entry.dateFrom
            }, {
                type: "input",
                props: {
                    type: "date",
                    id: inputIds.to,
                    label: "To",
                    defaultValue: entry.dateTo ?? "",
                    form: "editPeriodForm",
                },
                invalidFeedback: "You must specify a date to",
                sortValue: entry.dateFrom
            }, {
                type: "submit",
                buttonClass: "btn-success",
                text: "Save",
                id: entry.id,
                className: "text-center buttonCell",
                form: "editPeriodForm",
                handler: (e) => {
                    validateForm(e, [inputIds.name, inputIds.from, inputIds.to], (x) => {
                        if (x.isValid) {
                            functions.editEntry({
                                name: x.values[inputIds.name],
                                from: x.values[inputIds.from],
                                to: x.values[inputIds.to],
                                id: entry.id
                            })
                        }
                    })
                }
            }, {
                type: "button",
                buttonClass: "btn-danger",
                text: "Cancel",
                id: entry.id,
                className: "text-center buttonCell",
                handler: functions.getEntries
            }];
        },
        staff: () => {
            return [entry.id, entry.staffFullName, {
                fragment: <FormPayGrade defaultSelected={entry.payGradeId ? [{
                    name: entry.payGradeName,
                    id: entry.payGradeId
                }] : []}
                                        onChange={(e) => functions.setEditData(prevState => ({
                                            ...prevState,
                                            payGradeId: e[0] ? e[0].id : null
                                        }))}/>,
                invalidFeedback: `You must specify ${entry.staffFirstName}'s pay grade`,
                sortValue: entry.payGradeName
            }, {
                fragment: <FormLocation defaultSelected={entry.locationId ? [{
                    name: entry.locationName,
                    id: entry.locationId
                }] : []}
                                        onChange={(e) => functions.setEditData(prevState => ({
                                            ...prevState,
                                            locationId: e[0] ? e[0].id : null
                                        }))}/>,
                invalidFeedback: `You must specify where ${entry.staffFirstName} works`,
                sortValue: entry.locationName
            }, {
                type: "submit",
                buttonClass: "btn-success",
                text: "Save",
                className: "text-center buttonCell",
                form: "editPeriodForm",
                handler: (e) => {
                    functions.editEntry({useEditData: true})
                }
            }, {
                type: "button",
                buttonClass: "btn-danger",
                text: "Cancel",
                id: entry.id,
                className: "text-center buttonCell",
                handler: functions.getEntries
            }];
        },
        allowance: () => {
            const inputIds = {
                hours: `input-userIdPeriodId-${entry.userId}-${entry.periodId}-hours`,
            };
            const cellTemplate = {
                //TODO: pass an id to group rows - perhaps piggyback on editId??
                cellData: {"data-rowGroupId": entry.allowanceId},
                className: `td-rowGroupId-${entry.id}`,
                cellAlignClass: "align-top"
            };
            return ([{
                ...cellTemplate,
                type: "input",
                props: {
                    type: "number",
                    id: inputIds.hours,
                    min: 0,
                    step: 0.01,
                    label: "Hours",
                    defaultValue: entry.hours,
                    form: "editAllowanceForm",
                },
                invalidFeedback: "You must specify the number of hours",
                sortValue: entry.hours
            }, {
                ...cellTemplate,
                type: "button",
                text: "Save",
                buttonClass: "btn-success",
                className: "text-center" + cellTemplate.className,
                cellAlignClass: "align-middle",
                handler: (e) => validateForm(e, `#${inputIds.hours}`, (x) => {
                    if (x.isValid) {
                        functions.editEntry({
                            useEditData: true,
                            hours: x.values[inputIds.hours]
                        });
                    }
                })
            }, {
                ...cellTemplate,
                type: "button",
                text: "Cancel",
                buttonClass: "btn-secondary",
                className: "text-center" + cellTemplate.className,
                cellAlignClass: "align-middle",
                handler: () => functions.setEditId(null)
            }]);
        }
    }
    return editRowFunctions[type]();
}

export const makeUndeleteRow = (type, deletedEntryList, functions) => {
    const deleteRowFunctions = {
        booking: () => {
            return deletedEntryList.map(booking => {
                return ([booking.id, {
                    text: dateToShortDate(booking.dateFrom),
                    sortValue: booking.dateFrom
                }, {
                    text: dateToShortDate(booking.dateTo),
                    sortValue: booking.dateTo
                }, booking.hours, {
                    text: formatMySqlTimestamp(booking.lastUpdated),
                    sortValue: booking.lastUpdated
                }, {
                    type: "button",
                    text: "Restore",
                    buttonClass: "btn-warning btn-sm",
                    handler: () => {
                        const dirtyBookingName = `from ${booking.dateFrom} to ${booking.dateTo} costing ${booking.hours} hours`;
                        functions.setModalOptions(prevState => {
                            return {
                                ...prevState,
                                show: true,
                                deleteId: booking.id,
                                targetName: booking.name,
                                headerClass: variantPairings.warning.header,
                                yesButtonVariant: "warning",
                                bodyText: <>
                                    <p>Are you sure you want to restore your booking ${dirtyBookingName}?</p>
                                    <p className="m-0">Its status will be changed back
                                        to <ModalHighlight variety="warning">"requested"</ModalHighlight></p>
                                </>,
                                handleYes: () => functions.restoreEntry(booking.id, dirtyBookingName)
                            }
                        })
                    }
                }])
            })
        },
        period: () => singleUndeleteRow(deletedEntryList, functions),
        location: () => singleUndeleteRow(deletedEntryList, functions),
        payGrade: () => singleUndeleteRow(deletedEntryList, functions),
        allowance: () => {
            return deletedEntryList.map(allowance => {
                return ([allowance.id, allowance.name, {
                    text: formatMySqlTimestamp(allowance.lastUpdated),
                    sortValue: allowance.lastUpdated
                }, {
                    type: "button",
                    text: "Restore",
                    buttonClass: "btn-warning btn-sm",
                    handler: () => {
                        functions.setModalOptions(prevState => {
                            return {
                                ...prevState,
                                show: true,
                                bodyText: `Are you sure you want to restore ${allowance.name}?`,
                                headerClass: variantPairings.warning.header,
                                yesButtonVariant: "warning",
                                handleYes: () => functions.restoreEntry(allowance.allowanceId)
                            }
                        })
                    }
                }])
            })
        }
    }
    return deleteRowFunctions[type]();
}