const entryTableHeadings = {
    item: ["ID", "Name", "Current stock", {text: "Warning level", colspan: 3}],
    booking: ["ID", "From", "To", "Hours", "Status", "User comments", {text: "Manager comments", colspan: 3}],
    location: ["ID", {text: "Name", colspan: 3}],
    payGrade: ["ID", {text: "Name", colspan: 3}],
    period: ["ID", "Name", "From", {text: "To", colspan: 3}],
    list: ["ID", "Name", "Item", {text: "Quantity", colspan: 3}],
}
const deletedEntryTableHeadings = {
    item: ["ID", "Name", "Stock on deletion", {text: "Deleted", colspan: 2}],
    booking: ["ID", "From", "To", {text: "Deleted", colspan: 2}],
    location: ["ID", "Name", {text: "Deleted", colspan: 2}],
    payGrade: ["ID", "Name", {text: "Deleted", colspan: 2}],
    period: ["ID", "Name", {text: "Deleted", colspan: 2}],
    list: ["ID", "Name", {text: "Deleted", colspan: 2}],
}


export {entryTableHeadings, deletedEntryTableHeadings};
