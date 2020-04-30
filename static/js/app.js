// show that the script was loaded
console.log("loaded app.js");

// populate data in dropdown
d3.json("samples.json").then(function(data) {

    // console.log(data); // log the data because I can
    
    // create an array of names
    var names = data.names.map(data => data);
    
    // console.log(names); // log them to the console because I can
    // console.log(metadata);
    // console.log(samples);

    // populate the dropdown
    var select = document.getElementById("selDataset");

    for(var i = 0; i < names.length; i++) {
        var opt = names[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }

});

// function to initialize all plots
function init() {
    d3.json("samples.json").then(function(data) {

        // create an array of names
        var names = data.names.map(data => data);
        
        // find the first ID
        var dataset = names[0];

        // console.log(dataset); // log it because I can

        // create plots based on the first ID
        updatePlot(dataset);
    });
}

// select dataset when dropdown is changed and pass to updatePlot
function optionChanged() {
    var dropdownMenu = d3.select("#selDataset");
    var dataset = dropdownMenu.property("value");

    // console.log(dataset); // log it because I can

    // update all plots
    updatePlot(dataset);
}

// function that updates all plots
function updatePlot(dataset) {

    d3.json("samples.json").then(function(data) {

        // console.log(data); // log the data because I can

        // create variables for the needed arrays
        var metadata = data.metadata.map(data => data);
        var samples = data.samples.map(data => data);

        // filter the data
        var filteredSample = samples.filter(sampleObj => sampleObj.id == dataset);
        var filteredMeta = metadata.filter(metaObj => metaObj.id == dataset);

        // 'unpack' the data
        var filteredSampleData = filteredSample[0];
        var filteredMetaData = filteredMeta[0];

        // populate the panel
        var panel = d3.select("#sample-metadata");
        // clear existing metadata
        panel.html("");

        Object.entries(filteredMetaData).forEach(([key, value]) => {
            panel.append("h6").text(`${key}:${value}`);
        })

        // seperate IDs, values, and labels
        var otu_ids = filteredSampleData.otu_ids;
        var sample_values = filteredSampleData.sample_values;
        var labels = filteredSampleData.otu_labels;

        // console.log(otu_ids); // log the data because I can

        // slice the IDs to create proper ytick names of the top 10 and organize from largest to smallest
        var yticks = otu_ids.slice(0, 10).map(otu_ids => `OTU ${otu_ids}`).reverse()

        // console.log(filteredSet); // log the data because I can

        // create new data for the bar plot
        var barData = [{
            type:'bar',
            // slice and reverse values to show the top 10
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            text: labels.slice(0, 10).reverse(),
            orientation: 'h'
        }];

        // create new data for the bubble plot
        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids
            },
            text: labels
        }];

        // layout for the bubble plot
        var bubbleLayout = {
            xaxis: {
                title: {
                    text: 'OTU ID'
                }
            }
        };

        // Create the new bar plot
        Plotly.newPlot('bar', barData)

        // create the new bubble plot
        Plotly.newPlot('bubble', bubbleData, bubbleLayout)

    });
}

init();