const entryTableHeadings = {
    allocation: ["ID", "Name", "Location", "Pay grade", "Period", {text: "Hours", colspan: 3}],
    booking: ["ID", "From", "To", "Hours", "Status", "User comments", {text: "Manager comments", colspan: 2}],
    request: ["ID", "User", "From", "To", "Hours", "Status", "User comments", {text: "Manager comments", colspan: 2}],
    location: ["ID", {text: "Name", colspan: 3}],
    payGrade: ["ID", {text: "Name", colspan: 3}],
    period: ["ID", "Name", "From", {text: "To", colspan: 3}],
    list: ["ID", "Name", "Item", {text: "Quantity", colspan: 3}],
    staff: ["ID", "Name", "Pay grade", {text: "Location", colspan: 3}],
}
const deletedEntryTableHeadings = {
    allocation: ["ID", "Name", "Period", {text: "Deleted", colspan: 2}],
    booking: ["ID", "From", "To","Hours", {text: "Deleted", colspan: 2}],
    request: null,
    staff: null,
    location: ["ID", "Name", {text: "Deleted", colspan: 2}],
    payGrade: ["ID", "Name", {text: "Deleted", colspan: 2}],
    period: ["ID", "Name", {text: "Deleted", colspan: 2}],
    list: ["ID", "Name", {text: "Deleted", colspan: 2}],
}


export {entryTableHeadings, deletedEntryTableHeadings};
