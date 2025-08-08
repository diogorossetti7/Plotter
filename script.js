let parsedData = [];

document.getElementById("fileInput").addEventListener("change", loadColumns);
document.getElementById("plotBtn").addEventListener("click", plotData);

// Accordion-style toggle
document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        const section = document.getElementById(targetId);

        // Close all sections first
        document.querySelectorAll(".collapsible").forEach(sec => {
            if (sec.id !== targetId) {
                sec.classList.remove("open");
                document.querySelector(`.toggle-btn[data-target="${sec.id}"]`).textContent = "Show";
            }
        });

        // Toggle current section
        if (section.classList.contains("open")) {
            section.classList.remove("open");
            btn.textContent = "Show";
        } else {
            section.classList.add("open");
            btn.textContent = "Hide";
        }
    });
});

function loadColumns() {
    const fileInput = document.getElementById("fileInput");
    const separatorChoice = document.getElementById("separator").value;
    if (!fileInput.files.length) return;

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        let rawText = e.target.result.trim();
        let sep = separatorChoice === "tab" ? "\t" : separatorChoice;

        // Fallback: if no separation detected, try spaces
        let firstLine = rawText.split("\n")[0].trim();
        if (firstLine.split(sep).length < 2) sep = /\s+/;

        parsedData = rawText.split("\n").map(line => 
            line.trim().split(sep).map(item => item.trim())
        );

        const colCount = parsedData[0].length;
        const xSelect = document.getElementById("xColumn");
        const ySelect = document.getElementById("yColumn");
        xSelect.innerHTML = "";
        ySelect.innerHTML = "";

        for (let i = 0; i < colCount; i++) {
            let optX = new Option(`Column ${i+1}`, i);
            let optY = new Option(`Column ${i+1}`, i);
            xSelect.add(optX);
            ySelect.add(optY);
        }
    };

    reader.readAsText(file);
}

function plotData() {
    if (!parsedData.length) {
        alert("No data loaded. Select a file first.");
        return;
    }

    const xCol = parseInt(document.getElementById("xColumn").value);
    const yCol = parseInt(document.getElementById("yColumn").value);

    const title = document.getElementById("plotTitle").value || "My Plot";
    const xLabel = document.getElementById("xLabel").value || `Column ${xCol+1}`;
    const yLabel = document.getElementById("yLabel").value || `Column ${yCol+1}`;

    // Main appearance
    const plotBgColor = document.getElementById("plotBgColor").value;
    const titleColor = document.getElementById("titleColor").value;
    const labelColor = document.getElementById("labelColor").value;
    const showLegend = document.getElementById("showLegend").value === "true";

    // Line & markers
    const lineColor = document.getElementById("lineColor").value;
    const lineWidth = parseInt(document.getElementById("lineWidth").value);
    const markerColor = document.getElementById("markerColor").value;
    const markerSize = parseInt(document.getElementById("markerSize").value);

    // Grid
    const showXGrid = document.getElementById("showXGrid").value === "true";
    const showYGrid = document.getElementById("showYGrid").value === "true";
    const gridColor = document.getElementById("gridColor").value;

    let xData = parsedData.map(row => parseFloat(row[xCol].replace(",", "."))).filter(v => !isNaN(v));
    let yData = parsedData.map(row => parseFloat(row[yCol].replace(",", "."))).filter(v => !isNaN(v));

    let trace = {
        x: xData,
        y: yData,
        mode: "lines+markers",
        type: "scatter",
        name: `${yLabel} vs ${xLabel}`,
        line: { color: lineColor, width: lineWidth },
        marker: { color: markerColor, size: markerSize }
    };

    let layout = {
        title: { text: title, font: { color: titleColor, size: 22 } },
        xaxis: { title: { text: xLabel, font: { color: labelColor } }, color: labelColor, showgrid: showXGrid, gridcolor: gridColor },
        yaxis: { title: { text: yLabel, font: { color: labelColor } }, color: labelColor, showgrid: showYGrid, gridcolor: gridColor },
        plot_bgcolor: plotBgColor,
        paper_bgcolor: plotBgColor,
        showlegend: showLegend
    };

    Plotly.newPlot("plot", [trace], layout);
}
