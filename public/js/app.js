(function() {

  var width = Math.max(960, window.innerWidth),
      height = Math.max(500, window.innerHeight),
      active = d3.select(null),
      data,
      municipio;


  var cargoEscala = d3.scale.ordinal()
    .domain(["Menos de 5", "Más de 10", "Más de 20"])
    .range(["#a5a3fb", "#7774f9", "#0000ff"]);

  var votoEscala = d3.scale.ordinal()
    .domain(["Menos de 50 mil", "Más de 100 mil", "Más de 350 mil"])
    .range(["#e1cbf4", "#9768c1", "#662d91"]);

  var votoEscalaPASO = d3.scale.ordinal()
    .domain(["Menos de 50 mil", "Más 100 mil", "Más de 350 mil"])
    .range(["#fed9de", "#fd8d9d", "#fc415b"]);

  var color = d3.scale.quantize()
    .range(["#d2d1fd", "#a5a3fb", "#7774f9", "#4a46f7", "#0000ff"]);

  var votoColor2011 = d3.scale.quantize()
    .range(["#e1cbf4", "#c2a4db", "#a47cc3", "#8555aa", "#662d91"]);


  var votoColorPASO = d3.scale.quantize()
    .range(["#fed9de", "#feb3bd", "#fd8d9d", "#fd677c", "#fc415b"]);

  var colorText = d3.scale.quantize()
    .range(["#00202a", "#2e343b", "#e4f1fe", "#e4f1fe", "#e4f1fe"]);

    // Via http://colorsafe.co/

  var formatearMiles = d3.format(",");

  var radio = d3.scale.linear()
      .domain([2,24])
      .range([1,20]);

  var projection = d3.geo.mercator()
       .scale(28000)
       .translate([width / 1.6, height / 1.8])
       .center([-58.40000,-34.58900]);

  var pathconurbanoLinea = d3.geo.mercator()
       .scale(31000)
       .translate([width / 2, height / 2])
       .center([-58.40000,-34.58900]);

  var zoom = d3.behavior.zoom()
      .translate([0, 0])
      .scale(1)
      .scaleExtent([1, 8])
      .on("zoom", zoomed);

  var path = d3.geo.path()
      .projection(projection);

  var pathconurbanoLinea = d3.geo.path()
      .projection(pathconurbanoLinea);

  var tooltip = d3.select(".tooltip")
      .style("display", "none");

      tooltip.append("span").attr("class", "tooltip-municipio");
      tooltip.append("span").attr("class", "tooltip-intendente");
      tooltip.append("span").attr("class", "tooltip-tiempo");
      tooltip.append("span").attr("class", "tooltip-frente");



  var ficha = d3.select(".ficha");

      ficha.append("span").attr("class", "ficha-intendente");
      ficha.append("span").attr("class", "ficha-distrito");
      ficha.append("span").attr("class", "ficha-frente_2011");
      ficha.append("span").attr("class", "ficha-tiempo");
      ficha.append("span").attr("class", "ficha-mandatos");
      ficha.append("span").attr("class", "ficha-antes");
      ficha.append("span").attr("class", "ficha-compite");
      ficha.append("span").attr("class", "ficha-pt2011");
      ficha.append("span").attr("class", "ficha-frente_alianza_2015");
      ficha.append("span").attr("class", "ficha-ptp2015");
      ficha.append("span").attr("class", "ficha-generales");

  var conurbanoLinea = d3.select(".mapaConurbanoLinea").append("svg")
      .attr("width", width)
      .attr("height", height);

  var svg = d3.select("#conurbano").append("svg")
      .attr("width", width)
      .attr("height", height)
      .on("click", stopped, true);

  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height)
      .on("click", resetMap);

  var g = svg.append("g"),
      gLinea = conurbanoLinea.append("g");

  svg
      // .call(zoom)
      .call(zoom.event);

  queue()
      .defer(d3.json, "./data/gba.json")
      .await(ready);


  function ready(error, gba) {
    if (error) throw error;

    data = topojson.feature(gba, gba.objects.conurbano).features;

    var referencia = "tiempo";


    colorText.domain([d3.min(data, function(d) { return d.properties[referencia]; }), d3.max(data, function(d) { return d.properties[referencia]; })]);
    color.domain([d3.min(data, function(d) { return d.properties[referencia]; }), d3.max(data, function(d) { return d.properties[referencia]; })]);

    gLinea.selectAll("path")
      .data(data)
      .enter().append("path")
        .attr("d", pathconurbanoLinea)
        .attr("class", "distrito");

    g.selectAll("path")
        .data(data)
      .enter().append("path")
        .attr("d", path)
        .attr("class", "distrito")
        .attr("data-effect","ficha")
        .call(init)
      .on("click", clicked)
        .style("fill", function(d) {
          return color(d.properties[referencia]);
      })
      .on("mouseover", function(d) {
        municipio = normalize(d.properties.distrito);
        d3.select('#'+municipio).transition().duration(500).style("fill-opacity", 1);
      })
      .on("mousemove", function(d,i) {
        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
        tooltip
          .data(data)
          .classed("hidden", false)
          .attr("style", "left:"+(mouse[0]+40)+"px;top:"+mouse[1]+"px");
        tooltip.select('.tooltip-municipio').html("Municipio: <strong>"+d.properties.distrito+"</strong>")
        tooltip.select('.tooltip-intendente').html("Intendente: <strong>"+d.properties.intendente+"</strong>")
        tooltip.select('.tooltip-tiempo').html("Años en el cargo: <strong>"+d.properties.tiempo+"</strong>")
        tooltip.select('.tooltip-frente').html("Frente: <strong>"+d.properties.frente_2011+"</strong><br><strong>Click para más info</strong>")
      })
      .on("mouseout",  function(d,i) {
        tooltip.classed("hidden", true);
        d3.select('#'+municipio).transition().duration(250).style("fill-opacity", 0);
      });

      g.append("path")
          .datum(topojson.mesh(gba, gba.objects.conurbano, function(a, b) { return a !== b; }))
          .attr("class", "bordes")
          .attr("d", path);

    


    g.selectAll(".place-label")
        .data(data)
      .enter().append("text")
        .attr("class", "place-label")
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", "-.20em")
        // .attr("class", function (d){
        //   var distr = (d.properties.distrito).replace(/\s+/g, '').replace('.', '').toLowerCase();
        //   return d3.select(this).attr("class") + " " +(normalize(distr));
        // })
        .attr("id", function (d) {
            municipio = normalize(d.properties.distrito);
            return municipio;
        })
        .text(function(d) { return d.properties.distrito; })
        .call(wrap, 75)
        .style("fill-opacity", "0")
        .style("fill", function(d) {
          return colorText(d.properties[referencia]);
        });

    // if (this.getComputedTextLength() > 70 && path.area(d) < 9000 ) {
    //   return 0;
    // } else {
    //   return 1;
    // }

    // Agrego leyendas via d3.legend();

    svg.append("g")
      .attr("class", "leyendaCargo")
      .attr("transform", "translate("+(50)+"," + (height-75) + ")")
      .attr("shape-rendering", "crispEdges")
      .append("text")
      .attr("class", "legendRefence")
        .attr("dy", "-1.20em")
        .text("Años en el cargo")

    var leyendaCargo = d3.legend.color()
      .shapeWidth(90)
      .orient('horizontal')
      .scale(cargoEscala);

    svg.select(".leyendaCargo")
      .call(leyendaCargo);

    svg.append("g")
      .attr("class", "leyendaVotos")
      .style("display", "none")
      .attr("transform", "translate("+(50)+"," + (height-75) + ")")
      .attr("shape-rendering", "crispEdges")
      .append("text")
      .attr("class", "legendRefence")
        .attr("dy", "-1.20em")
        .text("Cantidad de votos 2011")

    var leyendaVotos = d3.legend.color()
      .shapeWidth(110)
      .cells([30000, 50000, 80000, 120000, 350000])
      .orient('horizontal')
      .scale(votoEscala);

    svg.select(".leyendaVotos")
      .call(leyendaVotos);

    svg.append("g")
      .attr("class", "leyendaVotosPASO")
      .style("display", "none")
      .attr("transform", "translate("+(50)+"," + (height-75) + ")")
      .attr("shape-rendering", "crispEdges")
      .append("text")
      .attr("class", "legendRefence")
        .attr("dy", "-1.20em")
        .text("Cantidad de votos P.A.S.O. 2015")

    var leyendaVotosPASO = d3.legend.color()
      .shapeWidth(110)
      .cells([30000, 50000, 80000, 120000, 350000])
      .orient('horizontal')
      .scale(votoEscalaPASO);

    svg.select(".leyendaVotosPASO")
      .call(leyendaVotosPASO);

    $('#menu label').click(function(){


        referencia = $(this).find('input').attr('id');


        var leyendaCargo = $("svg .leyendaCargo"),
            leyendaVotos = $("svg .leyendaVotos"),
            leyendaVotosPASO = $("svg .leyendaVotosPASO"),
            titulo = $(".title"),
            contenido = $(".context");

        

       

        if (referencia === "tiempo") {

           console.log("tiempo");

          leyendaCargo.show(1500);
          leyendaVotos.hide("fast");
          leyendaVotosPASO.hide("fast");

          titulo.html("Mapa de los intendentes en el conurbano");
          contenido.html("¿Quiénes son y cuánto tiempo hace que gobiernan?¿A qué espacio político pertenecen? Éstos son los 24 intendentes de los partidos del Gran Buenos Aires.");

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
        } else if (referencia === "votos_2011") {

          leyendaCargo.hide("fast");
          leyendaVotos.show(1500);
          leyendaVotosPASO.hide("fast");

          titulo.html("¿Cómo les fue en el 2011?");
          contenido.html("Éste es el mapa del desempeño electoral de cada uno de los intendentes en las elecciones de 2011.");

          colorText.domain([d3.min(data, function(d) { return d.properties[referencia]; }), d3.max(data, function(d) { return d.properties[referencia]; })]);
          votoColor2011.domain([d3.min(data, function(d) { return d.properties[referencia]; }), d3.max(data, function(d) { return d.properties[referencia]; })]);

          d3.selectAll(".distrito")
              .transition()
              .duration(1500)
              .delay(function(d, i) { return i / data.length * 500; })
              .style("fill", function (d) {
                return votoColor2011(d.properties[referencia]);
              });

          d3.selectAll(".place-label")
            .transition()
            .duration(1600)
            .style("fill", function(d) {
              return colorText(d.properties[referencia]);
            });
          
        } else if (referencia === "votos_p2015") {

          leyendaCargo.hide("fast");
          leyendaVotos.hide("fast");
          leyendaVotosPASO.show(1500);

          titulo.html("¿Cómo les fue en 2015?");
          contenido.html("En este mapa encontrás la cantidad de votos que obtuvieron los candidatos a las intendencias en las P.A.S.O. 2015 y cómo se posicionan frente a las Elecciones Generales de octubre. ");
          
          colorText.domain([d3.min(data, function(d) { return d.properties[referencia]; }), d3.max(data, function(d) { return d.properties[referencia]; })]);
          votoColorPASO.domain([d3.min(data, function(d) { return d.properties[referencia]; }), d3.max(data, function(d) { return d.properties[referencia]; })]);

          d3.selectAll(".distrito")
              .transition()
              .duration(1500)
              .delay(function(d, i) { return i / data.length * 500; })
              .style("fill", function (d) {
                return votoColorPASO(d.properties[referencia]);
              });

          d3.selectAll(".place-label")
            .transition()
            .duration(1600)
            .style("fill", function(d) {
              return colorText(d.properties[referencia]);
            });

        }

        resetMap();



       
        
    });
  };


  function clicked(d) {

    if (active.node() === this) return resetMap();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = 0.6 / Math.max(dx / width, dy / height),
        translate = [width / 2 - scale * x-200, height / 2 - scale * y];




    ficha
      .data(data)
    ficha.select('.ficha-intendente').html("Intendente: <strong>"+d.properties.intendente+"</strong>");
    ficha.select('.ficha-distrito').html("Municipio: <strong>"+d.properties.distrito+"</strong>");
    ficha.select('.ficha-frente_2011').html("Frente - Alianza: <strong>"+d.properties.frente_2011+"</strong>");
    ficha.select('.ficha-tiempo').html("Años en el cargo: <strong>"+d.properties.tiempo+"</strong>");
    ficha.select('.ficha-mandatos').html("Mandatos: <strong>"+d.properties.mandatos+"</strong>");
    ficha.select('.ficha-antes').html("Sucedió a: <strong>"+d.properties.antes+"</strong>");
    ficha.select('.ficha-compite').html("Cargo por el que compite en 2015: <strong>"+d.properties.compite+"</strong>");
    ficha.select('.ficha-frente_2011').html("<h4>Elecciones 2011</h4>Frente 2011: <strong>"+d.properties.frente_2011+"</strong>");
    ficha.select('.ficha-pt2011').html("Desempeño electoral: <strong>"+d.properties.pt2011+"%</strong>.");
    ficha.select('.ficha-frente_alianza_2015').html("<h4>Elecciones P.A.S.O. 2015</h4>Frente - Alianza 2015: <strong>"+d.properties.frente_alianza_2015+"</strong>");
    ficha.select('.ficha-ptp2015').html(function () {
      if (d.properties.ptp2015.length == 0) {
          console.log(d.properties.ptp2015);
          return "Desempeño electoral: <strong>No reelige</strong>.";
        } else {
          return "Desempeño electoral: <strong>"+d.properties.ptp2015+"%</strong>.";
        }
      });
    ficha.select('.ficha-generales').html("Situación frente a las elecciones de octubre: <strong>"+d.properties.generales+"</strong>");

    svg.transition()
        .duration(1500)
        .call(zoom.translate(translate).scale(scale).event);

  }

  function resetMap() {
    active.classed("active", false);
    active = d3.select(null);
    
    svg.transition()
        .duration(2000)
        .call(zoom.translate([0, 0]).scale(1).event);
  }

  function zoomed(d) {
    g.style("stroke-width", 4 / d3.event.scale + "px");
    g.attr("transform", "translate(" + (d3.event.translate) + ")scale(" + (d3.event.scale) + ")");
    // g.selectAll(".place-label").style("font-size",1.5*d3.event.scale);
    // g.selectAll(".place-label")
    //   .transition().duration(1000)
    //   .style("fill-opacity", 1);
    // if (active.node() && path.area(d) < 9000 ) {
    //   console.log("This is a large place!");
    // } else if (active.node() && path.area(d) < 2000) {
    //   console.log("Not so large place!");
    // }
    /*
    console.log(active.node())
    g.selectAll(".place-label")
     .transition().duration(1000).style("font-size",0.5*d3.event.scale).style("fill-opacity", "1");
    */
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

  /**
   * sidebarEffects.js v1.0.0
   * http://www.codrops.com
   *
   * Licensed under the MIT license.
   * http://www.opensource.org/licenses/mit-license.php
   * 
   * Copyright 2013, Codrops
   * http://www.codrops.com
   */

    function hasParentClass( e, classname ) {
      if(e === document) return false;
      if( classie.has( e, classname ) ) {
        return true;
      }
      return e.parentNode && hasParentClass( e.parentNode, classname );
    }

    // http://coveroverflow.com/a/11381730/989439
    function mobilecheck() {
      var check = false;
      (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    }

    function init() {

      var container = document.getElementById('st-container' ),
                  reset = document.getElementById( 'closeMenu' ),
        buttons = Array.prototype.slice.call( document.querySelectorAll( '#conurbano > svg > g > path' ) ),
        // event type (if mobile use touch events)
        eventtype = mobilecheck() ? 'touchstart' : 'click',
        resetMenu = function() {
          classie.remove( container, 'st-menu-open' );
        },
        bodyClickFn = function(evt) {
          resetMap();
          if( !hasParentClass( evt.target, 'st-menu' ) ) {
            console.log(!hasParentClass( evt.target, 'st-menu' ))
            resetMenu();
            document.removeEventListener( eventtype, bodyClickFn );
          }
        },
        resetClickFn = function(evt) {
          if (evt.target == reset) {
            resetMenu();
            document.removeEventListener(eventtype, bodyClickFn);
          }
        };

      // console.log(buttons);

      buttons.forEach( function( el, i ) {
        var effect = el.getAttribute( 'data-effect' );



        // console.log(effect);

        el.addEventListener( eventtype, function( ev ) {
          ev.stopPropagation();
          ev.preventDefault();
          container.className = 'st-container'; // clear
          classie.add( container, "ficha" );
          setTimeout( function() {
            classie.add( container, 'st-menu-open' );
          }, 25 );
          document.addEventListener( eventtype, bodyClickFn );
          document.addEventListener( eventtype, resetClickFn );
          console.log("Run!");
        });
      } );

    }


})();

// Smoothscroll via CSS Tricks.

$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});

