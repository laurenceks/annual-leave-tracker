import {useContext, useEffect, useRef, useState} from 'react';
import {HiCheck, HiChevronDoubleDown, HiChevronDoubleUp, HiChevronDown, HiChevronUp,} from "react-icons/hi";
import DashboardStatTile from "./DashboardStatTile";
import Table from "../common/tables/Table";
import 'chart.js/auto';
import {Chart} from 'react-chartjs-2';
import {bootstrapVariables, commonChartOptions} from "../common/styles";
import useFetch from "../../hooks/useFetch";
import {GlobalAppContext} from "../../App";
import {IoBarChartSharp, IoBasketSharp, IoBatteryHalfSharp, IoBookmarksSharp} from "react-icons/io5";
import setCase from "../../functions/setCase";
import deepmerge from "deepmerge";
import FormPeriod from "../common/forms/FormPeriod";

class dashboardDataTemplate {
    constructor() {
        this.allocation = {
            total: null,
            taken: null,
            remaining: null,
            booked: null
        }
        this.chartData = {
            chartMonths: {
                data: [],
                labels: []
            },
            chartHours: {
                data: [],
                labels: []
            },
        }
    }
}

const Dashboard = () => {
    const getRates = useFetch();
    const dashboardLoadedOnce = useRef(false);
    const user = useContext(GlobalAppContext)[0].user;
    const [dashboardData, setDashboardData] = useState(new dashboardDataTemplate());
    const [dashBoardSettings, setDashBoardSettings] = useState({
        periodId: null,
        period: null,
        selectedPeriod: [],
        manualChange: null
    });

    const dashboardRanges = {
        burn: [{
            upper: 0.9,
            colourClass: "bad",
            tableClass: "table-danger",
            textClass: "text-danger",
            icon: <HiChevronDoubleDown/>
        }, {
            lower: 0.9,
            upper: 0.95,
            colourClass: "ok",
            tableClass: "table-warning",
            textClass: "text-warning",
            icon: <HiChevronDown/>
        }, {
            lower: 0.95,
            upper: 1.05,
            colourClass: "good",
            tableClass: "table-success",
            textClass: "text-success",
            icon: <HiCheck/>
        }, {
            lower: 1.05,
            upper: 1.1,
            colourClass: "ok",
            tableClass: "table-warning",
            textClass: "text-warning",
            icon: <HiChevronUp/>
        }, {
            lower: 1.1,
            colourClass: "bad",
            tableClass: "table-danger",
            textClass: "text-danger",
            icon: <HiChevronDoubleUp/>
        },],
        douse: [{
            upper: 0.9,
            colourClass: "bad",
            tableClass: "table-danger",
            textClass: "text-danger",
            icon: <HiChevronDoubleDown/>
        }, {
            lower: 0.9,
            upper: 0.95,
            colourClass: "ok",
            tableClass: "table-warning",
            textClass: "text-warning",
            icon: <HiChevronDown/>
        }, {
            lower: 0.95,
            upper: 1.05,
            colourClass: "good",
            tableClass: "table-success",
            textClass: "text-success",
            icon: <HiCheck/>
        }, {
            lower: 1.05,
            upper: 1.1,
            colourClass: "ok",
            tableClass: "table-warning",
            textClass: "text-warning",
            icon: <HiChevronUp/>
        }, {
            lower: 1.1,
            colourClass: "bad",
            tableClass: "table-danger",
            textClass: "text-danger",
            icon: <HiChevronDoubleUp/>
        },],
        stockLevel: [{
            upper: 0.9,
            colourClass: "bad",
            tableClass: "table-danger",
            textClass: "text-danger"
        }, {
            lower: 0.9,
            upper: 0.975,
            colourClass: "ok",
            tableClass: "table-warning",
            textClass: "text-warning"
        }, {
            lower: 0.975,
            colourClass: "good",
            tableClass: "table-success",
            textClass: "text-success"
        },],
        outOfStock: [{
            upper: 0.05,
            colourClass: "good",
            tableClass: "table-success"
        }, {
            lower: 0.05,
            upper: 0.1,
            colourClass: "ok",
            tableClass: "table-warning"
        }, {
            lower: 0.1,
            colourClass: "bad",
            tableClass: "table-danger"
        },],
        belowWarningLevel: [{
            upper: 0.15,
            colourClass: "good",
            tableClass: "table-success"
        }, {
            lower: 0.15,
            upper: 0.2,
            colourClass: "ok",
            tableClass: "table-warning"
        }, {
            lower: 0.2,
            colourClass: "bad",
            tableClass: "table-danger"
        },]
    }

    const getRangeClass = (val, range, classType = "colourClass") => {
        const result = range.find((x, i) => {
            if (i === 0) {
                return val < (x.threshold || x.upper)
            } else {
                return (val >= x.lower && val < x.upper) || (val >= x.lower && i === range.length - 1)
            }
        })
        return result && classType === "all" ? result : result?.[classType] ? result?.[classType] : null;
    }

    useEffect(() => {
        getRates({
            type: "getDashboardData",
            options: {
                method: "POST",
                body: JSON.stringify(dashBoardSettings)
            },
            dontHandleFeedback: !dashboardLoadedOnce.current,
            callback: (res) => {
                const newDashboardData = {
                    allocation: {
                        ...res.allocation,
                        remaining: res.allocation.total ? res.allocation.total - res.allocation.booked : "N/A"
                    },
                    bookings: res.bookings.map(
                        (x) => [x.dateFrom, x.dateTo, x.hours, setCase(x.status, "capitalise"), x.userComments || {
                            className: "table-light",
                            sortValue: 0
                        }, x.managerComments || {
                            className: "table-light",
                            sortValue: ""
                        }]),
                    chartData: {
                        chartMonths: {
                            data: {
                                booked: res.chartData.chartMonths.map((x) => x.hours),
                                requested: res.chartData.chartMonths.map((x) => x.requested),
                                taken: res.chartData.chartMonths.map((x) => x.taken),
                                denied: res.chartData.chartMonths.map((x) => x.denied),
                                approved: res.chartData.chartMonths.map((x) => x.approved),
                            },
                            labels: res.chartData.chartMonths.map((x) => x.month.substr(0, 3))
                        },
                        chartHours: {
                            data: res.chartData.chartHours.map((x) => x.hours),
                            labels: res.chartData.chartHours.map((x) => x.label)
                        }
                    }
                }
                if (res.period?.defaultedToCurrent) {
                    setDashBoardSettings(prevState => ({
                        selectedPeriod: [res.period],
                        period: res.period,
                        periodId: res.period.id,
                        manualChange: prevState.manualChange
                    }))
                }
                setDashboardData(newDashboardData);
                if (!dashboardLoadedOnce.current) {
                    dashboardLoadedOnce.current = true;
                }
            }
        })
    }, [dashBoardSettings.manualChange]);

    return (<div className="container">

        <div className="row my-3 gy-3 flex-row-reverse ">
            <div className="col-12 col-md-6 gy-3 d-flex align-items-center">
                <div>
                    <h1 className="display-3 fw-bolder">Hi, {user.firstName}!</h1>
                    <h2 className="display-6">Welcome to your annual leave tracker account</h2>
                </div>
            </div>
            <div className="col-12 col-md-6 gy-3">
                <div className="row gy-3">
                    <DashboardStatTile title={"Total"}
                                       number={dashboardData.allocation.total || "N/A"}
                                       colourClass={dashboardData.allocation.total ? "good" : "null"}
                                       icon={<IoBarChartSharp/>}/>
                    <DashboardStatTile title={"Left"}
                                       number={dashboardData.allocation.remaining || "N/A"}
                                       colourClass={dashboardData.allocation.remaining ? "good" : "null"}
                                       icon={<IoBatteryHalfSharp/>}/>
                    <DashboardStatTile title={"Booked"}
                                       number={dashboardData.allocation.booked || 0}
                                       colourClass={dashboardData.allocation.booked ? "ok" : "good"}
                                       icon={<IoBookmarksSharp/>}/>
                    <DashboardStatTile title={"Taken"}
                                       number={dashboardData.allocation.taken || 0}
                                       colourClass={dashboardData.allocation.taken ? "bad" : "good"}
                                       icon={<IoBasketSharp/>}/>
                </div>
            </div>
        </div>
        <div className="row my-3 gy-3">
            <div className="col col-12 col-md-6">
                <div className="d-flex align-items-center justify-content-center rounded bg-light shadow px-3 py-2"
                     style={{height: "15rem"}}>
                    <Chart type={"bar"}
                           data={{
                               labels: dashboardData.chartData.chartMonths.labels,
                               datasets: [{
                                   data: dashboardData.chartData.chartMonths.data.requested,
                                   backgroundColor: bootstrapVariables.warning,
                                   label: "Requested"
                               }, {
                                   data: dashboardData.chartData.chartMonths.data.approved,
                                   backgroundColor: bootstrapVariables.success,
                                   label: "Approved"
                               }, {
                                   data: dashboardData.chartData.chartMonths.data.taken,
                                   backgroundColor: bootstrapVariables.danger,
                                   label: "Taken"
                               }]
                           }}
                           options={deepmerge(commonChartOptions, {
                               scales: {
                                   y: {
                                       grid: {display: false},
                                       stacked: true
                                   },
                                   x: {
                                       grid: {display: false},
                                       stacked: true
                                   }
                               }
                           })}/>
                </div>
            </div>
            <div className="col col-12 col-md-6">
                <div className="d-flex align-items-center justify-content-center rounded bg-light shadow px-3 py-2"
                     style={{height: "15rem"}}>
                    <Chart type={"doughnut"}
                           data={{
                               datasets: [{
                                   data: dashboardData.chartData.chartHours.data,
                                   backgroundColor: [bootstrapVariables.green,
                                       bootstrapVariables.yellow,
                                       bootstrapVariables.red,
                                       bootstrapVariables.gray],
                                   borderColor: bootstrapVariables.light,
                               }],
                               labels: dashboardData.chartData.chartHours.labels
                           }}
                           options={{
                               maintainAspectRatio: false,
                               cutout: 75,
                               plugins: {legend: {display: false}}
                           }}/>
                </div>
            </div>

        </div>
        <div className="row gy-3 mt-3">
            <div className="col col-12">
                <h3>{user.firstName}'s bookings</h3>
            </div>
            <div className="col col-12 col-md-3">
                <FormPeriod
                    className={"w-auto"}
                    selected={dashBoardSettings.selectedPeriod}
                    onChange={(e) => {
                        console.log(e)
                        setDashBoardSettings({
                            ...dashBoardSettings,
                            selectedPeriod: e,
                            period: e[0] || null,
                            periodId: e.length === 0 ? null : e[0].id,
                            manualChange: e[0] ? Date.now() : dashBoardSettings.manualChange
                        })
                    }}
                    onBlur={(e, i, t) => {
                        setDashBoardSettings({
                            ...dashBoardSettings,
                            manualChange: dashBoardSettings.period ? dashBoardSettings.manualChange : Date.now()
                        })
                    }}/>
            </div>
            <div className=" col col-12">
                <Table headers={["From", "To", "Hours", "Status", "User comments", "Manager comments"]}
                       defaultSortDirection="desc"
                       defaultSortHeading={"Burn rate"}
                       rows={dashboardData.bookings}
                       length={5}
                       showPaginationButtons={false}
                       fullWidth
                /></div>
        </div>
    </div>);
};

Dashboard.propTypes = {};

export default Dashboard;
