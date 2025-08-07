function parseData(content, delimiter) {
    console.log("Raw file content preview:", content.substring(0, 200)); // First 200 chars

    let lines = content.trim().split(/\r?\n/);
    console.log("Number of lines detected:", lines.length);

    let xData = [];
    let yData = [];

    for (let line of lines) {
        let parts = line.trim().split(delimiter);
        if (parts.length >= 2) {
            let x = parseFloat(parts[0]);
            let y = parseFloat(parts[1]);
            if (!isNaN(x) && !isNaN(y)) {
                xData.push(x);
                yData.push(y);
            }
        }
    }

    console.log("Parsed X data:", xData);
    console.log("Parsed Y data:", yData);

    if (xData.length === 0 || yData.length === 0) {
        alert("No valid numeric data found. Check your delimiter selection and file format.");
    }

    return { xData, yData };
}

function detectDelimiter(content) {
    const delimiters = [",", ";", "\t", " ", "|"];
    let bestDelimiter = delimiters[0];
    let maxParts = 0;

    for (let delim of delimiters) {
        let parts = content.split("\n")[0].split(delim);
        if (parts.length > maxParts) {
            maxParts = parts.length;
            bestDelimiter = delim;
        }
    }

    console.log("Auto-detected delimiter:", JSON.stringify(bestDelimiter));
    return bestDelimiter;
}

document.getElementById("fileInput").addEventListener("change", function(e) {
    let file = e.target.files[0];
    if (!file) {
        alert("No file selected.");
        return;
    }

    let reader = new FileReader();
    reader.onload = function(event) {
        let content = event.target.result;
        let delimiter = detectDelimiter(content);
        let { xData, yData } = parseData(content, delimiter);

        if (xData.length > 0 && yData.length > 0) {
            Plotly.newPlot("plot", [{
                x: xData,
                y: yData,
                mode: 'lines+markers'
            }]);
        }
    };
    reader.readAsText(file);
});
