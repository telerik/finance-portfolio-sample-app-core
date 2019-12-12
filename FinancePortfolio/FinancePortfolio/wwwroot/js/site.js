// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
const symbols = { USD: "$", EUR: "€", GBP: "£" }

function onCurrencyChange(e) {
    if (document.location.pathname == "/Home/DataVirtualization") {
        $("#stocksGrid").getKendoGrid().refresh();
    }
    if (document.location.pathname == "/") {
        $("#Grid").getKendoGrid().dataSource.read();
    }
}

function additionalData(e) {
    var ddl = $("#currency").getKendoDropDownList()
    var ddlValue = ddl.value();
    var dataItem = ddl.dataItem(ddlValue - 1);

    return {
        currency: dataItem.Text
    }
}

function priceTemplate(dataItem) {
    var color = dataItem.DayChange == 0 ? "none" : (dataItem.DayChange > 0 ? "green" : "red");
    var fade = dataItem.DayChange == 0 ? '' : "class='price-change'";
    var selected = $("#currency").getKendoDropDownList().select();
    var currency = $("#currency").getKendoDropDownList().dataItem(selected).Text;
    var currencySymbol = symbols[currency];

    return "<span " + fade + " style='color: " + color + "'>" + currencySymbol + ' ' + kendo.toString(dataItem.Price, "0.00") + "</span>";
}

function changeTemplate(dataItem) {
    var color = dataItem.DayChange == 0 ? "none" : (dataItem.DayChange > 0 ? "green" : "red");
    var fade = dataItem.DayChange == 0 ? '' : "class='price-change'";

    return "<span " + fade + "style='color: " + color + "'>" + kendo.toString(dataItem.DayChange, "0.00") + "%</span>";
}

function stockCurrencyTemplate(dataItem){
    var selected = $("#currency").getKendoDropDownList().select();
    var currency = $("#currency").getKendoDropDownList().dataItem(selected).Text;

    return currency;
}

function currencyTemplate(data) {
    var currency = $("#currency").data("kendoDropDownList").value();
    return currency == 1 ? kendo.toString(data.Price, "$###.##") : (currency == 2 ? kendo.toString(data.Price, "€###.##") : kendo.toString(data.Price, "£###.##"))
}

function dayChangeTemplate(data) {
    var color = data.DayChange == 0 ? "none" : (data.DayChange > 0 ? "green" : "red");
    return "<span  style='color: " + color + "'>" + kendo.toString(data.DayChange, "0.00") + "</span>";
}
function dayChangePctTemplate(data) {
    var color = data.ChangePct == 0 ? "none" : (data.ChangePct > 0 ? "green" : "red");
    return "<span style='color: " + color + "'>" + kendo.toString(data.ChangePct, "0.00") + "%</span>";
}



function numbersTemplate(data, fieldName) {

    return formatCurrency(data[fieldName])
}

function formatCurrency (value) {
    if (value >= 1000000000) {
        return (value / 1000000000).toFixed(3) + 'B';
    }

    if (value >= 1000000) {
        return (value / 1000000).toFixed(3) + 'M';
    }

    if (value >= 1000) {
        return (value / 1000).toFixed(3) + 'K';
    }

    return value;
};


function onProfileClick() {
    window.location.href = '/Home/Profile';
}
function additionalChartData() {
    return {
        symbol: "AAN",
        start: new Date(2019, 7, 10).toUTCString(),
        end: new Date(2019, 7, 14).toUTCString(),
        interval: 15
    }
}

function showDeletBttnOnChange() {
    var grid = $("#Grid").data("kendoGrid");
    var row = grid.select();
    return row.hasClass("k-state-selected") ? $("#removeButton").css("visibility", "visible") : $("#removeButton").css("visibility", "hidden");
}
function closeProfile() {
    window.location.href = '/Home';
}

function handleRangeChange() {
    var range = this.range();
}

function onIntervalDDLDataBound(e) {
    var defaultItem = e.sender.dataSource.at(3);
    e.sender.value(defaultItem.Interval);
}

function changeChartType() {
    var dropdownlist = $("#dropdownChartSelection").data("kendoDropDownList");
    var selectedValue = dropdownlist.value()
    var chart = $("#stockChart").data("kendoStockChart");
    console.log("chart", chart)
    if (selectedValue == "line") {
        chart.setOptions(
            {
                type: "line",
                series: [{
                    type: "line",
                    field: "Open",
                    categoryField: "Date",
                    color: "#2D73F5"
                }],
                seriesDefaults: {
                    type: "line"
                },
                navigator: {
                    series: {
                        color: "#559DE0"
                    }
                }
            })
    }
    if (selectedValue == "area") {
        chart.setOptions(
            {
                type: "area",
                series: [{
                    type: "area",
                    field: "Open",
                    categoryField: "Date",
                    color: "#007BFF"
                }],
                seriesDefaults: {
                    type: "area"
                },
                navigator: {
                    series: {
                        color: "#559DE0"
                    }
                }
            })
    }
    if (selectedValue == "candle") {
        chart.setOptions(
            {
                type: "candle",
                series: [{
                    type: "candlestick",
                    color: "#5CB85C",
                    downColor: "#D9534F",
                    openField: "Open",
                    highField: "High",
                    lowField: "Low",
                    closeField: "Close",
                    categoryField: "Date"
                }],
                navigator: {
                    series: {
                        color: "#559DE0"
                    }
                }
            })
    }

}