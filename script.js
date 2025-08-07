// Make plotData global so HTML buttons can call it
window.plotData = plotData;

// Detect file type and parse accordingly
document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        const ext = file.name.split('.').pop().toLowerCase();

        if (ext === "csv" || ext === "txt") {
            parseText(content);
        } else if (ext === "xml") {
            parseXML(content);
        } else {
            alert("Unsupported file type. Please upload CSV, TXT, or XML.");
        }
    };
    reader.readAsText(file);
});

function parseText(content) {
    const delimiter = document.getElementById("delimiterSelect").value;
    let rows = content.trim().split(/\r?\n/);
    let data = rows.map(row => row.split(delimiter).map(v => v.trim()));

    // Store parsed data globally for plotting
    window.parsedData = data;
    alert("Text/CSV file loaded successfully!");
}

function parseXML(content) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "text/xml");

    let xValues = [];
    let yValues = [];

    // Assuming <point><x>...</x><y>...</y></point> structure
    const points = xmlDoc.getElementsByTagName("point");
    for (let i = 0; i < points.length; i++) {
        const x = points[i].getElementsByTagName("x")[0]?.textContent || "";
        const y = points[i].getElementsByTagName("y")[0]?.textContent || "";
        xValues.push(parseFloat(x));
        yValues.push(parseFloat(y));
    }

    window.parsedData = [xValues, yValues];
    alert("XML file loaded successfully!");
}

function plotData() {
    if (!window.parsedData) {
        alert("Please upload a file first.");
        return;
    }

    let xValues, yValues;

    if (Array.isArray(window.parsedData[0])) {
        // CSV/TXT mode
        xValues = window.parsedData.map(row => parseFloat(row[0]));
        yValues = window.parsedData.map(row => parseFloat(row[1]));
    } else {
        // XML mode
        xValues = window.parsedData[0];
        yValues = window.parsedData[1];
    }

    const title = document.getElementById("titleInput").value || "My Plot";
    const xLabel = document.getElementById("xLabelInput").value || "X Axis";
    const yLabel = document.getElementById("yLabelInput").value || "Y Axis";
    const color = document.getElementById("colorInput").value || "blue";

    const trace = {
        x: xValues,
        y: yValues,
        mode: "lines+markers",
        type: "scatter",
        marker: { color: color }
    };

    const layout = {
        title: title,
        xaxis: { title: xLabel },
        yaxis: { title: yLabel }
    };

    Plotly.newPlot("plot", [trace], layout);
}
