// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata =data.metadata;
    // Filter the metadata for the object with the desired sample number
    const result = metadata.filter(sampleObj => sampleObj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const result = samples.filter(sampleObj => sampleObj.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // Build a Bubble Chart
    const bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Jet'
      }
    };

    const bubbleData = [bubbleTrace];

    const bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' },
    };


    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.map(id => `OTU ${id}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const barTrace = {
      x: sample_values.slice(0, 10).reverse(), // Slice and reverse sample values
      y: yticks.slice(0, 10).reverse(), // Slice and reverse y-ticks
      text: otu_labels.slice(0, 10).reverse(), // Slice and reverse labels
      type: 'bar',
      orientation: 'h' // Horizontal bar chart
    };

    const barData = [barTrace];

    const barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      margin: { l: 100, r: 100, t: 100, b: 100 }
    };


    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdownMenu = d3.select(`#selDataset`);

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      dropdownMenu.append("option") // Append a new option element
                  .text(sample)     // Set the text of the option to the sample name
                  .attr("value", sample); // Set the value attribute for the option
    });

    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


// Function for event listener
function optionChanged(newSample) {
  // Log the selected sample to the console (for debugging)
  console.log(`Selected Sample: ${newSample}`);
  
  // Update the charts and metadata panel with the new sample
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();