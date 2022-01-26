export const dashboardRanges = {
    remaining: [{
        upper: 25,
        colourClass: "bad",
        variant: "danger",
        tableClass: "table-danger",
        textClass: "text-danger"
    }, {
        lower: 25,
        upper: 50,
        colourClass: "ok",
        variant: "warning",
        tableClass: "table-warning",
        textClass: "text-warning"
    }, {
        lower: 75,
        colourClass: "good",
        variant: "success",
        tableClass: "table-success",
        textClass: "text-success"
    },],
    bookedTaken: [{
        upper: 25,
        colourClass: "good",
        variant: "success",
        tableClass: "table-success"
    }, {
        lower: 25,
        upper: 75,
        colourClass: "ok",
        variant: "warning",
        tableClass: "table-warning"
    }, {
        lower: 75,
        colourClass: "bad",
        variant: "danger",
        tableClass: "table-danger"
    }]
}
export const getRangeClass = (val, range, classType = "variant") => {
    console.log(val)
    const result = dashboardRanges[range].find((x, i) => {
        if (i === 0) {
            return val < (x.threshold || x.upper)
        } else {
            return (val >= x.lower && val < x.upper) || (val >= x.lower && i === dashboardRanges[range].length - 1)
        }
    })
    return result && classType === "all" ? result : result?.[classType] ? result?.[classType] : null;
}
