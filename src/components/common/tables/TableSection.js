import React from 'react';
import PropTypes from 'prop-types';
import Table from "./Table";

const TableSection = ({title, tableProps}) => {
    return (
        <div className="my-3">
            <h3>{title}</h3>
            <Table {...tableProps}/>
        </div>
    );
};

TableSection.propTypes = {
    title: PropTypes.string,
    tableProps: PropTypes.object
};

TableSection.defaultProps = {
    title: "Table",
    tableProps: null
};

export default TableSection;
