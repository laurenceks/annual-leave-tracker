import AddFormLocation from "./addEntryForms/AddFormLocation";
import AddFormBooking from "./addEntryForms/AddFormBooking";
import AddFormPayGrade from "./addEntryForms/AddFormPayGrade";

const addDataTemplates = {
    booking: {
        from: "",
        to: "",
        hours: ""
    },
    location: {
        name: ""
    },
    list: {
        name: "",
        itemId: null,
        itemName: null,
        unit: null,
        quantity: "",
        selected: [],
    },
    listItem: {
        id: null,
        name: null,
        items: [],
        index: null,
    }
}

const addDataForms = {
    location: AddFormLocation,
    booking: AddFormBooking,
    payGrade: AddFormPayGrade,
}

export {addDataTemplates, addDataForms};