// http://stackoverflow.com/a/16877175/1250044
var normalize = (function () {
    var map = {
            "À": "A",
            "Á": "A",
            "Â": "A",
            "Ã": "A",
            "Ä": "A",
            "Å": "A",
            "Æ": "AE",
            "Ç": "C",
            "È": "E",
            "É": "E",
            "Ê": "E",
            "Ë": "E",
            "Ì": "I",
            "Í": "I",
            "Î": "I",
            "Ï": "I",
            "Ð": "D",
            "Ñ": "N",
            "Ò": "O",
            "Ó": "O",
            "Ô": "O",
            "Õ": "O",
            "Ö": "O",
            "Ø": "O",
            "Ù": "U",
            "Ú": "U",
            "Û": "U",
            "Ü": "U",
            "Ý": "Y",
            "ß": "s",
            "à": "a",
            "á": "a",
            "â": "a",
            "ã": "a",
            "ä": "a",
            "å": "a",
            "æ": "ae",
            "ç": "c",
            "è": "e",
            "é": "e",
            "ê": "e",
            "ë": "e",
            "ì": "i",
            "í": "i",
            "î": "i",
            "ï": "i",
            "ñ": "n",
            "ò": "o",
            "ó": "o",
            "ô": "o",
            "õ": "o",
            "ö": "o",
            "ø": "o",
            "ù": "u",
            "ú": "u",
            "û": "u",
            "ü": "u",
            "ý": "y",
            "ÿ": "y",
            "Ā": "A",
            "ā": "a",
            "Ă": "A",
            "ă": "a",
            "Ą": "A",
            "ą": "a",
            "Ć": "C",
            "ć": "c",
            "Ĉ": "C",
            "ĉ": "c",
            "Ċ": "C",
            "ċ": "c",
            "Č": "C",
            "č": "c",
            "Ď": "D",
            "ď": "d",
            "Đ": "D",
            "đ": "d",
            "Ē": "E",
            "ē": "e",
            "Ĕ": "E",
            "ĕ": "e",
            "Ė": "E",
            "ė": "e",
            "Ę": "E",
            "ę": "e",
            "Ě": "E",
            "ě": "e",
            "Ĝ": "G",
            "ĝ": "g",
            "Ğ": "G",
            "ğ": "g",
            "Ġ": "G",
            "ġ": "g",
            "Ģ": "G",
            "ģ": "g",
            "Ĥ": "H",
            "ĥ": "h",
            "Ħ": "H",
            "ħ": "h",
            "Ĩ": "I",
            "ĩ": "i",
            "Ī": "I",
            "ī": "i",
            "Ĭ": "I",
            "ĭ": "i",
            "Į": "I",
            "į": "i",
            "İ": "I",
            "ı": "i",
            "Ĳ": "IJ",
            "ĳ": "ij",
            "Ĵ": "J",
            "ĵ": "j",
            "Ķ": "K",
            "ķ": "k",
            "Ĺ": "L",
            "ĺ": "l",
            "Ļ": "L",
            "ļ": "l",
            "Ľ": "L",
            "ľ": "l",
            "Ŀ": "L",
            "ŀ": "l",
            "Ł": "l",
            "ł": "l",
            "Ń": "N",
            "ń": "n",
            "Ņ": "N",
            "ņ": "n",
            "Ň": "N",
            "ň": "n",
            "ŉ": "n",
            "Ō": "O",
            "ō": "o",
            "Ŏ": "O",
            "ŏ": "o",
            "Ő": "O",
            "ő": "o",
            "Œ": "OE",
            "œ": "oe",
            "Ŕ": "R",
            "ŕ": "r",
            "Ŗ": "R",
            "ŗ": "r",
            "Ř": "R",
            "ř": "r",
            "Ś": "S",
            "ś": "s",
            "Ŝ": "S",
            "ŝ": "s",
            "Ş": "S",
            "ş": "s",
            "Š": "S",
            "š": "s",
            "Ţ": "T",
            "ţ": "t",
            "Ť": "T",
            "ť": "t",
            "Ŧ": "T",
            "ŧ": "t",
            "Ũ": "U",
            "ũ": "u",
            "Ū": "U",
            "ū": "u",
            "Ŭ": "U",
            "ŭ": "u",
            "Ů": "U",
            "ů": "u",
            "Ű": "U",
            "ű": "u",
            "Ų": "U",
            "ų": "u",
            "Ŵ": "W",
            "ŵ": "w",
            "Ŷ": "Y",
            "ŷ": "y",
            "Ÿ": "Y",
            "Ź": "Z",
            "ź": "z",
            "Ż": "Z",
            "ż": "z",
            "Ž": "Z",
            "ž": "z",
            "ſ": "s",
            "ƒ": "f",
            "Ơ": "O",
            "ơ": "o",
            "Ư": "U",
            "ư": "u",
            "Ǎ": "A",
            "ǎ": "a",
            "Ǐ": "I",
            "ǐ": "i",
            "Ǒ": "O",
            "ǒ": "o",
            "Ǔ": "U",
            "ǔ": "u",
            "Ǖ": "U",
            "ǖ": "u",
            "Ǘ": "U",
            "ǘ": "u",
            "Ǚ": "U",
            "ǚ": "u",
            "Ǜ": "U",
            "ǜ": "u",
            "Ǻ": "A",
            "ǻ": "a",
            "Ǽ": "AE",
            "ǽ": "ae",
            "Ǿ": "O",
            "ǿ": "o",
            ".": ""
        },
        nonWord = /\W/g,
        mapping = function (c) {
            return map[c] || c; 
        };


    return function (str) {
        return str.replace(nonWord, mapping).replace(/\s+/g, '').replace('.', '').toLowerCase();
    };
}());