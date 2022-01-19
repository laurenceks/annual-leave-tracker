import AddFormLocation from "./addEntryForms/AddFormLocation";
import AddFormBooking from "./addEntryForms/AddFormBooking";
import AddFormPayGrade from "./addEntryForms/AddFormPayGrade";
import AddFormPeriod from "./addEntryForms/AddFormPeriod";
import AddFormAllocation from "./addEntryForms/AddFormAllocation";

const addDataTemplates = {
    allocation: {
        userId: null,
        periodId: null,
        hours: ""
    },
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
    allocation: AddFormAllocation,
    location: AddFormLocation,
    booking: AddFormBooking,
    payGrade: AddFormPayGrade,
    period: AddFormPeriod,
}

export {addDataTemplates, addDataForms};
