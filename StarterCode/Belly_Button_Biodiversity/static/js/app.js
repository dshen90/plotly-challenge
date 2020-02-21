function buildMetadata(sample) {

 d3.json(`/metadata/${sample}`).then((metadata) => {
        console.log(metadata);
        var selection = d3.select("#sample-metadata");
        selection.html("");
         Object.entries(metadata).forEach(([key, value]) => {
            selection.append("p").append("strong").text(`${key}: ${value}`)
        })  

function buildCharts(sample) {

   d3.json(`/samples/${sample}`).then((data) => {
        console.log(data);
        var trace_bubble = {
            x: data.otu_ids,
            y: data.sample_values,
            mode: "markers",
            marker: {
                size: data.sample_values,
                color: data.otu_ids
            },
            type: "scatter",
            text: data.otu_labels,
        }
        
        var bubble_data = [trace_bubble];
        
        var bubble_layout = {
            showlegend: true
        }
        
        Plotly.newPlot("bubble", bubble_data, bubble_layout);
        
        var trace_pie = {
            labels: data.otu_ids.slice(0,10),
            values: data.sample_values.slice(0,10),
            hovertext: data.otu_labels.slice(0,10),
            hoverinfo: "text",
            type: "pie"
        };
    
        var pie_data = [trace_pie];
        
        var pie_layout = {
            showlegend: true
        }
    
        Plotly.newPlot("pie", pie_data, pie_layout);
    
    })

    

}


}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
