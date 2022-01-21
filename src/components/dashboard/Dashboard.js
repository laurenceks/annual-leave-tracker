import {useContext, useEffect, useRef, useState} from 'react';
import DashboardStatTile from "./DashboardStatTile";
import Table from "../common/tables/Table";
import 'chart.js/auto';
import {Chart} from 'react-chartjs-2';
import {themeOptions, commonChartOptions, statusCells} from "../common/styles";
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
        this.allocationPercentages = {
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
        remaining: [{
            upper: 25,
            colourClass: "bad",
            tableClass: "table-danger",
            textClass: "text-danger"
        }, {
            lower: 25,
            upper: 50,
            colourClass: "ok",
            tableClass: "table-warning",
            textClass: "text-warning"
        }, {
            lower: 75,
            colourClass: "good",
            tableClass: "table-success",
            textClass: "text-success"
        },],
        bookedTaken: [{
            upper: 25,
            colourClass: "good",
            tableClass: "table-success"
        }, {
            lower: 25,
            upper: 75,
            colourClass: "ok",
            tableClass: "table-warning"
        }, {
            lower: 75,
            colourClass: "bad",
            tableClass: "table-danger"
        }]
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
                let newDashboardData = {}
                if (!res.noPeriod) {
                    newDashboardData = {
                        allocation: {
                            ...res.allocation,
                            remaining: res.allocation.total ? res.allocation.total - res.allocation.booked : "N/A",
                        },
                        bookings: res.bookings.map((x) => [x.dateFrom, x.dateTo, x.hours, {
                            text: setCase(x.status, "capitalise"),
                            className: statusCells[x.status]
                        }, x.userComments || {
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
                    newDashboardData.allocationPercentages = {
                        remaining: res.allocation.total ?
                            newDashboardData.allocation.remaining / res.allocation.total * 100 :
                            100,
                        taken: res.allocation.total ?
                            newDashboardData.allocation.taken / res.allocation.total * 100 :
                            100,
                    }
                    newDashboardData.allocationPercentages.booked =
                        100 - newDashboardData.allocationPercentages.remaining;
                    if (res.period?.defaultedToCurrent) {
                        setDashBoardSettings(prevState => ({
                            selectedPeriod: [res.period],
                            period: res.period,
                            periodId: res.period.id,
                            manualChange: prevState.manualChange
                        }))
                    }
                }else{
                    newDashboardData = new dashboardDataTemplate();
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
                                       colourClass={dashboardData.allocation.total ?
                                           getRangeClass(dashboardData.allocationPercentages.remaining,
                                               dashboardRanges.remaining) :
                                           "null"}
                                       icon={<IoBatteryHalfSharp/>}/>
                    <DashboardStatTile title={"Booked"}
                                       number={dashboardData.allocation.booked || 0}
                                       colourClass={dashboardData.allocation.booked ?
                                           getRangeClass(dashboardData.allocationPercentages.booked,
                                               dashboardRanges.bookedTaken) :
                                           "good"}
                                       icon={<IoBookmarksSharp/>}/>
                    <DashboardStatTile title={"Taken"}
                                       number={dashboardData.allocation.taken || 0}
                                       colourClass={dashboardData.allocation.taken ?
                                           getRangeClass(dashboardData.allocationPercentages.taken,
                                               dashboardRanges.bookedTaken) :
                                           "good"}
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
                                   backgroundColor: themeOptions.warning,
                                   label: "Requested"
                               }, {
                                   data: dashboardData.chartData.chartMonths.data.approved,
                                   backgroundColor: themeOptions.success,
                                   label: "Approved"
                               }, {
                                   data: dashboardData.chartData.chartMonths.data.taken,
                                   backgroundColor: themeOptions.danger,
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
                <div className="d-flex position-relative align-items-center justify-content-center rounded bg-light shadow px-3 py-2"
                     style={{height: "15rem"}}>
                    <div className="d-flex position-absolute text-center">
                        {(dashboardData.allocation.total && dashboardData.allocation.booked) ? <div>
                            <p className="m-0 display-6">{dashboardData.allocationPercentages.remaining.toFixed(1)}%</p>
                            <p className="position-absolute w-100">Remaining</p>
                        </div> : ""}
                    </div>
                    <Chart type={"doughnut"}
                           data={{
                               datasets: [{
                                   data: dashboardData.chartData.chartHours.data,
                                   backgroundColor: [themeOptions.success,
                                       themeOptions.warning,
                                       themeOptions.danger,
                                       themeOptions.light],
                                   borderColor: themeOptions.light,
                               }],
                               labels: dashboardData.chartData.chartHours.labels
                           }}
                           options={{
                               maintainAspectRatio: false,
                               cutout: 75,
                               plugins: {legend: {display: false}}
                           }}
                           className="position-relative"
                    />
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
