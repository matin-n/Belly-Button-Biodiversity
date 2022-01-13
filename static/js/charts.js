function init() {
  // Grab a reference to the dropdown select element
  const selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    const sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

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
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    // 3. Create a const that holds the samples array.
    const samples = data.samples;

    // 4. Create a const that filters the samples for the object with the desired sample number.
    const resultArray = samples.filter(
      (sampleNumber) => sampleNumber.id == sample
    );

    //  5. Create a const that holds the first sample in the array.
    const result = resultArray[0];

    // 6. Create const's that hold the otu_ids, otu_labels, and sample_values.
    // 7. Create the yticks for the bar chart.
    const [otu_ids, otu_labels, sample_values] = [
      result.otu_ids
        .slice(0, 10)
        .map((i) => "OTU " + i.toString())
        .reverse(),
      result.otu_labels.slice(0, 10).reverse(),
      result.sample_values.slice(0, 10).reverse(),
    ];

    // 8. Create the trace for the bar chart.
    const trace = {
      x: sample_values,
      y: otu_ids,
      text: otu_labels,
      type: "bar",
      orientation: "h",
    };

    const barData = [trace];

    // 9. Create the layout for the bar chart.
    const barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      // yaxis: { categoryorder: "total ascending" },
    };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.react("bar", barData, barLayout);
  });
}
