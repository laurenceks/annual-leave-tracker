import validateForm from "../../functions/formValidation";
import {variantPairings} from "../common/styles";
import naturalSort from "../../functions/naturalSort";
import {Fragment} from "react";
import formatMySqlTimestamp, {dateToShortDate, timestampToDate} from "../../functions/formatMySqlTimestamp";
import setCase from "../../functions/setCase";
import ModalHighlight from "../Bootstrap/modalHighlight";

const statusCells = {
    approved: "table-success",
    requested: "table-warning",
    denied: "table-danger",
    withdrawn: "table-light",
    default: "table-light",
}

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
            return (request.id !== editId ?
                [request.id, `${request.userFullName} (${request.payGradeName}, ${request.locationName})`, {
                    text: dateToShortDate(request.dateFrom),
                    sortValue: request.dateFrom
                }, {
                    text: dateToShortDate(request.dateTo),
                    sortValue: request.dateTo
                }, request.hours, {
                    text: setCase(request.status, "capitalise"),
                    className: statusCells[request.status || "default"]
                }, {
                    text: request.userComments,
                    className: request.userComments ? "" : "table-light"
                }, {
                    text: request.managerComments,
                    className: request.managerComments ? "" : "table-light"
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
                                            bodyText: <>Are you sure you reset {request.userFullName}'s request to <ModalHighlight variety="warning">requested</ModalHighlight>?`</>,
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
                }] :
                makeEditRow(type, request, functions))
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
        location: () => entryList.map((entry) => singleEntryRow(entry, type, functions, editId)),
        payGrade: () => entryList.map((entry) => singleEntryRow(entry, type, functions, editId)),
        allocation: () => {
            const newListRows = [];
            entryList.forEach((allocation) => {
                const cellTemplate = {
                    cellData: {"data-rowGroupId": allocation.id},
                    className: `td-rowGroupId-${allocation.id}`,
                    text: ""
                };
                if (allocation.id !== editId) {
                    allocation.periods?.sort((a, b) => naturalSort(a.itemName, b.itemName)).forEach((y, j) => {
                        newListRows.push((j === 0 ? [{
                            ...cellTemplate,
                            rowspan: allocation.periods.filter(x => !x.deleted).length,
                            text: allocation.id
                        }, {
                            ...cellTemplate,
                            rowspan: allocation.periods.filter(x => !x.deleted).length,
                            text: allocation.name,
                        }] : []).concat([{
                            ...cellTemplate,
                            sortValue: `${allocation.name}-${y.itemName}`,
                            text: y.itemName
                        }, {
                            ...cellTemplate,
                            sortValue: `${allocation.name}-${y.quantity} ${y.unit}`,
                            text: `${y.quantity} ${y.unit}`
                        }]).concat((j === 0 && !editId) ? [{
                            ...cellTemplate,
                            type: "button",
                            text: "Edit",
                            buttonClass: "btn-warning",
                            rowspan: allocation.periods.filter(x => !x.deleted).length,
                            className: "text-center " + cellTemplate.className,
                            handler: () => {
                                functions.setEditId(allocation.id);
                                functions.setEditData({
                                    name: allocation.name,
                                    id: allocation.id,
                                    periods: allocation.periods
                                });
                            }
                        }, {
                            ...cellTemplate,
                            type: "button",
                            text: "Delete",
                            buttonClass: "btn-danger",
                            rowspan: allocation.periods.filter(x => !x.deleted).length,
                            className: "text-center " + cellTemplate.className,
                            handler: () => {
                                functions.setModalOptions(prevState => {
                                    return {
                                        ...prevState,
                                        show: true,
                                        deleteId: allocation.id,
                                        targetName: allocation.name,
                                        bodyText: `Are you sure you want to delete ${allocation.name}?\n\nThis will not delete any bookings during this period.`,
                                        handleYes: () => functions.deleteEntry(allocation.id, allocation.name)
                                    }
                                })
                            }
                        }] : editId ? [cellTemplate, cellTemplate] : []));
                    })
                } else {
                    newListRows.push(...makeEditRow(type, allocation, functions, editId, entryList))
                }
            })
            return newListRows;
        }
    }
    return rowFunctions[type]();
}

