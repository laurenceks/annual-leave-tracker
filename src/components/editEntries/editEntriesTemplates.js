import AddFormLocation from "./addEntryForms/AddFormLocation";
import AddFormBooking from "./addEntryForms/AddFormBooking";

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
}

export {addDataTemplates, addDataForms};
