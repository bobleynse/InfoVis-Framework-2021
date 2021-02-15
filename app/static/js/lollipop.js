function get_info_on_var(variable) {
    var rel_meta = meta_data.find(function(d) {
        return d.Variabele == variable;
    })

    var label = rel_meta['Label_1'];
    var definition = rel_meta['Definition'];

    return [label, definition]
}


function updateArea(selectObject) {
    selected_area = selectObject.value;
    updatePlot();
};


function updatePlot() {
    var fetch_url = "/d3_plot_data?area_name=" + selected_area;
    fetch(fetch_url)
        .then(function(response) { return response.json(); })
        .then((data) => {
            plot_data = data;
            updateLollipop();
    });
}


function updateLollipop() {
    var chart_group = svgContainer.append("g")
        .attr("id", "chart_group")
        .attr("transform", "translate(" + 100 + "," + 50 + ")");

    // Make x-axis
    chart_group.append("g")
        .attr("transform", "translate(" + 0 + "," + chart_height + ")")
        .call(d3.axisBottom(x));

    // Make y-axis
    chart_group.append("g")
        .call(d3.axisLeft(y));

    // Recieve the data
    var map = d3.map(plot_data[0]); 

    // Create lollipop circle
    var c = chart_group.selectAll("myCircle")
        .data(map.entries())    
    c
        .enter()
        .append("circle")
        .attr("class", "lollipop")
        .merge(c)
        .transition()
        .duration(1000)
            .attr("r", 7)
            .attr("cx", function(d) { return x(d.value); })
            .attr("cy", function(d) { return y(d.key); })

    // Create lollipop circle
    var l = chart_group.selectAll("myLine")
        .data(map.entries())
    l
        .enter()
        .append("line")
        .merge(l)
        .transition()
        .duration(1000)
            .attr("x1", function(d) { return x(d.value); })
            .attr("x2", x(0))
            .attr("y1", function(d) { return y(d.key); })
            .attr("y2", function(d) { return y(d.key); })
            .attr("stroke", "grey")

};

    // // Show labels when the mouse is on a lollipop
    // .on("mouseenter", function(d, i) {
    //     var x_var = d.key;
    //     var value = d.value;
    //     var info = get_info_on_var(x_var);
    //     var label = info[0]
    //     var definition = info[1];

    //     displayTooltip("<b>Variable: </b>" + label + "<br /><b>Percentage: </b>" + 
    //         value + "%<br /><b>Explanation: </b>" + definition)
    // })
    // .on("mouseout", function(d) {
    //     hideTooltip();
    //     d3.select(this).attr("fill", "steelblue");
    // });

    // // Text label for the x axis
    // svgContainer.append("text")             
    // .attr("transform",
    //         "translate(" + (width/2 - (100/2)) + " ," + 
    //                     (chart_height + 100) + ")")
    // .style("text-anchor", "middle")
    // .style("font-size", "13px")
    // .text("Percentage");

    // // Text label for the title
    // chart_group.append("text")
    //         .attr("class", "title")
    //         .attr("id", "chart-title")
    //         .attr("y", -25)
    //         .attr("x", chart_width / 2)
    //         .style("font-weight", "bold")               
    //         .style("text-anchor", "middle")
    //         .text("Rental statistics of " + selected_area);
