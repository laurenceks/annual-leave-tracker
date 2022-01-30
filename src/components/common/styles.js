import {IoCheckmarkCircleOutline, IoCloseCircleOutline, IoWarningOutline} from "react-icons/io5";

const computedStyle = getComputedStyle(document.documentElement, null);
const bootstrapColourNames = ["--bs-blue",
    "--bs-indigo",
    "--bs-purple",
    "--bs-pink",
    "--bs-red",
    "--bs-orange",
    "--bs-yellow",
    "--bs-green",
    "--bs-teal",
    "--bs-cyan",
    "--bs-white",
    "--bs-gray",
    "--bs-gray-dark",
    "--bs-primary",
    "--bs-secondary",
    "--bs-success",
    "--bs-info",
    "--bs-warning",
    "--bs-danger",
    "--bs-light",
    "--bs-dark",
    "--bs-font-sans-serif",
    "--bs-font-monospace",
    "--bs-gradient"]
const bootstrapVariables = {};
bootstrapColourNames.forEach((x) => {
    bootstrapVariables[x.replace("--bs-", "")] = computedStyle.getPropertyValue(x);
});

const themeOptions = {
    warning: "#e99002",
    amber: "#e99002",
    danger: "#f04124",
    red: "#f04124",
    success: "#43ac6a",
    green: "#43ac6a",
    primary: "#008cba",
    secondary: "#eeeeee",
    light: "#eeeeee",
    dark: "#222222",
    "font-sans-serif": `"Open Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`
}

const variantPairings = {
    success: {
        icon: IoCheckmarkCircleOutline,
        text: "text-white",
        bg: "bg-success",
    },
    warning: {
        icon: IoWarningOutline,
        text: "text-black",
        bg: "bg-warning"
    },
    danger: {
        icon: IoCloseCircleOutline,
        text: "text-white",
        bg: "bg-danger",
    },
    primary: {
        icon: IoCloseCircleOutline,
        text: "text-white",
        bg: "bg-primary",
    }
}

const statusCells = {
    approved: "table-success",
    requested: "table-warning",
    denied: "table-danger",
    expired: "table-light",
    default: "table-light",
}

Object.keys(variantPairings).forEach(x => {
    variantPairings[x].header = `${variantPairings[x].bg || ""} ${variantPairings[x].text || ""}`
    variantPairings[x].button = `btn-${x} ${variantPairings[x].text || ""}`
})

const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
            labels: {
                font: {
                    family: themeOptions["font-sans-serif"],
                    color: themeOptions.dark
                }
            }
        }
    },
    scales: {
        x: {
            ticks: {
                font: {
                    family: themeOptions["font-sans-serif"],
                    color: themeOptions.dark
                }
            }
        },
        y: {
            ticks: {
                font: {
                    family: themeOptions["font-sans-serif"],
                    color: themeOptions.dark
                }
            }
        }
    }
}

export {themeOptions, bootstrapVariables, commonChartOptions, variantPairings, statusCells};