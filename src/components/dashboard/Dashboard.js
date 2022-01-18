import {useEffect, useRef, useState} from 'react';
import {IoAlarmOutline, IoFlameSharp, IoWarningOutline,} from "react-icons/io5";
import {MdShowChart} from "react-icons/md";
import {HiCheck, HiChevronDoubleDown, HiChevronDoubleUp, HiChevronDown, HiChevronUp,} from "react-icons/hi";
import {BsBoxArrowInRight, BsBoxArrowLeft,} from "react-icons/bs";
import {AiOutlinePercentage} from "react-icons/ai"
import DashboardStatTile from "./DashboardStatTile";
import DashboardActionButton from "./DashboardActionButton";
import Table from "../common/tables/Table";
import 'chart.js/auto';
import {Chart} from 'react-chartjs-2';
import {bootstrapVariables, commonChartOptions} from "../common/styles";
import deepmerge from "deepmerge";
import FormInput from "../common/forms/FormInput";
import useFetch from "../../hooks/useFetch";
import FormLocation from "../common/forms/FormLocation";

class dashboardDataTemplate {
    constructor() {
        this.rates = {
            averageRates: {
                withdraw: 0,
                restock: 0,
                burn: 0,
                douse: 0
            },
            medianWithdraw: 0,
            medianRestock: 0,
            figureArrays: {
                withdraw: [],
                restock: [],
                burn: [],
                douse: [],
            },
            allRates: [],
            ratesById: []
        };
        this.items = {};
        this.itemsStats = {
            outOfStock: 0,
            belowWarningLevel: 0,
            totalStock: 0,
            inStock: 0,
            totalItems: 0,
            stockPercentage: 0
        }
        this.itemsList = [];
        this.itemsRows = [];
        this.tileClasses = {
            stockLevel: "good",
            burnRate: "good",
            outOfStock: "good",
            belowWarningLevel: "good",
        };
        this.chartData = {
            line: {
                data: {inStock: [], warningLevel: [], outOfStock: []},
                labels: []
            },
        }
    }
}

