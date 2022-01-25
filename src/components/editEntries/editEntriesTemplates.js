import AddFormLocation from "./addEntryForms/AddFormLocation";
import AddFormBooking from "./addEntryForms/AddFormBooking";
import AddFormPayGrade from "./addEntryForms/AddFormPayGrade";
import AddFormPeriod from "./addEntryForms/AddFormPeriod";
import AddFormAllowance from "./addEntryForms/AddFormAllowance";

const addDataTemplates = {
    allowance: {
        user: [],
        userId: null,
        userFullName: null,
        period: [],
        periodId: null,
        periodName: null,
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
    },
    staff: {
        id: null,
        payGradeId: null,
        locationId: null,
        userFullName: null,
    },
    request: null
}

const addDataForms = {
    allowance: AddFormAllowance,
    location: AddFormLocation,
    booking: AddFormBooking,
    payGrade: AddFormPayGrade,
    period: AddFormPeriod,
    request: null,
    staff: null,
}

export {addDataTemplates, addDataForms};
