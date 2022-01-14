function init() {
  // Grab a reference to the dropdown select element
  const selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    const sampleNames = data.names;

    // sampleNames.forEach((sample) => {
    //   selector.append("option").text(sample).property("value", sample);
    // });

    for (const sample of sampleNames) {
      selector.append("option").text(sample).property("value", sample);
    }

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    const metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    const resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    const result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    const PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Object.entries(result).forEach(([key, value]) => {
    //   PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    // });
    for (const [key, value] of Object.entries(result)) {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    }
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    // Configuration Options for Plotly
    const config = {
      responsive: true, // Enable Responsive Chart to Window Size
      // scrollZoom: true, // Mousewheel or two-finger scroll zooms the plot
      displaylogo: false, // Hide the Plotly Logo on the Modebar
      modeBarButtonsToRemove: [
        "zoom2d",
        "pan2d",
        "select2d",
        "lasso2d",
        "zoomIn2d",
        "zoomOut2d",
        "autoScale2d",
      ],
      // displayModeBar: false, // Never Display the Modebar
    };

    // 3. Create a const that holds the samples array.
    const samples = data.samples;

    // 4. Create a var that filters the samples for the object with the desired sample number.
    let resultArray = samples.filter(
      (sampleNumber) => sampleNumber.id == sample
    );

    //  5. Create a var that holds the first sample in the array.
    let result = resultArray[0];

    // 6. Create const's that hold the otu_ids, otu_labels, and sample_values.
    // 7. Create the ticks for the bar chart.
    const [otu_ids, otu_labels, sample_values] = [
      result.otu_ids
        .slice(0, 10)
        .map((i) => "OTU " + i.toString())
        .reverse(),
      result.otu_labels.slice(0, 10).reverse(),
      result.sample_values.slice(0, 10).reverse(),
    ];

    // 8. Create the trace for the bar chart.
    let trace = {
      x: sample_values,
      y: otu_ids,
      hovertext: otu_labels,
      hoverinfo: "text",
      type: "bar",
      orientation: "h",
    };

    const barData = [trace];

    // 9. Create the layout for the bar chart.
    const barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      font: {
        family: "Roboto",
      },
      plot_bgcolor: "#F8FAFC",
      paper_bgcolor: "#F8FAFC",
      // yaxis: { categoryorder: "total ascending" },
    };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.react("bar", barData, barLayout, config);

    // Deliverable 2: Create a Bubble Chart
    // 1. Create the trace for the bubble chart.
    trace = {
      x: result.otu_ids,
      y: result.sample_values,
      text: result.otu_labels,
      mode: "markers",
      marker: {
        color: result.sample_values,
        colorscale: "Portland",
        size: result.sample_values,
        //set 'sizeref' to an 'ideal' size given by the formula:
        // sizeref = 2.0 * max(array_of_size_values) / (desired_maximum_marker_size ** 2)
        sizeref: (2.0 * Math.max(...result.sample_values)) / 100 ** 2,
        sizemode: "area",
      },
    };

    const bubbleData = [trace];

    // 2. Create the layout for the bubble chart.
    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      hovermode: "x unified",
      font: {
        family: "Roboto",
      },
      plot_bgcolor: "#F8FAFC",
      paper_bgcolor: "#F8FAFC",
    };

    // 3. Use Plotly to plot the data with the data and layout.
    Plotly.react("bubble", bubbleData, bubbleLayout, config);

    // Deliverable 3:
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    const metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    resultArray = metadata.filter((sampleNum) => sampleNum.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    result = resultArray[0];

    // 3. Create a const variable that holds the washing frequency.
    const washingFrequency = parseFloat(result.wfreq);

    // 4. Create the trace for the gauge chart.
    trace = {
      value: washingFrequency,
      type: "indicator",
      mode: "gauge+number",
      title: "Scrubs per Week",
      gauge: {
        axis: { range: [null, 10], dtick: 2 },
        bar: { color: "black" },
        bgcolor: "rainbow",
        steps: [
          { range: [0, 2], color: "blue" },
          { range: [2, 4], color: "green" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "orange" },
          { range: [8, 10], color: "red" },
        ],
      },
    };

    const gaugeData = [trace];

    // 5. Create the layout for the gauge chart.
    const gaugeLayout = {
      title: "Belly Button Washing Frequency",
      font: {
        family: "Roboto",
      },
      plot_bgcolor: "#F8FAFC",
      paper_bgcolor: "#F8FAFC",
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.react("gauge", gaugeData, gaugeLayout, config);
  });
}