const makeEditRow = (type, entry, functions, editId, entryList = []) => {
    const editRowFunctions = {
        booking: () => {
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
                    defaultValue: entry.dateTo ?? entry.dateFrom ?? "",
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
                    label: "Hours",
                    defaultValue: entry.hours,
                    form: "editBookingForm",
                },
                invalidFeedback: "You must specify a warning level",
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
                form: "editBookingForm", //TODO confirm modal that this will reset to "requested"
                handler: (e) => {
                    const dirtyBookingName = `from ${entry.dateFrom} to ${entry.dateTo} costing ${entry.hours} hours`;
                    functions.setModalOptions((prevState) => {
                        return {
                            ...prevState,
                            show: true,
                            deleteId: entry.id,
                            targetName: dirtyBookingName,
                            bodyText: `Are you sure you want to edit your booking ${dirtyBookingName}?\n\nThis will change the status to "Requested" and the booking will need approval by a manager`,
                            handleYes: () => validateForm(e,
                                [inputIds.from, inputIds.to, inputIds.userComments, inputIds.hours], (x) => {
                                    if (x.isValid) {
                                        functions.editEntry({
                                            from: x.values[inputIds.from],
                                            to: x.values[inputIds.to],
                                            hours: x.values[inputIds.hours],
                                            userComments: x.values[inputIds.userComments],
                                            id: entry.id
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
            return [entry.id, `${entry.userFullName} (${entry.payGradeName}, ${entry.locationName})`, {
                text: dateToShortDate(entry.dateFrom),
                sortValue: entry.dateFrom
            }, {
                text: dateToShortDate(entry.dateTo),
                sortValue: entry.dateTo
            }, entry.hours, {
                text: setCase(entry.status, "capitalise"),
                className: statusCells[entry.status || "default"]
            }, entry.userComments, {
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
        allocation: () => {
            const makeInputCells = (x, y, i, cellTemplate = {}, startIndex = 0) => {
                return [{
                    ...cellTemplate,
                    sortValue: x.items[i].itemName,
                    type: "formItem",
                    props: {
                        label: "Item",
                        id: `input-listId-${x.id}-itemId-${y.itemId}-name`,
                        inputClass: `form-listId-${x.id}`,
                        defaultSelected: x.items[i].itemId ? [{
                            ...x.items[i],
                            name: x.items[i].itemName,
                            id: x.items[i].itemId
                        }] : [],
                        filterValues: {
                            key: "id",
                            values: x.items.map(x => x.itemId)
                        },
                        onChange: (e) => {
                            x.items.splice(i, 1, {
                                ...x.items[i],
                                itemName: e?.[0]?.name || null,
                                itemId: e?.[0]?.id || null,
                                unit: e?.[0]?.unit || null,
                            })
                            //update the editedList with new items
                            functions.setEditData(prevState => {
                                return {
                                    ...prevState,
                                    items: x.items
                                }
                            });
                            //update the full list so the table is re-rendered
                            functions.setDataList((prevState) => {
                                prevState[startIndex] = x;
                                return [...prevState];
                            })
                        }
                    },
                }, {
                    ...cellTemplate,
                    sortValue: x.items[i]?.quantity || 0,
                    type: "input",
                    props: {
                        label: "Quantity",
                        type: "Number",
                        id: `input-listId-${x.id}-itemId-${y.itemId}-quantity`,
                        inputClass: `form-listId-${x.id}`,
                        defaultValue: x.items[i]?.quantity || null,
                        onChange: (e, v) => {
                            x.items.splice(i, 1, {
                                ...x.items[i],
                                quantity: v
                            })
                            functions.setEditData(prevState => {
                                return {
                                    ...prevState,
                                    items: x.items
                                }
                            })
                            //update the full list so the table is re-rendered
                            functions.setDataList((prevState) => {
                                prevState[startIndex] = x;
                                return [...prevState];
                            })
                        }
                    }
                }, {
                    ...cellTemplate,
                    className: `align-middle ${cellTemplate.className}`,
                    sortValue: x.items[i]?.unit || "units",
                    text: x.items[i]?.unit || "units"
                }, x.items.filter(x => !x.deleted).length > 1 ? {
                    ...cellTemplate,
                    type: "button",
                    text: "Delete",
                    buttonClass: "btn-danger",
                    className: "align-middle " + cellTemplate.className,
                    handler: () => {
                        const newDeleteItems = [...entryList[startIndex].items];
                        newDeleteItems[i] = {
                            ...newDeleteItems[i],
                            deleted: 1
                        }
                        functions.setEditData((prevState) => {
                            return {
                                ...prevState,
                                items: newDeleteItems
                            }
                        })
                        functions.setDataList((x) => {
                            x[startIndex].items = newDeleteItems;
                            return [...x];
                        })
                    }
                } : ""]

            }
            const inputIds = {
                name: `input-listId-${entry.id}-name`,
            };
            const listIndex = entryList.findIndex((x) => x.id === editId)
            const cellTemplate = {
                cellData: {"data-rowGroupId": entry.id},
                className: `td-rowGroupId-${entry.id}`,
                cellAlignClass: "align-top"
            };
            const newEditRow = [];
            const firstRow = [{
                ...cellTemplate,
                text: entry.id,
                rowspan: entry.items?.length + 1 || 1
            }, {
                ...cellTemplate,
                rowspan: entry.items?.length + 1 || 1,
                type: "input",
                props: {
                    type: "text",
                    label: "Name",
                    id: inputIds.name,
                    defaultValue: entry.name,
                    onChange: (e, v) => {
                        functions.setEditData(prevState => {
                            return {
                                ...prevState,
                                name: v
                            }
                        });
                    }
                }
            }];
            entry.items.forEach((y, i) => {
                newEditRow.push((i === 0 ? firstRow : []).concat(
                    y.deleted ? [] : makeInputCells(entry, y, i, cellTemplate, listIndex)))
            })
            newEditRow.push([{
                ...cellTemplate,
                type: "button",
                text: "Add item",
                buttonClass: "btn-primary",
                className: cellTemplate.className,
                alwaysAtEnd: true,
                handler: () => {
                    const newItems = [...entry.items];
                    newItems.push({
                        itemId: null,
                        itemName: "",
                        unit: "units",
                        quantity: null,
                        listId: entry.id,
                        listItemsId: null,
                        deleted: 0
                    });
                    //save new item in edited list
                    functions.setEditData((prevState) => {
                        return {
                            ...prevState,
                            items: newItems
                        }
                    });
                    functions.setDataList((x) => {
                        x[listIndex].items = newItems;
                        return [...x];
                    })
                }
            }, {
                ...cellTemplate,
                colspan: 3,
                alwaysAtEnd: true,
                fragment: <Fragment>
                    <button className="btn btn-success me-3"
                            onClick={(e) => validateForm(e, `#${inputIds.name}, .form-listId-${entry.id}`, (x) => {
                                if (x.isValid) {
                                    functions.editEntry({
                                        useEditData: true,
                                        id: entry.id,
                                        name: x.values[inputIds.name]
                                    });
                                }
                            })}>
                        Save
                    </button>
                    <button className="btn btn-danger" onClick={() => functions.getEntries()}>Cancel</button>
                </Fragment>,
                className: cellTemplate.className,
            }]);
            return newEditRow;
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
                                    <p className="m-0">Its status will be changed back to <ModalHighlight variety="warning">"requested"</ModalHighlight></p>
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
        allocation: () => {
            return deletedEntryList.map(list => {
                return ([list.id, list.name, {
                    text: formatMySqlTimestamp(list.lastUpdated),
                    sortValue: list.lastUpdated
                }, {
                    type: "button",
                    text: "Restore",
                    buttonClass: "btn-warning btn-sm",
                    handler: () => {
                        functions.setModalOptions(prevState => {
                            return {
                                ...prevState,
                                show: true,
                                deleteId: list.id,
                                targetName: list.name,
                                bodyText: `Are you sure you want to restore ${list.name}?`,
                                headerClass: variantPairings.warning.header,
                                yesButtonVariant: "warning",
                                handleYes: () => functions.restoreEntry(list.id, list.name)
                            }
                        })
                    }
                }])
            })
        }
    }
    return deleteRowFunctions[type]();
}