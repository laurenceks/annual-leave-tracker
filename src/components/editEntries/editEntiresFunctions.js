import validateForm from "../../functions/formValidation";
import {variantPairings} from "../common/styles";
import naturalSort from "../../functions/naturalSort";
import {Fragment} from "react";
import formatMySqlTimestamp, {timestampToDate} from "../../functions/formatMySqlTimestamp";

const singleEntryRow = (entry, type, functions, editId) => {
    return (
        entry.id !== editId ? [
            entry.id,
            entry.name,
            !editId ? {
                type: "button",
                id: 1,
                text: "Edit",
                buttonClass: "btn-warning btn-sm",
                handler: () => {
                    functions.setEditId(entry.id)
                }
            } : {text: ""},
            !editId ? {
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
                            bodyText: `Are you sure you want to delete ${entry.name}?\n\n${entry.currentStock ? `There ${entry.currentStock > 1 ? "are" : "is"} currently ${entry.currentStock || 0} item${entry.currentStock === 1 ? "" : "s"} at ${entry.name} and you will not be able to alter stock once the entry is deleted.` : "This entry does not currently have any stock."}`,
                            handleYes: () => functions.deleteEntry(entry.id, entry.name)
                        }
                    })
                }
            } : {text: ""}
        ] : singleEditRow(type, entry, functions)
    )
}

const singleEditRow = (type, entry, functions) => {
    const inputIds = {
        name: `editLocationRow-${entry.id}-name`,
        unit: `editLocationRow-${entry.id}-unit`,
        warningLevel: `editLocationRow-${entry.id}-warningLevel`
    };
    return [
        entry.id,
        {
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
        return ([
                entry.id,
                entry.name,
                {text: formatMySqlTimestamp(entry.lastUpdated), sortValue: entry.lastUpdated},
                {
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
                }
            ]
        )
    })
}

