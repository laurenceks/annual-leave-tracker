import React, {useContext, useEffect, useRef, useState} from "react"
import useFetch from "../../hooks/useFetch";
import validateForm from "../../functions/formValidation";
import {GlobalAppContext} from "../../App";
import {addDataForms, addDataTemplates} from "./editEntriesTemplates";
import setCase from "../../functions/setCase";
import {makeRows, makeUndeleteRow} from "./editEntiresFunctions";
import TableSection from "../common/tables/TableSection";
import {deletedEntryTableHeadings, entryTableHeadings} from "./editEntriesTableHeadings";
import PropTypes from "prop-types";
import naturalSort from "../../functions/naturalSort";

const EditEntries = ({
                         type,
                         title,
                         includeDeleted,
                         resultsKey,
                         sortIndex,
                         splitKeys,
                         splitOn,
                     }) => {
    const addDataTemplate = addDataTemplates[type];
    const addDataForm = addDataForms[type];
    const fetchHook = useFetch();
    const setModalOptions = useContext(GlobalAppContext)[0].setStateFunctions.confirmModal;
    const [addData, setAddData] = useState({...addDataTemplate});
    const [editData, setEditData] = useState(null);
    const [editId, setEditId] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [typeChanged, setTypeChanged] = useState(null);
    const addForm = useRef();
    const splitArray = useRef(null);
    const dataLoadedOnce = useRef(false);

    const getEntries = () => {
        setEditId(null);
        fetchHook({
            type: `get${setCase(type, "capitalise")}s`,
            options: {includeDeleted: true},
            dontHandleFeedback: !dataLoadedOnce.current,
            callback: (result) => {
                console.log(result)
                dataLoadedOnce.current = true;
                splitArray.current = splitOn ? splitKeys || (result[resultsKey || `${type}s`] || []).reduce((a, b) => {
                    b[splitOn] && a.indexOf(b[splitOn]) === -1 && (a = [...a, b[splitOn]]);
                    return a;
                }, []).sort(naturalSort) : null;
                setDataList(result[resultsKey || `${type}s`] || [])
            }
        });
    }
    const addEntry = (form) => {
        fetchHook({
            type: `add${setCase(type, "capitalise")}`,
            options: {
                method: "POST",
                body: JSON.stringify({...addData, ...form.values}),
            },
            callback: () => {
                setAddData({...addDataTemplate});
                addForm.current.querySelector("input").focus();
                getEntries();
            }
        });
    }
    const editEntry = (values) => {
        if (values.useEditData) {
            values = {...values, ...editData};
        }
        console.log(values)
        fetchHook({
            type: `edit${setCase(type, "capitalise")}`,
            options: {
                method: "POST",
                body: JSON.stringify(values),
            },
            callback: (response) => {
                if (response.success || response.errorType !== "allocationExists") {
                    getEntries();
                }
            }
        });
    }

    const deleteEntry = (id, name) => {
        fetchHook({
            type: `delete${setCase(type, "capitalise")}`,
            options: {
                method: "POST",
                body: JSON.stringify({
                    id: id,
                    name: name
                }),
            },
            callback: getEntries
        });
    }

    const restoreEntry = (id, name) => {
        fetchHook({
            type: `restore${setCase(type, "capitalise")}`,
            options: {
                method: "POST",
                body: JSON.stringify({
                    id,
                    name
                }),
            },
            callback: getEntries
        });
    }

    const makeEntryRows = (filteredData = dataList) => {
        return makeRows(type, filteredData, editId, {
            setModalOptions,
            setEditId,
            getEntries,
            editEntry,
            deleteEntry,
            setDataList,
            setEditData,
            editData
        })
    }
    const makeEntryUndeleteRow = (filteredData = dataList) => {
        return makeUndeleteRow(type, filteredData, {
            setModalOptions,
            restoreEntry
        })
    }

    useEffect(() => {
        dataLoadedOnce.current = false;
        setDataList([]);
        setAddData({...addDataTemplate});
        setTypeChanged(Date.now())
        getEntries();
    }, [type]);

    useEffect(() => {
        makeEntryRows();
    }, [editId]);

    return (<div className="container">
        {addDataForm && <form ref={addForm} onSubmit={(e) => validateForm(e, addForm, addEntry)}>
            <div className="row my-3">
                {React.createElement(addDataForm, {
                    addData,
                    setAddData
                })}
            </div>
        </form>}
        <div className="row my-3">
            {splitOn && splitArray.current?.length > 0 ? splitArray.current.map((x, i) => {
                return <TableSection title={`${setCase(x)} ${title}`}
                                     tableProps={{
                                         headers: entryTableHeadings[type],
                                         rows: makeEntryRows(dataList.filter((y) => !y.deleted && y[splitOn] === x)) || [],
                                         defaultSortIndex: sortIndex,
                                         updated: typeChanged,
                                         defaultHoverGroup: editId
                                     }}
                                     key={`${x}=${i}`}
                />
            }) : <TableSection title={`All ${title}`}
                               tableProps={{
                                   headers: entryTableHeadings[type],
                                   rows: makeEntryRows(dataList.filter((x) => !x.deleted)),
                                   defaultSortIndex: sortIndex,
                                   updated: typeChanged,
                                   defaultHoverGroup: editId
                               }}

            />}
            {includeDeleted && <TableSection title={`Deleted ${title}`}
                                             tableProps={{
                                                 headers: deletedEntryTableHeadings[type],
                                                 rows: makeEntryUndeleteRow(dataList.filter((x) => x.deleted)),
                                                 defaultSortIndex: sortIndex,
                                                 updated: typeChanged
                                             }}
            />}
        </div>
    </div>);
};

EditEntries.propTypes = {
    includeDeleted: PropTypes.bool,
    resultsKey: PropTypes.string,
    splitOn: PropTypes.string,
    splitKeys: PropTypes.array,
    sortIndex: PropTypes.number
}

EditEntries.defaultProps = {
    includeDeleted: true,
    resultsKey: null,
    splitKeys: null,
    splitOn: null,
    sortIndex: 1
}

export default EditEntries;