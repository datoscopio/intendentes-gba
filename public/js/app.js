var width = Math.max(960, window.innerWidth),
    height = Math.max(500, window.innerHeight),
    active = d3.select(null),
    data;


var linear = d3.scale.linear()
  .domain([2,5,10,15,24])
  .range(["#d2d1fd", "#a5a3fb", "#7774f9", "#4a46f7", "#0000ff"]);

var color = d3.scale.quantize()
  // .domain([2,24])
  .range(["#d2d1fd", "#a5a3fb", "#7774f9", "#4a46f7", "#0000ff"]);

var colorText = d3.scale.quantize()
  .range(["#00202a", "#2e343b", "#e4f1fe", "#e4f1fe", "#e4f1fe"]);

  // Via http://colorsafe.co/

var formatearMiles = d3.format(",");

var radio = d3.scale.linear()
    .domain([2,24])
    .range([1,20]);

var projection = d3.geo.mercator()
     .scale(30000)
     .translate([width / 2, height / 1.9])
     .center([-58.40000,-34.58900]);

var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

var path = d3.geo.path()
    .projection(projection);

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("display", "none");


var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("click", stopped, true);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

var g = svg.append("g");

svg
    .call(zoom) // delete this line to disable free zooming
    .call(zoom.event);

queue()
    .defer(d3.json, "/data/gba.json")
    .await(ready);


function ready(error, gba) {
  if (error) throw error;

  data = topojson.feature(gba, gba.objects.conourbano).features;

  var referencia = "tiempocargo";

  colorText.domain([d3.min(data, function(d) { return d.properties[referencia]; }), d3.max(data, function(d) { return d.properties[referencia]; })]);
  color.domain([d3.min(data, function(d) { return d.properties[referencia]; }), d3.max(data, function(d) { return d.properties[referencia]; })]);

  g.selectAll("path")
      .data(topojson.feature(gba, gba.objects.conourbano).features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", "distrito")
      .on("click", clicked)
      .style("fill", function(d) {
        return color(d.properties[referencia]);
    })
    .on("mousemove", function(d,i) {
      var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
      tooltip
        .data(topojson.feature(gba, gba.objects.conourbano).features)
        .classed("hidden", false)
        .attr("style", "left:"+(mouse[0]+25)+"px;top:"+mouse[1]+"px")
        .html(
          "Distrito: <strong>"+d.properties.distrito+"</strong><br>"+
          "Intendente: " +d.properties.intendente+"<br>"+
          "Años en el cargo: " +d.properties.tiempocargo+"<br>"+
          "Cantidad de votos 2011: " +formatearMiles(d.properties.votos_2011)+ " votos");
    })
    .on("mouseout",  function(d,i) {
      tooltip.classed("hidden", true)
    });


  g.append("path")
      .datum(topojson.mesh(gba, gba.objects.conourbano, function(a, b) { return a !== b; }))
      .attr("class", "bordes")
      .attr("d", path);


  /* 

  // WIP Inyectar nodos circulares para transicion a Force Layout

  g.selectAll(".node")
    .data(topojson.feature(gba, gba.objects.gba).features)
    .enter().append("circle")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
    .attr("r", 5);
    // .data(topojson.feature(gba, gba.objects.conourbano).features)
    // .attr("r", function(d) {
    //   return radio(d.properties.tiempocargo);
    // });
  
  */ 



  g.selectAll(".place-label")
      .data(data)
    .enter().append("text")
      .attr("class", "place-label")
      .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
      .attr("dy", "-.20em")
      .text(function(d) { return d.properties.distrito; })
      .call(wrap, 75)
      .style("opacity", function(d) {
            if (this.getComputedTextLength() > 60 && path.area(d) < 9000 ) {
              return 0;
            } else {
              return 1;
            }
      })
        // if (this.getComputedTextLength() === 85.81396484375 && path.area(d) === 1124.8116102908389) {
        //     console.log(path.area(d));
        //     return 4;
            
        // }
        //   var textSize = Math.round(this.getComputedTextLength());
        //   // console.log(this.getComputedTextLength())
        // if (textSize <= 50 ) {
        //   return Math.min(path.area(d), (path.area(d)) / this.getComputedTextLength() * .05);
        // } else if (textSize >= 75) {
        //   return Math.min(path.area(d), (path.area(d)) / this.getComputedTextLength() * .05);
        // } else if (textSize >= 100) {
        //   return 7;
        // } else if (textSize >= 150) {
        //   return 6;
        // } else {
        //   return 5;
        // }

        // return Math.min(path.area(d) * /.5, (path.area(d)*.5) / this.getComputedTextLength() * .05); 
      
      .style("fill", function(d) {
        return colorText(d.properties[referencia]);
      });


  svg.append("g")
    .attr("class", "legendLinear")
    .attr("transform", "translate(20,20)");

  var legendLinear = d3.legend.color()
    .shapeWidth(30)
    .cells([2, 4, 10, 15, 24])
    .orient('horizontal')
    .scale(linear);

  svg.select(".legendLinear")
    .call(legendLinear);


  $('[data-toggle="buttons"] .btn').click(function(){

      referencia = $(this).find('input').attr('id');

      reset();


      colorText.domain([d3.min(data, function(d) { return d.properties[referencia]; }), d3.max(data, function(d) { return d.properties[referencia]; })]);
      color.domain([d3.min(data, function(d) { return d.properties[referencia]; }), d3.max(data, function(d) { return d.properties[referencia]; })]);

      d3.selectAll(".distrito")
          .transition()
          .duration(1500)
          .delay(function(d, i) { return i / data.length * 500; })
          .style("fill", function (d) {
            return color(d.properties[referencia]);
          });

      d3.selectAll(".place-label")
        .transition()
        .duration(1600)
        .style("fill", function(d) {
          return colorText(d.properties[referencia]);
        });
      
  });
};



function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = 0.8 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

  svg.transition()
      .duration(1500)
      .call(zoom.translate(translate).scale(scale).event);
}

function reset() {
  active.classed("active", false);
  active = d3.select(null);

  svg.transition()
      .duration(2000)
      .call(zoom.translate([0, 0]).scale(1).event)
}

function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.scale + "px");
  g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  g.selectAll(".place-label")
   .style("font-size",getSize/d3.event.scale);
   // Revisar como volver a incorporar una tipografia acorde de tamaño.
   // .style("opacity", "0");
  //   .style("font-size", function(d) { return Math.min(path.area(d)*.005, (path.area(d)) / this.getComputedTextLength() * .05)/d3.event.scale })
}

function getSize(d) {
  var bbox = this.getBBox(),
      cbbox = this.parentNode.getBBox(),
      scale = Math.min(cbbox.width/bbox.width, cbbox.height/bbox.height);
  d.scale = scale;
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}


function wrap(text, width) {
  console.log(text)
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}