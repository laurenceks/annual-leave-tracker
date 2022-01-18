import validateForm from "../../functions/formValidation";
import {variantPairings} from "../common/styles";
import naturalSort from "../../functions/naturalSort";
import {Fragment} from "react";
import formatMySqlTimestamp from "../../functions/formatMySqlTimestamp";

export const makeRows = (type, entryList, editId, functions) => {
    const rowFunctions = {
        booking: () => entryList.map(item => {
            return (
                item.id !== editId ? [
                    item.id,
                    item.name,
                    `${item.currentStock} ${item.unit}`,
                    `${item.warningLevel} ${item.unit}`,
                    !editId ? {
                        type: "button",
                        id: 1,
                        text: "Edit",
                        buttonClass: "btn-warning btn-sm",
                        handler: () => {
                            functions.setEditId(item.id)
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
                                    deleteId: item.id,
                                    targetName: item.name,
                                    bodyText: `Are you sure you want to delete ${item.name}?\n\nThe item will also be removed from any lists containing it.`,
                                    handleYes: () => functions.deleteEntry(item.id, item.name)
                                }
                            })
                        }
                    } : {text: ""}
                ] : makeEditRow(type, item, functions)
            )
        }),
        location: () => entryList.map(location => {
            return (
                location.id !== editId ? [
                    location.id,
                    location.name,
                    !editId ? {
                        type: "button",
                        id: 1,
                        text: "Edit",
                        buttonClass: "btn-warning btn-sm",
                        handler: () => {
                            functions.setEditId(location.id)
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
                                    deleteId: location.id,
                                    targetName: location.name,
                                    bodyText: `Are you sure you want to delete ${location.name}?\n\n${location.currentStock ? `There ${location.currentStock > 1 ? "are" : "is"} currently ${location.currentStock || 0} item${location.currentStock === 1 ? "" : "s"} at ${location.name} and you will not be able to alter stock once the location is deleted.` : "This location does not currently have any stock."}`,
                                    handleYes: () => functions.deleteEntry(location.id, location.name)
                                }
                            })
                        }
                    } : {text: ""}
                ] : makeEditRow(type, location, functions)
            )
        }),
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
                name: `editItemRow-${entry.id}-name`,
                unit: `editItemRow-${entry.id}-unit`,
                warningLevel: `editItemRow-${entry.id}-warningLevel`
            };
            return [
                entry.id,
                {
                    type: "input",
                    props: {
                        type: "text",
                        id: inputIds.name,
                        label: "Item name",
                        defaultValue: entry.name,
                        form: "editItemForm",
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
                        form: "editItemForm",
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
                        form: "editItemForm",
                    },
                    invalidFeedback: "You must specify a warning level",
                    sortValue: `${entry.warningLevel} ${entry.unit}`
                }, {
                    type: "submit",
                    buttonClass: "btn-success",
                    text: "Save",
                    id: entry.id,
                    className: "text-center buttonCell",
                    form: "editItemForm",
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
        location: () => {
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
                    form: "editLocationForm",
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
        location: () => {
            return deletedEntryList.map(location => {
                return ([
                        location.id,
                        location.name,
                        {text: formatMySqlTimestamp(location.lastUpdated), sortValue: location.lastUpdated},
                        {
                            type: "button",
                            text: "Restore",
                            buttonClass: "btn-warning btn-sm",
                            handler: () => {
                                functions.setModalOptions(prevState => {
                                    return {
                                        ...prevState,
                                        show: true,
                                        deleteId: location.id,
                                        targetName: location.name,
                                        headerClass: variantPairings.warning.header,
                                        yesButtonVariant: "warning",
                                        bodyText: `Are you sure you want to restore ${location.name}?`,
                                        handleYes: () => functions.restoreEntry(location.id, location.name)
                                    }
                                })
                            }
                        }
                    ]
                )
            })
        },
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