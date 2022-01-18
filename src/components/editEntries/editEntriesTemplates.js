import AddFormLocation from "./addEntryForms/AddFormLocation";
import AddFormBooking from "./addEntryForms/AddFormBooking";
import AddFormPayGrade from "./addEntryForms/AddFormPayGrade";
import AddFormPeriod from "./addEntryForms/AddFormPeriod";

const addDataTemplates = {
    booking: {
        from: "",
        to: "",
        hours: ""
    },
    period: {
        name: "",
        from: "",
        to: "",
    },
    location: {
        name: ""
    },
    payGrade: {
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
    period: AddFormPeriod,
}

export {addDataTemplates, addDataForms};
