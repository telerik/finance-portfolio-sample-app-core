// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
const symbols = { USD: "$", EUR: "€", GBP: "£" }
const MS_PER_DAY = 86400000; /*60 * 60 * 24 * 1000*/;
var timeFilters = [
    { Name: "1H", Duration: MS_PER_DAY / 24 },
    { Name: "4H", Duration: MS_PER_DAY / 6 },
    { Name: "12H", Duration: MS_PER_DAY / 2 },
    { Name: "1D", Duration: MS_PER_DAY },
    { Name: "4D", Duration: MS_PER_DAY * 4 },
    { Name: "1W", Duration: MS_PER_DAY * 7 }
];
var prevItemValue;
const toMins = 60000;


function onCurrencyChange() {
    if (document.location.pathname.endsWith("/Home/DataVirtualization")) {
        $("#stocksGrid").getKendoGrid().refresh();
    }
    if (document.location.pathname == "/") {
        $("#Grid").getKendoGrid().dataSource.read();
    }
}

function additionalData() {
    var ddl = $("#currency").getKendoDropDownList();
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

function stockCurrencyTemplate(){
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
    return formatCurrency(data[fieldName]);
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

function additionalChartData() {
    var start, end, grid, interval;
    var range = $("#daterangepicker").getKendoDateRangePicker().range();
    interval = ($("#interval").getKendoDropDownList().value() / toMins) || 60;
    console.log("interval", interval)

    if ($("#timeFilter li span").hasClass("selected")) {
        var fixedRangeIndex = $("#timeFilter li span.selected").index()
        var duration = timeFilters[fixedRangeIndex].Duration / toMins;
    }

    if (!range) {
        end = new Date();
        start = new Date();
        start.setMinutes(end.getMinutes() - duration);
        console.log("no range")

    }
    else {
        start = range.start;
        end = range.end;
        console.log("initialstart", start)
        console.log("initialend", end)
    }

    grid = $("#Grid").getKendoGrid()
    if (grid.select().length) {
        var row = grid.select();
        var symbol = grid.dataItem(row).Symbol;
    }

    console.log("start", start)
    console.log("end", end)
    console.log("refresh range", range)
    console.log("interval". interval)
    debugger;
    return {
        symbol: symbol,
        start: start,
        end: end,
        interval: interval
    }

}

function showDeletBttnOnChange() {
    var chart = $("#stockChart").data("kendoStockChart");
    chart.one("dataBound", calculateColumnsMaxAndPlotBands)
    chart.dataSource.read()
    var grid = $("#Grid").data("kendoGrid");
    var row = grid.select();
    return row.hasClass("k-state-selected") ? $("#removeButton").css("visibility", "visible") : $("#removeButton").css("visibility", "hidden");
}

function handleRangeChange(e) {
    var chart = $("#stockChart").data("kendoStockChart");
    var navi = chart.navigator;
    $("#timeFilter li span.selected").removeClass("selected");
    if (e.sender.range().end && e.sender.range().start) {
        navi.select(e.sender.range().start, e.sender.range().end)
        chart.dataSource.read();
    }
}

function onIntervalDDLDataBound(e) {
    var defaultItem = e.sender.dataSource.at(3);
    e.sender.value(defaultItem.Duration);
    intervalDuration = defaultItem.Duration
}


function onIntervalChange() {
    var chart = $("#stockChart").data("kendoStockChart");
    var navi = chart.navigator;
    var fixedRangeIndex = $("#timeFilter li span.selected").index()
    var duration = timeFilters[fixedRangeIndex].Duration / toMins;

    end = new Date();
    start = new Date();
    start.setMinutes(end.getMinutes() - duration);
    navi.select(start, end);
    chart.dataSource.read();
    }

function changeChartType() {
    var dropdownlist = $("#dropdownChartSelection").data("kendoDropDownList");
    var selectedValue = dropdownlist.value()
    var chart = $("#stockChart").data("kendoStockChart");
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

function onGridDataBound() {
    this.tbody.find('tr').each(function () {
        eval($(this).find('script').html())
    })
}
function itemColor(e) {
    var currentItemValue = e.dataItem;
    var currentLargerThenPrev = !prevItemValue || currentItemValue.Volume >= prevItemValue.Volume
    if (currentItemValue.Volume) {
        prevItemValue = currentItemValue
    }
    return currentLargerThenPrev ? '#5CB85C' : '#FF6358';
}

function calculateColumnsMaxAndPlotBands() {
    var chart = this;
    var volumeValueAxisMax = Math.max(...chart.dataSource.data().map(stock => stock.Volume)) * 4;
    chart.options.valueAxis[1].max = volumeValueAxisMax;
    var categoryPlotBands = chart.dataSource.data().reduce((bands, current, index, allStocks) => {
        bands.push({
            from: current.Date,
            to: (allStocks[index + 1] || current).Date,
            color: index % 2 !== 0 ? 'white' : 'lightgrey',
            // keep the opacity low to avoid hiding the majorGridLines of the value axis
            opacity: 0.2
        });

        return bands;
    }, []);
    chart.options.categoryAxis[0].plotBands = categoryPlotBands;
    chart.redraw();
}


function rangeAndIntervalCompatible(rangeDuration, intervalDuration) {
    // disallow the selection of intervals greater than the currently selected range
    var intervalGreaterThanRange = intervalDuration > rangeDuration;

    // disallow the selection of intervals smaller than 1 hour for ranges greater than 3 days
    var intervalTooSmallForRange = rangeDuration > (MS_PER_DAY * 3) && intervalDuration < (MS_PER_DAY / 24);

    return !intervalGreaterThanRange && !intervalTooSmallForRange;
}

function toggleDisabledStateIntervalDropDown(e) {
    var fixedRangeIndex = $("#timeFilter li span.selected").index();
    var duration = timeFilters[fixedRangeIndex].Duration;
    var intervalDDL = e.sender;
    $(intervalDDL.items()).each(function (idx, dropDownItem) {
        var dataItem = intervalDDL.dataItem(idx);
        !rangeAndIntervalCompatible(duration, dataItem.Duration) ? $(dropDownItem).addClass("k-state-disabled") : $(dropDownItem).removeClass("k-state-disabled");
    });
}

function refreshNavigatorDateRange() {
    var chart = $("#stockChart").data("kendoStockChart");
    var navi = chart.navigator;
    var fixedRangeIndex = $("#timeFilter li span.selected").index()
    var duration = timeFilters[fixedRangeIndex].Duration / toMins;

    end = new Date();
    start = new Date();
    start.setMinutes(end.getMinutes() - duration);
    navi.select(start, end);
}