export const makeRows = (type, entryList, editId, functions) => {
    const rowFunctions = {
        booking: () => entryList.map(booking => {
            return (
                booking.id !== editId ? [
                    booking.id,
                    booking.name,
                    `${booking.currentStock} ${booking.unit}`,
                    `${booking.warningLevel} ${booking.unit}`,
                    !editId ? {
                        type: "button",
                        id: 1,
                        text: "Edit",
                        buttonClass: "btn-warning btn-sm",
                        handler: () => {
                            functions.setEditId(booking.id)
                        }
                    } : {text: ""},
                    !editId ? {
                        type: "button",
                        id: 1,
                        text: "Delete",
                        buttonClass: "btn-danger btn-sm",
                        handler: () => {
                            functions.setModalOptions(prevState => {
                                return {
                                    ...prevState,
                                    show: true,
                                    deleteId: booking.id,
                                    targetName: booking.name,
                                    bodyText: `Are you sure you want to delete ${booking.name}?\n\nThe item will also be removed from any lists containing it.`,
                                    handleYes: () => functions.deleteEntry(booking.id, booking.name)
                                }
                            })
                        }
                    } : {text: ""}
                ] : makeEditRow(type, booking, functions)
            )
        }),
        period: () => entryList.map(period => {
            return (
                period.id !== editId ? [
                    period.id,
                    period.name,
                    timestampToDate(period.dateFrom),
                    timestampToDate(period.dateTo),
                    !editId ? {
                        type: "button",
                        id: 1,
                        text: "Edit",
                        buttonClass: "btn-warning btn-sm",
                        handler: () => {
                            functions.setEditId(period.id)
                        }
                    } : {text: ""},
                    !editId ? {
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
                    } : {text: ""}
                ] : makeEditRow(type, period, functions)
            )
        }),
        location: () => entryList.map((entry) => singleEntryRow(entry, type, functions, editId)),
        payGrade: () => entryList.map((entry) => singleEntryRow(entry, type, functions, editId)),
        list: () => {
            const newListRows = [];
            entryList.forEach((x, i) => {
                const cellTemplate = {
                    cellData: {"data-rowGroupId": x.id},
                    className: `td-rowGroupId-${x.id}`,
                    text: ""
                };
                if (x.id !== editId) {
                    x.items?.sort((a, b) => naturalSort(a.itemName, b.itemName)).forEach((y, j) => {
                        newListRows.push((j === 0 ? [
                            {
                                ...cellTemplate,
                                rowspan: x.items.filter(x => !x.deleted).length,
                                text: x.id
                            },
                            {
                                ...cellTemplate,
                                rowspan: x.items.filter(x => !x.deleted).length,
                                text: x.name,
                            }] : []).concat(
                            [{
                                ...cellTemplate,
                                sortValue: `${x.name}-${y.itemName}`,
                                text: y.itemName
                            }, {
                                ...cellTemplate,
                                sortValue: `${x.name}-${y.quantity} ${y.unit}`,
                                text: `${y.quantity} ${y.unit}`
                            }]).concat((j === 0 && !editId) ? [{
                            ...cellTemplate,
                            type: "button",
                            text: "Edit",
                            buttonClass: "btn-warning",
                            rowspan: x.items.filter(x => !x.deleted).length,
                            className: "text-center " + cellTemplate.className,
                            handler: () => {
                                functions.setEditId(x.id);
                                functions.setEditData({name: x.name, id: x.id, items: x.items});
                            }
                        }, {
                            ...cellTemplate,
                            type: "button",
                            text: "Delete",
                            buttonClass: "btn-danger",
                            rowspan: x.items.filter(x => !x.deleted).length,
                            className: "text-center " + cellTemplate.className,
                            handler: () => {
                                functions.setModalOptions(prevState => {
                                    return {
                                        ...prevState,
                                        show: true,
                                        deleteId: x.id,
                                        targetName: x.name,
                                        bodyText: `Are you sure you want to delete ${x.name}?\n\nThe item will also be removed from any lists containing it.`,
                                        handleYes: () => functions.deleteEntry(x.id, x.name)
                                    }
                                })
                            }
                        }] : editId ? [cellTemplate, cellTemplate] : []));
                    })
                } else {
                    newListRows.push(...makeEditRow(type, x, functions, editId, entryList))
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
                name: `editBookingRow-${entry.id}-name`,
                unit: `editBookingRow-${entry.id}-unit`,
                warningLevel: `editBookingRow-${entry.id}-warningLevel`
            };
            return [
                entry.id,
                {
                    type: "input",
                    props: {
                        type: "text",
                        id: inputIds.name,
                        label: "Booking name",
                        defaultValue: entry.name,
                        form: "editBookingForm",
                        forceCase: "title"
                    },
                    invalidFeedback: "You must specify a name",
                    sortValue: entry.name
                }, {
                    type: "input",
                    props: {
                        type: "text",
                        id: inputIds.unit,
                        label: "Unit name",
                        defaultValue: entry.unit && entry.unit ? entry.unit.trim() : "",
                        form: "editBookingForm",
                        forceCase: "lower"
                    },
                    invalidFeedback: "You must specify a unit type",
                    sortValue: `${entry.currentStock} ${entry.unit}`
                }, {
                    type: "input",
                    props: {
                        type: "number",
                        id: inputIds.warningLevel,
                        label: "Warning level",
                        defaultValue: entry.warningLevel,
                        form: "editBookingForm",
                    },
                    invalidFeedback: "You must specify a warning level",
                    sortValue: `${entry.warningLevel} ${entry.unit}`
                }, {
                    type: "submit",
                    buttonClass: "btn-success",
                    text: "Save",
                    id: entry.id,
                    className: "text-center buttonCell",
                    form: "editBookingForm",
                    handler: (e) => {
                        validateForm(e, [inputIds.name, inputIds.unit, inputIds.warningLevel], (x) => {
                            if (x.isValid) {
                                functions.editEntry({
                                    name: x.values[inputIds.name],
                                    unit: x.values[inputIds.unit],
                                    warningLevel: x.values[inputIds.warningLevel],
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
        period: () => {
            const inputIds = {
                name: `editPeriodRow-${entry.id}-name`,
                from: `editPeriodRow-${entry.id}-from`,
                to: `editPeriodRow-${entry.id}-to`,
            };
            return [
                entry.id,
                {
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
        list: () => {
            const makeInputCells = (x, y, i, cellTemplate = {}, startIndex = 0) => {
                return [{
                    ...cellTemplate,
                    sortValue: x.items[i].itemName,
                    type: "formItem",
                    props: {
                        label: "Item",
                        id: `input-listId-${x.id}-itemId-${y.itemId}-name`,
                        inputClass: `form-listId-${x.id}`,
                        defaultSelected: x.items[i].itemId?[{
                            ...x.items[i],
                            name: x.items[i].itemName,
                            id: x.items[i].itemId
                        }] : [],
                        filterValues: {key: "id", values: x.items.map(x => x.itemId)},
                        onChange: (e) => {
                            x.items.splice(i, 1, {
                                ...x.items[i],
                                itemName: e?.[0]?.name || null,
                                itemId: e?.[0]?.id || null,
                                unit: e?.[0]?.unit || null,
                            })
                            //update the editedList with new items
                            functions.setEditData(prevState => {
                                return {...prevState, items: x.items}
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
                                return {...prevState, items: x.items}
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
                },
                    x.items.filter(x => !x.deleted).length > 1 ? {
                        ...cellTemplate,
                        type: "button",
                        text: "Delete",
                        buttonClass: "btn-danger",
                        className: "align-middle " + cellTemplate.className,
                        handler: () => {
                            const newDeleteItems = [...entryList[startIndex].items];
                            newDeleteItems[i] = {...newDeleteItems[i], deleted: 1}
                            functions.setEditData((prevState) => {
                                return {...prevState, items: newDeleteItems}
                            })
                            functions.setDataList((x) => {
                                x[startIndex].items = newDeleteItems;
                                return [...x];
                            })
                        }
                    } : ""
                ]

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
            const firstRow = [
                {...cellTemplate, text: entry.id, rowspan: entry.items?.length + 1 || 1},
                {
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
                                return {...prevState, name: v}
                            });
                        }
                    }
                }];
            entry.items.forEach((y, i) => {
                    newEditRow.push((i === 0 ? firstRow : []).concat(
                            y.deleted ? [] : makeInputCells(entry, y, i, cellTemplate, listIndex)
                        )
                    )
                }
            )
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
                        return {...prevState, items: newItems}
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
            return deletedEntryList.map(item => {
                return ([
                        item.id,
                        item.name,
                        `${item.currentStock} ${item.unit}`,
                        {text: formatMySqlTimestamp(item.lastUpdated), sortValue: item.lastUpdated},
                        {
                            type: "button",
                            text: "Restore",
                            buttonClass: "btn-warning btn-sm",
                            handler: () => {
                                functions.setModalOptions(prevState => {
                                    return {
                                        ...prevState,
                                        show: true,
                                        deleteId: item.id,
                                        targetName: item.name,
                                        headerClass: variantPairings.warning.header,
                                        yesButtonVariant: "warning",
                                        bodyText: `Are you sure you want to restore ${item.name}?\n\nThe item will also be re-added to any lists that contained it.`,
                                        handleYes: () => functions.restoreEntry(item.id, item.name)
                                    }
                                })
                            }
                        }
                    ]
                )
            })
        },
        period: () => singleUndeleteRow(deletedEntryList, functions),
        location: () => singleUndeleteRow(deletedEntryList, functions),
        payGrade: () => singleUndeleteRow(deletedEntryList, functions),
        list: () => {
            return deletedEntryList.map(list => {
                return ([
                        list.id,
                        list.name,
                        {text: formatMySqlTimestamp(list.lastUpdated), sortValue: list.lastUpdated},
                        {
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
                        }
                    ]
                )
            })
        }
    }
    return deleteRowFunctions[type]();
}