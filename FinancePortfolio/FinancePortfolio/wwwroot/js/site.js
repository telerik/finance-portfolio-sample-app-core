// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
const symbols = { USD: "$", EUR: "€", GBP: "£" }

function onChange(e) {
    //$("#stocksGrid").getKendoGrid().dataSource.read();
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
    var color = dataItem.Price == 0 ? "none" : (dataItem.Price > 0 ? "green" : "red");
    var currencySymbol = symbols[dataItem.Currency];

    return "<span style='color: " + color + "'>" + currencySymbol + ' ' + kendo.toString(dataItem.Price, "0.00") + "</span>";
}

function changeTemplate(dataItem) {
    var color = dataItem.DayChange == 0 ? "none" : (dataItem.Price > 0 ? "green" : "red");

    return "<span style='color: " + color + "'>" + kendo.toString(dataItem.DayChange, "0.00")+ "%</span>";
}


function onProfileClick() {
    window.location.href = '/Home/Profile';
}