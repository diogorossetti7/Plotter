function loadAndPlot() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file first.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const text = e.target.result;
        
        const lines = text.trim().split("\n");

        let x = [];
        let y = [];

        lines.forEach(line => {
            const [xVal, yVal] = line.split(",").map(Number);
            x.push(xVal);
            y.push(yVal);
        });

        const trace = {
            x: x,
            y: y,
            mode: 'lines+markers',
            type: 'scatter'
        };

        const layout = {
            title: 'Data Plot',
            xaxis: { title: 'X' },
            yaxis: { title: 'Y' }
        };

        Plotly.newPlot('plot', [trace], layout);
    };

    reader.readAsText(file);
}
