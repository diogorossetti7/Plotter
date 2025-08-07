let rawData = '';
let fileType = '';

document.getElementById('fileInput').addEventListener('change', function (event) {
  const file = event.target.files[0];
  fileType = file.name.split('.').pop().toLowerCase();

  const reader = new FileReader();

  reader.onload = function (e) {
    rawData = e.target.result;
  };

  reader.readAsText(file);
});

function plotData() {
  if (!rawData) {
    alert('Please upload a file first.');
    return;
  }

  if (fileType === 'xml') {
    plotFromXML(rawData);
  } else {
    plotFromText(rawData);
  }
}

function plotFromText(text) {
  const separator = document.getElementById('separator').value;
  const lines = text.trim().split('\n');
  const labels = [];
  const data = [];

  lines.forEach(line => {
    const [x, y] = line.split(separator).map(s => s.trim());
    if (x && y && !isNaN(parseFloat(y))) {
      labels.push(x);
      data.push(parseFloat(y));
    }
  });

  renderChart(labels, data);
}

function plotFromXML(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const entries = xmlDoc.getElementsByTagName("entry");
  const labels = [];
  const data = [];

  for (let i = 0; i < entries.length; i++) {
    const label = entries[i].getElementsByTagName("label")[0]?.textContent;
    const value = entries[i].getElementsByTagName("value")[0]?.textContent;

    if (label && value && !isNaN(parseFloat(value))) {
      labels.push(label.trim());
      data.push(parseFloat(value));
    }
  }

  if (labels.length === 0 || data.length === 0) {
    alert("Invalid XML format. Expected <entry><label>...</label><value>...</value></entry>");
    return;
  }

  renderChart(labels, data);
}

function renderChart(labels, data) {
  const ctx = document.getElementById('myChart').getContext('2d');

  if (window.myChart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: document.getElementById('chartTitle').value || 'Dataset',
        data: data,
        borderColor: document.getElementById('lineColor').value,
        fill: false
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: document.getElementById('xLabel').value
          }
        },
        y: {
          title: {
            display: true,
            text: document.getElementById('yLabel').value
          }
        }
      }
    }
  });
}