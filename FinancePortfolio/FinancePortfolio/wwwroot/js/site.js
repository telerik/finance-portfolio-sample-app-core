// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
const symbols = { USD: "$", EUR: "€", GBP: "£" };
const MS_PER_DAY = 86400000; /*60 * 60 * 24 * 1000*/
var defaultIntervalDuration = 3600000;
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
        return;
    }

    if (!document.location.pathname.endsWith("/Home/Profile")) {
        $("#Grid").getKendoGrid().dataSource.read();
        $("#stockChart").data("kendoStockChart").redraw();
    }
}

function additionalData() {
    var ddl = $("#currency").getKendoDropDownList();
    var ddlValue = ddl.value();
    var dataItem = ddl.dataItem(ddlValue - 1);

    return {
        currency: dataItem.Text
    };
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

function stockCurrencyTemplate() {
    var selected = $("#currency").getKendoDropDownList().select();
    var currency = $("#currency").getKendoDropDownList().dataItem(selected).Text;

    return currency;
}

function currencyTemplate(data) {
    var currency = $("#currency").data("kendoDropDownList").value();
    return currency == 1 ? kendo.toString(data.Price, "$###.##") : (currency == 2 ? kendo.toString(data.Price, "€###.##") : kendo.toString(data.Price, "£###.##"))
}

function currencyTemplateChartValueAxis(data) {
    var currency = $("#currency").data("kendoDropDownList").value();
    return currency == 1 ? kendo.toString(data.value, "$###.##") : (currency == 2 ? kendo.toString(data.value, "€###.##") : kendo.toString(data.value, "£###.##"))
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

function formatCurrency(value) {
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
}

function additionalChartData() {
    var start, end, grid, interval;
    var range = $("#daterangepicker").getKendoDateRangePicker().range();
    interval = ($("#interval").getKendoDropDownList().value() / toMins) || 60;
    console.log("interval", interval);

    if ($("#timeFilter li span").hasClass("selected")) {
        var fixedRangeIndex = $("#timeFilter li span.selected").index();
        var duration = timeFilters[fixedRangeIndex].Duration / toMins;
    }

    if (!range) {
        end = new Date();
        start = new Date();
        start.setMinutes(end.getMinutes() - duration);
        console.log("no range", start);
    }
    else {
        start = range.start;
        end = range.end;
    }

    grid = $("#Grid").getKendoGrid();
    if (grid && grid.select().length) {
        var row = grid.select();
        var symbol = grid.dataItem(row).Symbol;
    }
    console.log(start, end, interval);
    return {
        symbol: symbol || "AAN",
        start: start,
        end: end,
        interval: interval
    };
}

function showDeletBttnOnChange() {
    var chart = $("#stockChart").getKendoStockChart(); 
    chart.dataSource.read()
    var grid = $("#Grid").data("kendoGrid");
    var row = grid.select();
    return row.hasClass("k-state-selected") ? $("#removeButton").css("visibility", "visible") : $("#removeButton").css("visibility", "hidden");
}

function handleRangeChange(e) {
    var rangePicker = this;
    setTimeout(function () {
        var range = rangePicker.range();
        if (range.start && range.end) {
            var start = new Date(range.start.getFullYear(), range.start.getMonth(), range.start.getDay());
            var end = new Date(range.end.getFullYear(), range.end.getMonth(), range.end.getDay());
            var normalizedRange = normalizeSelectionRange(start, end, rangePicker.options.min, rangePicker.options.max);

            if (normalizedRange.start && normalizedRange.end) {
                $("#timeFilter li span.selected").removeClass("selected");
                $("#interval").getKendoDropDownList().value(MS_PER_DAY.toString());
                updateChart(normalizedRange.start && normalizedRange.end);
            }
        }
    });   
}

function onIntervalChange() {
    updateChart();
}

function changeChartType() {
    var dropdownlist = $("#dropdownChartSelection").data("kendoDropDownList");
    var selectedValue = dropdownlist.value();
    var chart = $("#stockChart").getKendoStockChart();    
    if (selectedValue === "line") {
        chart.setOptions(
            {
                type: "line",
                series: [{
                    type: "column",
                    field: "Volume",
                    categoryField: "Date",
                    axis: "Volume",
                    color: itemColor,
                    border: "transparent",
                    gap: 0.75,
                    aggregate: "avg",
                    tooltip: {
                        format: "{0:0}"
                    }
                },
                {
                    type: "line",
                    field: "Open",
                    categoryField: "Date",
                    color: "#2D73F5",
                    tooltip: {
                        visible: true,
                        template: $('#tooltipTemplate').html()
                    }
                }],
                valueAxis: [{
                    name: "Close",
                    type: "numeric",
                    visible: true,
                    crosshair: {
                        visible: true
                    }
                },
                {
                    name: "Volume",
                    type: "numeric",
                    min: 0,
                    visible: false
                }],
                seriesDefaults: {
                    type: "line"
                },
                categoryAxis: [{
                    baseUnitStep: 1,
                    baseUnit: "hours",
                    crosshair: {
                        visible: true
                    },
                    maxDivisions: 20,
                    minorGridLines: {
                        visible: true
                    },
                    majorGridLines: {
                        visible: true
                    }
                }],
                navigator: {
                    series: {
                        color: "#559DE0"
                    }
                }
            });
    }
    if (selectedValue === "area") {
        chart.setOptions(
            {
                type: "area",
                series: [{
                    type: "column",
                    field: "Volume",
                    categoryField: "Date",
                    axis: "Volume",
                    color: itemColor,
                    border: "transparent",
                    gap: 0.75,
                    aggregate: "avg",
                    tooltip: {
                        format: "{0:0}"
                    }
                },
                {
                    type: "area",
                    field: "Open",
                    categoryField: "Date",
                    color: "#007BFF",
                    tooltip: {
                        visible: true,
                        template: $('#tooltipTemplate').html()
                    }
                }],
                valueAxis: [{
                    name: "Close",
                    type: "numeric",
                    visible: true,
                    crosshair: {
                        visible: true
                    }
                },
                {
                    name: "Volume",
                    type: "numeric",
                    min: 0,
                    visible: false
                }],
                seriesDefaults: {
                    type: "area"
                },
                categoryAxis: [{
                    baseUnitStep: 1,
                    baseUnit: "hours",
                    crosshair: {
                        visible: true
                    },
                    maxDivisions: 20,
                    minorGridLines: {
                        visible: true
                    },
                    majorGridLines: {
                        visible: true
                    }
                }],
                navigator: {
                    series: {
                        color: "#559DE0"
                    }
                }
            });
    }
    if (selectedValue === "candle") {
        chart.setOptions(
            {
                type: "candle",
                series: [{
                    type: "column",
                    field: "Volume",
                    categoryField: "Date",
                    axis: "Volume",
                    color: itemColor,
                    border: "transparent",
                    gap: 0.75,
                    aggregate: "avg",
                    tooltip: {
                        format: "{0:0}"
                    }
                }, {
                    type: "candlestick",
                    color: "#5CB85C",
                    downColor: "#D9534F",
                    openField: "Open",
                    highField: "High",
                    lowField: "Low",
                    closeField: "Close",
                    categoryField: "Date",
                    axis: "Close",
                    gap: 0.75,
                    border: {
                        color: "transparent"
                    },
                    tooltip: {
                        visible: true,
                        template: $('#tooltipTemplate').html()
                    }
                }],
                valueAxis: [{
                    name: "Close",
                    type: "numeric",
                    visible: true,
                    crosshair: {
                        visible: true
                    }
                },
                {
                    name: "Volume",
                    type: "numeric",
                    min: 0,
                    visible: false
                }],
                categoryAxis: [{
                    baseUnitStep: 1,
                    baseUnit: "hours",
                    crosshair: {
                        visible: true
                    },
                    maxDivisions: 20,
                    minorGridLines: {
                        visible: true
                    },
                    majorGridLines: {
                        visible: true
                    }
                }],
                navigator: {
                    series: {
                        color: "#559DE0"
                    }
                }
            });
    }
    chart.options.categoryAxis[0].baseUnitStep = 1;
}

function onGridDataBound(e) {
    e.sender.select("tr:eq(0)");
    $("#Grid tr.k-alt").removeClass("k-alt");
    var intradayCollection = [];
    var data = this.dataSource.view();
    $(data).each(function () {
        intradayCollection.push(this.Intraday)
    });

    this.tbody.find('tr').each(function (idx) {
        eval($(this).find('script').html())
        var chart = $(this).find("[data-role='chart']").getKendoChart();
        var chartData = jQuery.map(intradayCollection[idx], function (a) {
            return { Intraday: a };
        });

        chart.dataSource.data(chartData)
    })
}

function itemColor(e) {
    var currentItemValue = e.dataItem;
    var currentLargerThenPrev = !prevItemValue || currentItemValue.Volume >= prevItemValue.Volume;
    if (currentItemValue.Volume) {
        prevItemValue = currentItemValue;
    }
    return currentLargerThenPrev ? '#5CB85C' : '#FF6358';
}
function setNestedChartColor(e) {
    var grid = $("#Grid").getKendoGrid();
    var dataItem = grid.dataItem($(e.sender.element).closest("tr"));
    var color = dataItem.ChangePct > 0 ? "green" : "red"; 
    $(e.sender.options.series).each(function () {
        this.color = color;
    });
}

// we can improve this to only loop once
function calculateColumnsMaxAndPlotBands(e) {
    var chart = this;
    var currentMax = 0;
    var series = e.sender.options.series;
    for (let i = 0; i < series.length; i++) {
        for (let k = 0; k < series[i].data.length; k++) {
            if (series[i].data[k].Volume > currentMax) {
                currentMax = series[i].data[k].Volume;
            }
        }
    }

    // set hidden valueAxis max so the bars are always 1/4 of the chart height
    chart.options.valueAxis[1].max = currentMax * 4;

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

function updateChart(rangeStart, rangeEnd) {
    var chart = $("#stockChart").data("kendoStockChart");
    var interval = $("#interval").getKendoDropDownList().dataItem().Interval;
    chart.options.categoryAxis[0].baseUnit = interval.Unit.toLowerCase();
    chart.options.categoryAxis[0].baseUnitStep = interval.Step;
    var navi = chart.navigator;
    var fixedRangeIndex = $("#timeFilter li span.selected").index();
    var duration = fixedRangeIndex !== -1 ? timeFilters[fixedRangeIndex].Duration / toMins : defaultIntervalDuration;

    end = rangeEnd || new Date();
    start = rangeStart || new Date();
    start.setMinutes(end.getMinutes() - duration);
    navi.select(start, end);
    chart.dataSource.read();
}

function onTimeFilterClick(e) {
    $("li span").removeClass("selected");
    $(e.target).addClass("selected");
    $("#daterangepicker").getKendoDateRangePicker().range("");
    var fixedRangeIndex = $(e.target).index();
    var duration = timeFilters[fixedRangeIndex].Duration;
    selectFirstCompatibleInterval(duration);
}

function selectFirstCompatibleInterval(displayedDuration) {
    var intervalDropDown = $("#interval").getKendoDropDownList();
    var selectedInterval = intervalDropDown.dataItem().Duration;
    if (rangeAndIntervalCompatible(displayedDuration, selectedInterval)) {
        intervalDropDown.trigger("change");
        return;
    }
    const firstCompatibleInterval = intervalDropDown.dataItems().find(interval => rangeAndIntervalCompatible(displayedDuration, interval.Duration));
    if (firstCompatibleInterval) {
        intervalDropDown.value(firstCompatibleInterval.Duration.toString());
        intervalDropDown.trigger("change");
    }
}

function normalizeSelectionRange(start, end, min, max) {
    if (!(start && end && isDateInRange(start, min, max) && isDateInRange(end, min, max))) {
        return { start: null, end: null };
    }

    const normalizedStart = new Date(start.getFullYear(), start.getMonth(), start.getDay());
    const normalizedEnd = new Date(end.getFullYear(), end.getMonth(), end.getDay() + 1);

    return {
        start: dateInRange(normalizedStart, min, max),
        end: dateInRange(normalizedEnd, min, max)
    };
}

function isDateInRange(candidate, min, max) {
    return !candidate || !((min && min > candidate) || (max && max < candidate));
}

function dateInRange(candidate, min, max) {
    if (!candidate) {
        return candidate;
    }

    if (min && candidate < min) {
        return min;
    }

    if (max && candidate > max) {
        return max;
    }

    return candidate;
}

function rangeAndIntervalCompatible(rangeDuration, defaultIntervalDuration) {
    // disallow the selection of intervals greater than the currently selected range
    var intervalGreaterThanRange = defaultIntervalDuration > rangeDuration;

    // disallow the selection of intervals smaller than 1 hour for ranges greater than 3 days
    var intervalTooSmallForRange = rangeDuration > (MS_PER_DAY * 3) && defaultIntervalDuration < (MS_PER_DAY / 24);

    return !intervalGreaterThanRange && !intervalTooSmallForRange;
}

function toggleDisabledStateIntervalDropDown(e) {
    var fixedRangeIndex = $("#timeFilter li span.selected").index();
    var duration = timeFilters[fixedRangeIndex] ? timeFilters[fixedRangeIndex].Duration : defaultIntervalDuration;
    var intervalDDL = e.sender;
    $(intervalDDL.items()).each(function (idx, dropDownItem) {
        var dataItem = intervalDDL.dataItem(idx);
        !rangeAndIntervalCompatible(duration, dataItem.Duration) ? $(dropDownItem).addClass("k-state-disabled") : $(dropDownItem).removeClass("k-state-disabled");
    });
}

