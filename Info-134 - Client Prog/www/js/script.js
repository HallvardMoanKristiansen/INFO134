var newLine = -1;

const befolkningURL  = 'http://wildboy.uib.no/~tpe056/folk/104857.json';
const sysselsatteURL = 'http://wildboy.uib.no/~tpe056/folk/100145.json';
const utdanningURL   = 'http://wildboy.uib.no/~tpe056/folk/85432.json';

const jsonURLs = [befolkningURL, sysselsatteURL, utdanningURL];

function start() {
    load();
}

function load(search) {
    if (search == null) {
        load_bef(); load_sys(); load_utd();
    } else {
        load_bef(search); load_sys(search); load_utd(search);
    }
}

function load_bef(id) {
    var request = new XMLHttpRequest();
    request.open("GET", befolkningURL);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            var response = JSON.parse(request.responseText);
            if (id != null) {
                details(response, id, 0);
                growth(response, id, 0);
            }
            overview(response);
        }
    };
    request.send()
}

function load_sys(id) {
    var request = new XMLHttpRequest();
    request.open("GET", sysselsatteURL);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            var response = JSON.parse(request.responseText);
            if (id != null) {
                details(response, id, 1);
                growth(response, id, 1);
            }
        }
    };
    request.send()
}

function load_utd(id) {
    var request = new XMLHttpRequest();
    request.open("GET", utdanningURL);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            var response = JSON.parse(request.responseText);
            if (id != null) {
                details(response, id, 2);
                growth(response, id, 2);
            }
        }
    };
    request.send()
}

function search() {
    var inputSearch = document.getElementById('search');
    var search = inputSearch.value;
    load(search);
}

function getCountyID(response, county) {
    return response.elementer[county].kommunenummer;
}

function calcTotalPopulation(response, komune, year) {
    return response.elementer[komune].Menn[year] + response.elementer[komune].Kvinner[year];
}

function calcGrowthPercent(past, present, years) {
    var diff = (present - past);
    var rate = (diff / past) * 100;

    return parseFloat((rate / years).toFixed(2));
}

function growth(response, countyID, caller) {
    // Grabs table from HTML
    var table = document.getElementById("growth_table");
    // For each county in elementer
    for (var county in response.elementer) {
        // Compare ID
        if (getCountyID(response, county) === countyID) {
            for (var year = 2007; year < 2018; year++) {
                var row = document.getElementById(year.toString());
                if (caller === 0) {
                    newCell = row.insertCell(newLine);
                    newCell.innerHTML = year.toString();

                    newCell = row.insertCell(newLine);
                    newCell.innerHTML = calcGrowthPercent(
                        calcTotalPopulation(response, county, year),
                        calcTotalPopulation(response, county, year+1),
                        1
                    ) + "%"
                    } else if (caller === 1) {
                    newCell = row.insertCell(newLine);
                    newCell.innerHTML = calcGrowthPercent(
                        response.elementer[county]["Begge kjønn"][year],
                        response.elementer[county]["Begge kjønn"][year+1],
                        1
                    ) + "%"
                    } else if (caller === 2) {
                    newCell = row.insertCell(newLine);
                    newCell.innerHTML = calcGrowthPercent(
                        response.elementer[county]["02a"].Menn[year],
                        response.elementer[county]["02a"].Menn[year+1],
                        1
                    ) + "%"
                }
            }
        }
    }
}

function details(response, countyID, caller) {
    // Grabs specific table from HTML
    var table = document.getElementById("detaljer_table")
    // Grabs specific row from HTML
    var row = document.getElementById("row")
    for (var county in response.elementer) {
        if (getCountyID(response, county) === countyID) {
            if (caller === 0) {
                // Creates a new cell for county
                newCell = row.insertCell(newLine);
                newCell.innerHTML = county;
                // Creates a new cell for county id number
                newCell = row.insertCell(newLine);
                newCell.innerHTML = "# " + getCountyID(response, county);
                // Creates a new cell for total population
                newCell = row.insertCell(newLine);
                newCell.innerHTML = calcTotalPopulation(response, county, 2018);
            } else if (caller === 1) {
                newCell = row.insertCell(newLine);
                newCell.innerHTML = response.elementer[county]["Begge kjønn"][2018];
            } else if (caller === 2) {
                newCell = row.insertCell(newLine);
                newCell.innerHTML = response.elementer[county]["02a"].Menn[2017];
            }
        }
    }
}

function overview(response) {
    // Grabs table from HTML
    var table = document.getElementById("tables")

    for (var county in response.elementer) {
        // Creates a new row in table
        newRow = table.insertRow(newLine);

        // Creates a new cell for county
        newCell = newRow.insertCell(newLine);
        newCell.innerHTML = county;

        // Creates a new cell for county id number
        newCell = newRow.insertCell(newLine);
        newCell.innerHTML = "# " + getCountyID(response, county);

        // Creates a new cell for total population
        newCell = newRow.insertCell(newLine);
        newCell.innerHTML = calcTotalPopulation(response, county, 2018);

        // Creates a new cell for total growth
        newCell = newRow.insertCell(newLine);
        newCell.innerHTML = calcGrowthPercent(
            calcTotalPopulation(response, county, 2007),
            calcTotalPopulation(response, county, 2018),
            11
        ) + "%"
    }
}