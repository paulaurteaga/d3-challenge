var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chartGroup = svg.append("g")
d3.select("#scatter").append("div").attr("class", "d3-tip").style("opacity", 0);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis='healthcare';

d3.csv("data/data.csv", function(sample) {
  
  console.log(sample)
  sample.forEach(function(d) {
    d.poverty = +d.poverty;
    d.age = +d.age;
    d.healthcare = +d.healthcare;
    d.smokes= +d.smokes;
  });

// xLinearScale function above csv import
var xLinearScale = xScale(sample, chosenXAxis);

// Create y scale function
var yLinearScale = YScale(sample,chosenYAxis)
  
// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

function xScale(sample, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(sample, d => d[chosenXAxis]) * 0.8,
      d3.max(sample, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}
function YScale(sample, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(sample, d => d[chosenYAxis])* 1.1])
    .range([height, 0]);
  
    return yLinearScale;
  
  }
    var xlabel;
    var ylabel;
  
    if (chosenXAxis === "poverty") {
      xlabel = "Poverty";
    }
    else {
      xlabel = "Age";
    }
    if (chosenYAxis === "healthcare") {
        ylabel = "Healthcare";
      }
      else {
        ylabel = "Smokes";
      }
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`<strong>${d.state}</strong>
      <br>
      <strong>${xlabel} : ${d[chosenXAxis]}</strong>
      <br>
      <strong>${ylabel}: ${d[chosenYAxis]}</strong>`
      );
    });
  chartGroup.call(toolTip);
        chartGroup.selectAll("circle")
      .data(sample)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 10)
      .attr("opacity", ".5")
      .classed("stateCircle", true)
      .classed("abbr",true)
      .text(function(d,i){
        return d.abbr;
      })
      .classed("stateText",true)
      .on('mouseover', toolTip.show)
      .on('mouseout', toolTip.hide);

      chartGroup
      .selectAll("text")
      .data(sample)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("class","stateText")
      .style("fill", "white")
      .style("font", "10px sans-serif")
      .style("font-weight", "bold")
      .text(function(data) {
        return data.abbr;})
      .on("mouseover", function(data) {
        toolTip.show(data)})
      .on("mouseout", function(data) {
        toolTip.hide(data)})
      .attr("x", function(data, index) {
        return xLinearScale(Number(data[chosenXAxis]));
      })
      .attr("y", function(data, index) {
        return yLinearScale(Number(data[chosenYAxis]));
      });
      var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
     var yAxis=chartGroup.append("g")
      .classed("y-axis", true)
      .attr("transform", `translate(${width}, 0`)
      .call(leftAxis);

    var poverty = chartGroup.append("text")
    .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top ) + ")" )
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .classed('aText',true)
      .text("In Poverty (%)");
  
    var age = chartGroup.append("text")
      .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top ) + ")" )
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .classed('aText',true)
      .text("Age (median)");

      var healthcare = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - margin.left -100)
      .attr("y", 0 - (height / 2)+180)
      .attr("value", "healthcare") // value to grab for event listener
      .classed("active", true)
      .classed('aText',true)
      .text("Lacks healthcare");

      var smokes = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - margin.left-100)
      .attr("y", 0 - (height / 2)+160)
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .classed('aText',true)
      .text("Smokes (%)");

function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }  
      chartGroup.selectAll(".aText")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value=="healthcare" || value=="poverty"){
          chosenYAxis="healthcare"
          chosenXAxis="poverty"
          healthcare
              .classed("active", true)
              .classed("inactive", false);
          smokes
              .classed("active", false)
              .classed("inactive", true);
          poverty
              .classed("active", true)
              .classed("inactive", false);
          age
              .classed("active", false)
              .classed("inactive", true);

        }else if (value=="smokes" || value=="age"){
          chosenYAxis="smokes"
          chosenXAxis="age"
          healthcare
              .classed("active", false)
              .classed("inactive", true);
          smokes
              .classed("active", true)
              .classed("inactive", false);
          poverty
              .classed("active", false)
              .classed("inactive", true);
          age
              .classed("active", true)
              .classed("inactive", false);
        }
       
        
        xLinearScale = xScale(sample, chosenXAxis);
        yLinearScale = YScale(sample, chosenYAxis);
        xAxis = renderXAxes(xLinearScale, xAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);
        
        d3.selectAll("circle")
            .transition()
            .duration(1800)
            .attr("cx", function(data) {

              return xLinearScale(+data[chosenXAxis]);
            })
            .attr("cy", function(data) {
              return yLinearScale(+data[chosenYAxis]);
            })
           
        ;
        
        d3.selectAll(".abbr").each(function() {
          d3
            .select(this)
            .transition()
            .attr("x", function(data) {
              return xLinearScale(Number(data[chosenXAxis]));
            })
            .duration(1800);
        });
        
          
        })
      

     
  })
    
      
    