import {useContext, useEffect, useRef, useState} from "react"
import React from "react";
import useFetch from "../../hooks/useFetch";
import validateForm from "../../functions/formValidation";
import {GlobalAppContext} from "../../App";
import {addDataForms, addDataTemplates} from "./editEntriesTemplates";
import setCase from "../../functions/setCase";
import {makeRows, makeUndeleteRow} from "./editEntiresFunctions";
import TableSection from "../common/tables/TableSection";
import {deletedEntryTableHeadings, entryTableHeadings} from "./editEntriesTableHeadings";
import PropTypes from "prop-types";

const EditEntries = ({type, title, includeDeleted}) => {
        const addDataTemplate = addDataTemplates[type];
        const AddDataForm = addDataForms[type];
        const fetchHook = useFetch();
        const setModalOptions = useContext(GlobalAppContext)[0].setStateFunctions.confirmModal;
        const [addData, setAddData] = useState({...addDataTemplate});
        const [editData, setEditData] = useState(null);
        const [editId, setEditId] = useState(null);
        const [dataList, setDataList] = useState([]);
        const [typeChanged, setTypeChanged] = useState(null);
        const addForm = useRef();
        const dataLoadedOnce = useRef(false);

        const getEntries = () => {
            setEditId(null);
            fetchHook({
                type: `get${setCase(type, "capitalise")}s`,
                options: {includeDeleted: true},
                dontHandleFeedback: !dataLoadedOnce.current,
                callback: (result) => {
                    dataLoadedOnce.current = true;
                    setDataList(result[`${type}s`] || [])
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
        const editEntry = (form) => {
            if (form.useEditData) {
                form = {...form, ...editData};
            }
            console.log(form);
            fetchHook({
                type: `edit${setCase(type, "capitalise")}`,
                options: {
                    method: "POST",
                    body: JSON.stringify(form),
                },
                callback: (response) => {
                    if (response.success || response.errorType !== "itemExists") {
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
                    body: JSON.stringify({id: id, name: name}),
                },
                callback: getEntries
            });
        }

        const restoreEntry = (id, name) => {
            fetchHook({
                type: `restore${setCase(type, "capitalise")}`,
                options: {
                    method: "POST",
                    body: JSON.stringify({id, name}),
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
                setEditData
            })
        }
        const makeEntryUndeleteRow = (filteredData = dataList) => {
            return makeUndeleteRow(type, filteredData, {setModalOptions, restoreEntry})
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

        return (
            <div className="container">
                <form ref={addForm} onSubmit={(e) => validateForm(e, addForm, addEntry)}>
                    <div className="row my-3">
                        {React.createElement(AddDataForm, {addData, setAddData})}
                    </div>
                </form>
                <div className="row my-3">
                    <TableSection title={`All ${title}`}
                                  tableProps={{
                                      headers: entryTableHeadings[type],
                                      rows: makeEntryRows(dataList.filter((x) => !x.deleted)),
                                      defaultSortIndex: 1,
                                      updated: typeChanged,
                                      defaultHoverGroup: editId
                                  }}

                    />
                    {includeDeleted && <TableSection title={`Deleted ${title}`}
                                   tableProps={{
                                       headers: deletedEntryTableHeadings[type],
                                       rows: makeEntryUndeleteRow(dataList.filter((x) => x.deleted)),
                                       defaultSortIndex: 1,
                                       updated: typeChanged
                                   }}
                    />}
                </div>
            </div>
        );
    }
;

EditEntries.propTypes = {
    includeDeleted: PropTypes.bool
}

EditEntries.defaultProps = {
    includeDeleted: true
}

export default EditEntries;