const Dashboard = () => {
    const getRates = useFetch();
    const dashboardLoadedOnce = useRef(false);
    const [dashboardData, setDashboardData] = useState(new dashboardDataTemplate());
    const [dashBoardSettings, setDashBoardSettings] = useState({
        ratePeriod: 90,
        locationId: null,
        locationName: null
    });

    const dashboardRanges = {
        burn: [
            {
                upper: 0.9,
                colourClass: "bad",
                tableClass: "table-danger",
                textClass: "text-danger",
                icon: <HiChevronDoubleDown/>
            },
            {
                lower: 0.9,
                upper: 0.95,
                colourClass: "ok",
                tableClass: "table-warning",
                textClass: "text-warning",
                icon: <HiChevronDown/>
            },
            {
                lower: 0.95,
                upper: 1.05,
                colourClass: "good",
                tableClass: "table-success",
                textClass: "text-success",
                icon: <HiCheck/>
            },
            {
                lower: 1.05,
                upper: 1.1,
                colourClass: "ok",
                tableClass: "table-warning",
                textClass: "text-warning",
                icon: <HiChevronUp/>
            },
            {
                lower: 1.1,
                colourClass: "bad",
                tableClass: "table-danger",
                textClass: "text-danger",
                icon: <HiChevronDoubleUp/>
            },
        ],
        douse: [
            {
                upper: 0.9,
                colourClass: "bad",
                tableClass: "table-danger",
                textClass: "text-danger",
                icon: <HiChevronDoubleDown/>
            },
            {
                lower: 0.9,
                upper: 0.95,
                colourClass: "ok",
                tableClass: "table-warning",
                textClass: "text-warning",
                icon: <HiChevronDown/>
            },
            {
                lower: 0.95,
                upper: 1.05,
                colourClass: "good",
                tableClass: "table-success",
                textClass: "text-success",
                icon: <HiCheck/>
            },
            {
                lower: 1.05,
                upper: 1.1,
                colourClass: "ok",
                tableClass: "table-warning",
                textClass: "text-warning",
                icon: <HiChevronUp/>
            },
            {
                lower: 1.1,
                colourClass: "bad",
                tableClass: "table-danger",
                textClass: "text-danger",
                icon: <HiChevronDoubleUp/>
            },
        ],
        stockLevel: [
            {upper: 0.9, colourClass: "bad", tableClass: "table-danger", textClass: "text-danger"},
            {lower: 0.9, upper: 0.975, colourClass: "ok", tableClass: "table-warning", textClass: "text-warning"},
            {lower: 0.975, colourClass: "good", tableClass: "table-success", textClass: "text-success"},
        ],
        outOfStock: [
            {upper: 0.05, colourClass: "good", tableClass: "table-success"},
            {lower: 0.05, upper: 0.1, colourClass: "ok", tableClass: "table-warning"},
            {lower: 0.1, colourClass: "bad", tableClass: "table-danger"},
        ],
        belowWarningLevel: [
            {upper: 0.15, colourClass: "good", tableClass: "table-success"},
            {lower: 0.15, upper: 0.2, colourClass: "ok", tableClass: "table-warning"},
            {lower: 0.2, colourClass: "bad", tableClass: "table-danger"},
        ]
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
            type: "getRates",
            options: {
                method: "POST",
                body: JSON.stringify(dashBoardSettings)
            },
            dontHandleFeedback: !dashboardLoadedOnce.current,
            callback: (res) => {
                const rateCategories = ["withdraw", "restock", "burn", "douse"];
                const newDashboardData = new dashboardDataTemplate();
                res.rateData.forEach((x) => {
                        const rateDataForId = {
                            itemId: x.itemId,
                            days: x.days || 0,
                            unit: x.unit,
                            totalRestocked: x.restocked || 0,
                            totalWithdrawn: Math.abs(x.withdrawn) || 0,
                            withdrawRate: Number(x.withdrawRate || 0),
                            restockRate: Number(x.restockRate || 0),
                            burnRate: Number(x.burnRate || x.withdrawRate || 0),
                            douseRate: Number(x.douseRate || x.restockRate || 0)
                        };
                        newDashboardData.rates.allRates.push(rateDataForId);
                        newDashboardData.rates.ratesById[x.itemId] = rateDataForId;
                        rateCategories.forEach((x) => {
                            if (rateDataForId[x + "Rate"]) {
                                newDashboardData.rates.figureArrays[x].push(rateDataForId[x + "Rate"]);
                            }
                        });
                        const newItemData = {
                            ...x,
                            id: x.itemId,
                            stockString: `${x.currentStock} ${x.unit}`,
                            outOfStock: x.currentStock === 0,
                            belowWarningLevel: x.currentStock <= x.warningLevel,
                            stockPercentage: x.currentStock / (x.warningLevel || 1),
                            roundedStockPercentage: Math.min(x.currentStock / (x.warningLevel || 1), 1),
                            burnRate: rateDataForId.burnRate,
                            douseRate: rateDataForId.douseRate,
                            withdrawRate: rateDataForId.withdrawRate,
                            restockRate: rateDataForId.restockRate
                        };
                        newDashboardData.itemsStats.totalStock += newItemData.currentStock;
                        newDashboardData.itemsStats.inStock += (newItemData.outOfStock || newItemData.belowWarningLevel) ? 0 : 1;
                        newDashboardData.itemsStats.outOfStock += newItemData.outOfStock ? 1 : 0;
                        newDashboardData.itemsStats.belowWarningLevel += newItemData.belowWarningLevel ? 1 : 0;
                        newDashboardData.items[x.itemId] = newItemData;
                        newDashboardData.itemsList.push(newItemData);
                        const newItemDataClasses = {
                            burn: getRangeClass(newItemData.burnRate, dashboardRanges.burn, "all"),
                            douse: getRangeClass(newItemData.douseRate, dashboardRanges.douse, "all"),
                            stockPercentage: getRangeClass(newItemData.stockPercentage, dashboardRanges.stockLevel, "all")
                        }
                        if (newItemData.currentStock) {
                            const daysUOOS = Math.floor(newItemData.daysUntilOutOfStock);
                            const daysUBWL = Math.floor(newItemData.daysUntilBelowWarningLevel);
                            newDashboardData.itemsRows.push([newItemData.name, {
                                text: newItemData.stockString,
                                className: `${newItemData.currentStock === 0 ? "text-danger" : newItemData.belowWarningLevel ? "text-warning" : null}`
                            },
                                {
                                    text: ((newItemData.roundedStockPercentage) * 100).toFixed(newItemData.roundedStockPercentage < 0.1 ? 1 : 0) + "%",
                                    sortValue: Math.min((newItemData.currentStock / newItemData.warningLevel), 1),
                                    className: "dashboardStockTableCell " + newItemDataClasses.stockPercentage.textClass
                                },
                                newItemData.burnRate ?
                                    {
                                        text: <><span
                                            className={newItemDataClasses.burn.textClass + " me-1"}>{newItemDataClasses.burn.icon}</span>{newItemData.burnRate.toFixed(3)}</>,
                                        sortValue: newItemData.burnRate,
                                        className: "dashboardStockTableCell"
                                    } : {
                                        className: "table-light",
                                        sortValue: 0
                                    },

                                newItemData.belowWarningLevel ?
                                    {
                                        text: `${daysUOOS} day${daysUOOS !== 1 ? "s" : ""}`,
                                        sortValue: daysUOOS,
                                        className: `dashboardStockTableCell ${newItemData.daysUntilOutOfStock > 7 ? "text-warning" : "text-danger"}`
                                    } : {
                                        text: `${daysUBWL} day${daysUOOS !== 1 ? "s" : ""}`,
                                        sortValue: daysUBWL,
                                        className: `dashboardStockTableCell ${newItemData.daysUntilOutOfStock > 7 ? "text-success" : "text-warning"}`
                                    }])
                        }
                    }
                )
                newDashboardData.itemsStats.stockPercentage = newDashboardData.itemsList.reduce((a, b) => a + b.roundedStockPercentage, 0) / newDashboardData.itemsList.length;
                rateCategories.forEach((x) => {
                        newDashboardData.rates.averageRates[x] = (newDashboardData.rates.figureArrays[x].reduce((a, b) => {
                            return (a || 0) + (b || 0);
                        }, 0) / newDashboardData.rates.figureArrays[x].length);
                    }
                );
                newDashboardData.tileClasses.burnRate = getRangeClass(newDashboardData.rates.averageRates.burn, dashboardRanges.burn)
                newDashboardData.tileClasses.outOfStock = getRangeClass(newDashboardData.itemsStats.outOfStock / newDashboardData.itemsList.length, dashboardRanges.outOfStock)
                newDashboardData.tileClasses.belowWarningLevel = getRangeClass(newDashboardData.itemsStats.belowWarningLevel / newDashboardData.itemsList.length, dashboardRanges.belowWarningLevel)
                newDashboardData.tileClasses.stockLevel = getRangeClass(newDashboardData.itemsStats.stockPercentage, dashboardRanges.stockLevel);
                res.chartData?.forEach((y) => {
                        newDashboardData.chartData.line.labels.push(new Date(y.date).toLocaleDateString("default", {weekday: "short"}));
                        let outOfStockOnThisDate = 0;
                        let belowWarningLevelOnThisDate = 0;
                        res.chartItemData.filter(el => el.date === y.date).forEach((el) => {
                            outOfStockOnThisDate += el.stockOnDate === 0 ? 1 : 0;
                            belowWarningLevelOnThisDate += el.stockOnDate !== 0 && el.stockOnDate <= newDashboardData.items[el.itemId]?.warningLevel ? 1 : 0;
                        })
                        newDashboardData.chartData.line.data.outOfStock.push(outOfStockOnThisDate);
                        newDashboardData.chartData.line.data.warningLevel.push(belowWarningLevelOnThisDate);
                        newDashboardData.chartData.line.data.inStock.push(newDashboardData.itemsList.length - (outOfStockOnThisDate + belowWarningLevelOnThisDate));
                    }
                );
                setDashboardData(newDashboardData);
                if (!dashboardLoadedOnce.current) {
                    dashboardLoadedOnce.current = true;
                }
            }
        })
    }, [dashBoardSettings]);

    return (
        <div className="container">
            <div className="row my-3 gy-3">
                <DashboardStatTile title={"Mean stock"}
                                   number={dashboardData.itemsStats.stockPercentage ? (Math.round(dashboardData.itemsStats.stockPercentage * 1000) / 10).toFixed(dashboardData.itemsStats.stockPercentage < 0.1 ? 1 : 0) + "%" : "N/A"}
                                   colourClass={dashboardData.tileClasses.stockLevel}
                                   icon={<MdShowChart/>}/>
                <DashboardStatTile title={"Burn rate"}
                                   number={dashboardData.rates.averageRates.burn ? (dashboardData.rates.averageRates.burn.toFixed(dashboardData.rates.averageRates.burn >= 10 ? 1 : 2)) : "N/A"}
                                   colourClass={dashboardData.tileClasses.burnRate}
                                   icon={<IoFlameSharp/>}/>
                <DashboardStatTile title={"Out of stock"}
                                   number={dashboardData.itemsStats.outOfStock === 0 ? 0 : dashboardData.itemsStats.outOfStock || "N/A"}
                                   colourClass={dashboardData.tileClasses.outOfStock}
                                   icon={<IoWarningOutline/>}/>
                <DashboardStatTile title={"Restock due"}
                                   number={dashboardData.itemsStats.belowWarningLevel === 0 ? 0 : dashboardData.itemsStats.belowWarningLevel || "N/A"}
                                   colourClass={dashboardData.tileClasses.belowWarningLevel}
                                   icon={<IoAlarmOutline/>}/>
            </div>
            <div className="row my-3 gy-3">
                <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center justify-content-center rounded bg-light px-3 py-2"
                         style={{height: "15rem"}}>
                        <Chart type={"line"}
                               data={{
                                   datasets: [{
                                       label: "Fully in stock",
                                       data: dashboardData.chartData.line.data.inStock,
                                       backgroundColor: bootstrapVariables.green,
                                       borderColor: bootstrapVariables.green
                                   }, {
                                       label: "Below warning level",
                                       data: dashboardData.chartData.line.data.warningLevel,
                                       backgroundColor: bootstrapVariables.yellow,
                                       borderColor: bootstrapVariables.yellow
                                   }, {
                                       label: "Out of stock",
                                       data: dashboardData.chartData.line.data.outOfStock,
                                       backgroundColor: bootstrapVariables.red,
                                       borderColor: bootstrapVariables.red
                                   }],
                                   labels: dashboardData.chartData.line.labels
                               }}
                               options={deepmerge(commonChartOptions, {
                                   elements: {
                                       line: {tension: 0.35, capBezierPoints: false},
                                       point: {radius: 1, hitRadius: 10, hoverRadius: 4}
                                   },
                                   scales: {
                                       x: {grid: {display: false}}, y: {
                                           afterDataLimits(scale) {
                                               const grace = (scale.max - scale.min) * 0.05;
                                               scale.max += grace;
                                               scale.min -= grace;
                                           }
                                       }
                                   }
                               })}/>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center justify-content-center rounded bg-light px-3 py-2"
                         style={{height: "15rem"}}>
                        <Chart type={"doughnut"} data={{
                            datasets: [{
                                data: [dashboardData.itemsStats.inStock, dashboardData.itemsStats.belowWarningLevel, dashboardData.itemsStats.outOfStock],
                                backgroundColor: [bootstrapVariables.green, bootstrapVariables.yellow, bootstrapVariables.red],
                                borderColor: bootstrapVariables.light
                            }],
                            labels: ["Fully in stock",
                                "Below warning level",
                                "Out of stock"]
                        }} options={{maintainAspectRatio: false, cutout: 75, plugins: {legend: {display: false}}}}/>
                    </div>
                </div>
            </div>
            <div className="row my-3">
                <div className="col">
                    <div className="d-flex align-items-center justify-content-center">
                        <Table headers={["Name", "Current stock", <AiOutlinePercentage/>, "Burn rate", "Restock in"]}
                               defaultSortDirection="desc"
                               defaultSortHeading={"Burn rate"}
                               rows={dashboardData.itemsRows}
                               length={5}
                               showPaginationButtons={false}
                               fullWidth
                        />
                    </div>
                </div>
            </div>
            <div className="row my-3 gy-3 align-items-center">
                <div className={"col col-12 col-md-3"}>
                    <DashboardActionButton
                        text={"Withdraw"}
                        icon={<BsBoxArrowLeft/>}
                        colour={"btn-outline-primary"}
                        type={"link"}
                        link={"/withdraw"}
                    />
                </div>
                <div className={"col col-12 col-md-3"}>
                    <DashboardActionButton
                        text={"Restock"}
                        icon={<BsBoxArrowInRight/>}
                        colour={"btn-outline-primary"}
                        type={"link"}
                        link={"/restock"}
                    />
                </div>
                <div className={"col col-12 col-md-3"}>
                    <FormInput type={"number"} label={"Period (days)"}
                               value={dashBoardSettings.ratePeriod}
                               onChange={(id, val) => {
                                   setDashBoardSettings({...dashBoardSettings, ratePeriod: val})
                               }}/>
                </div>
                <div className={"col col-12 col-md-3"}>
                    <FormLocation
                        id="inputDashboardLocation"
                        onChange={(e) => {
                            setDashBoardSettings({
                                    ...dashBoardSettings,
                                    locationId: e[0]?.id || null,
                                    locationName: e[0]?.name || null,
                                }
                            )
                        }
                        }/>
                </div>
            </div>
        </div>
    );
};

Dashboard.propTypes =
    {}
;

export default Dashboard;
