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

class addDataTemplate {
    constructor() {
        this.name = "";
        this.unit = [];
        this.warningLevel = 5;
    }
}

class transactionDataTemplate {
    constructor(type = "item") {
        this.withdrawType = type;
        this.id = null;
        this.name = "";
        this.selected = [];
        this.quantity = 0;
        this.displayQuantity = "";
        this.unit = "";
    }
}

export {dashboardDataTemplate, addDataTemplate, transactionDataTemplate};
