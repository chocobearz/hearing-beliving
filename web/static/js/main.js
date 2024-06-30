$(document).ready(function () {

    ///////////////////////////////////////////
    // Create plot, draw points and add zoom //
    ///////////////////////////////////////////


    var n = 15; // number of points
    var max = 100; // maximum of x and y

    // Radius of floating circle (cursor), also used in stroke-width of points
    var floatingCircleRadius = 8;

    // Algorithm used
    var alg = "tsne";

    // shape grouping
    var group = "n"

    // Used to allow export
    var labeled = false;

    var ctrlDown = false;
    var categoryColor = "black"; // Start color of floating circle

    // dimensions and margins
    var map = d3.select("#map")
    width = $("#map").width();
    height = $("#map").height();
    var margin = {
        top: (0 * width),
        right: (0 * width),
        bottom: (0 * width),
        left: (0 * width)
    };

    // create scale objects
    var xScale = d3.scaleLinear()
        .domain([-max, max])
        .range([0, width]);
    var yScale = d3.scaleLinear()
        .domain([-max, max])
        .range([height, 0]);

    // Declare these as identical for now, will be changed
    var new_xScale = xScale;
    var new_yScale = yScale;

    // Pan and zoom
    var zoom = d3.zoom()
        .scaleExtent([.1, 20])
        .extent([
            [0, 0],
            [width, height]
        ])
        .on("zoom", zoomed);

    // Append g-element to map
    var points_g = map.append("g")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr("clip-path", "url(#clip)")
        .classed("points_g", true);


    // Sample data
    var newData = []
    for (var i = 0; i < data.length; ++i) {
        if (i % 10 == 0) {
            newData.push(data[i])
        }
    }

    // Draw points, start random and change to tsne for visualisation
    drawPoints()
    changeAlgorithm()

    function drawPoints() {
        points = points_g.selectAll("circle").data(data);
        points = points.enter().append("circle")
            .classed("dot", true) // class = .dot
            .classed("activePoint", true) // class = .dot
            .classed("plot", true) // class = .plot
            .attr('cx', function (d) {
                return xScale(Math.random() * 200 - 100)
            }) // x
            .attr('cy', function (d) {
                return yScale(Math.random() * 200 - 100)
            }) // y
            .attr('r', 8) // radius
            .style('fill', function (d) {
                return d.color
            }) // color of point
            .attr('filename', function (d) {
                return d.filename
            })
            .attr('phone_position', function (d) {
                return d.phone_position
            })
            .attr('duration', function (d) {
                return d.duration
            })
            .attr('script', function (d) {
                return d.script
            })
            .attr('loudness', function (d) {
                return d.loudness
            })
            .attr('distress', function (d) {
                return d.distress
            })
            .attr('affect', function (d) {
                return d.affect
            })
            .attr('predicted_loudness', function (d) {
                return d.predicted_loudness
            })
            .attr('predicted_distress', function (d) {
                return d.predicted_distress
            })
            .attr('zero_crossing', function (d) {
                return d.zero_crossing
            })
            .attr('harmonics', function (d) {
                return d.harmonics
            })
            .attr('pauses', function (d) {
                return d.pauses
            })
            .attr('max_intensity', function (d) {
                return d.max_intensity
            })
            .attr('intensity', function (d) {
                return d.intensity
            })
            .attr('pitch', function (d) {
                return d.pitch
            })
            .attr('pitch_range', function (d) {
                return d.pitch_range
            })
            .attr('shimmer', function (d) {
                return d.shimmer
            })
            .attr('jitter', function (d) {
                return d.jitter
            })
            .attr('spectral_slope', function (d) {
                return d.spectral_slope
            })
            .attr('mean_mfcc', function (d) {
                return d.mean_mfcc
            })
            .attr('spectral_rolloff', function (d) {
                return d.spectral_rolloff
            })
            .attr('energy', function (d) {
                return d.energy
            })
            .attr('speechrate', function (d) {
                return d.speechrate
            })
            .style("stroke", "")
            .style('fill-opacity', 0.5) // a bit of transparency
            .style('stroke-width', 3) // width of invisible radius, used to trigger hover
            .style('stroke-opacity', 1.0) // Hide frame of points 
        // Add functionality for map again, they were overridden during drawing of datapoints
        map.style("pointer-events", "all")
        map.call(zoom)
        map.on("dblclick.zoom", null) // turn off double click zoom
    }

    function zoomed() {
        // create new scale ojects based on event
        new_xScale = d3.event.transform.rescaleX(xScale);
        new_yScale = d3.event.transform.rescaleY(yScale);
        points.data(data)
            .attr('cx', function (d) {
                if (alg == "tsne") {
                    return new_xScale(d.tsneX)
                } else if (alg == "pca") {
                    return new_xScale(d.pcaX)
                } else if (alg == "iso") {
                    return new_xScale(d.isoX)
                } else if (alg == "umap") {
                    return new_xScale(d.umapX)
                }
            })
            .attr('cy', function (d) {
                if (alg == "tsne") {
                    return new_yScale(d.tsneY)
                } else if (alg == "pca") {
                    return new_yScale(d.pcaY)
                } else if (alg == "iso") {
                    return new_yScale(d.isoY)
                } else if (alg == "umap") {
                    return new_yScale(d.umapY)
                }
            });
        d3.selectAll(".centroid").remove()
    }


    //////////////////
    // Mouse events // 
    //////////////////

    map.on("mousemove", function() {
        const [x, y] = d3.mouse(this);
        // Get the bounding rect of the SVG element
        const rect = this.getBoundingClientRect();

        // Convert the mouse position to element coordinates
        const elemX = x + rect.left;
        const elemY = y + rect.top;

        const element = document.elementFromPoint(elemX, elemY);
        if (element.tagName === 'circle') {
          const circle = d3.select(element);
          if (circle.style('visibility') !== "hidden") {
            document.getElementById("loudness").innerText = circle.attr('loudness')
            document.getElementById("duration").innerText = circle.attr('duration')
            document.getElementById("distress").innerText = circle.attr('distress')
            document.getElementById("affect").innerText = circle.attr('affect')
            document.getElementById("predicted_loudness").innerText = circle.attr('predicted_loudness')
            document.getElementById("predicted_distress").innerText = circle.attr('predicted_distress')
            document.getElementById("script").innerText = circle.attr('script')
            document.getElementById("phone_position").innerText = circle.attr('phone_position')
            document.getElementById("zero_crossing").innerText = circle.attr('zero_crossing')
            document.getElementById("harmonics").innerText = circle.attr('harmonics')
            document.getElementById("pauses").innerText = circle.attr('pauses')
            document.getElementById("max_intensity").innerText = circle.attr('max_intensity')
            document.getElementById("intensity").innerText = circle.attr('intensity')
            document.getElementById("pitch").innerText = circle.attr('pitch')
            document.getElementById("pitch_range").innerText = circle.attr('pitch_range')
            document.getElementById("shimmer").innerText = circle.attr('shimmer')
            document.getElementById("jitter").innerText = circle.attr('jitter')
            document.getElementById("spectral_slope").innerText = circle.attr('spectral_slope')
            document.getElementById("mean_mfcc").innerText = circle.attr('mean_mfcc')
            document.getElementById("spectral_rolloff").innerText = circle.attr('spectral_rolloff')
            document.getElementById("energy").innerText = circle.attr('energy')
            document.getElementById("speechrate").innerText = circle.attr('speechrate')
          }
        }
    })

    $(".plot").mousemove(function (ev) {
        drawFloatingCircle(ev);
    });

    $(".plot").mouseenter(function () {
        $('#floatingCircle').css({
            'visibility': '' + 'visible'
        });
    });

    $(".plot").mouseleave(function () {
        $('#floatingCircle').css({
            'visibility': '' + 'hidden'
        });
    });


    ////////////////
    // Key events // 
    ////////////////

    $(document).keydown(function (ev) {
        if (ev.ctrlKey) {
            ctrlDown = true;
            $("#startText").hide()
            $("#listeningText").show()
            $("#listeningMode").show()
        }
    });

    $(document).keyup(function (ev) {
        if (ctrlDown) {
            stopSounds();
            ctrlDown = false;
            $("#listeningText").hide()
            $("#listeningMode").hide()
            currentSegmentStartTimes = [];
        }
    });


    ////////////
    // Clicks // 
    ////////////

    map.on("click", function() {
        const [x, y] = d3.mouse(this);
        // Get the bounding rect of the SVG element
        const rect = this.getBoundingClientRect();

        // Convert the mouse position to element coordinates
        const elemX = x + rect.left;
        const elemY = y + rect.top;

        const element = document.elementFromPoint(elemX, elemY);
        if (element.tagName === 'circle') {
          const circle = d3.select(element);
          if (circle.style('visibility') !== "hidden") {
            var audio = new Audio(`http://localhost:3134/static/data/audio/${circle.attr("filename")}`)
            audio.play();
          }
        }
    });

    $("#snippetPropertiesGroup button").on("click", function () {
        if(this.value == "minusOpacity" & parseFloat($("#snippetOpacity").val()) > 0.1){
            $("#snippetOpacity").val((parseFloat($("#snippetOpacity").val()) - 0.1).toFixed(1))
            d3.selectAll(".activePoint").style("fill-opacity", $("#snippetOpacity").val())
        }
        else if(this.value == "plusOpacity" & $("#snippetOpacity").val() < 1 ){
            $("#snippetOpacity").val((parseFloat($("#snippetOpacity").val()) + 0.1).toFixed(1))
            d3.selectAll(".activePoint").style("fill-opacity", $("#snippetOpacity").val())
        }
        else if(this.value == "minusRadius" & $("#snippetRadius").val() > 1){
            $("#snippetRadius").val(parseFloat($("#snippetRadius").val()) - 1)
            d3.selectAll(".dot").style("r", $("#snippetRadius").val())
        }
        else if(this.value == "plusRadius" & $("#snippetRadius").val() < 25) {
            $("#snippetRadius").val(parseFloat($("#snippetRadius").val()) + 1)
            d3.selectAll(".dot").style("r", $("#snippetRadius").val())
        }
    })



    // Change algorithm, and therefor coords
    $(".buttonGroup2 button").on("click", function () {
        $(".buttonGroup2 button").removeClass("btn-dark")
        $(".buttonGroup2 button").addClass("btn-dark")
        $(this).removeClass("btn-dark")
        $(this).addClass("btn-success")
        alg = this.value;
        changeAlgorithm();
    });

    $(".buttonGroup3 button").on("click", function () {
        $(".buttonGroup3 button").removeClass("btn-dark")
        $(".buttonGroup3 button").addClass("btn-dark")
        $(this).removeClass("btn-dark")
        $(this).addClass("btn-success")
        group = this.value;
        changeGrouping();
    });

    $(".buttonGroup4 button").on("click", function () {
        $(".buttonGroup4 button").removeClass("btn-dark")
        $(".buttonGroup4 button").addClass("btn-dark")
        $(this).removeClass("btn-dark")
        $(this).addClass("btn-success")
        affect = this.value;
        changeAffect();
    });

    $("#buttonGroup8 button").on("click", function () {
        $("#buttonGroup8 button").removeClass("btn-dark")
        $("#buttonGroup8 button").addClass("btn-dark")
        $(this).removeClass("btn-dark")
        $(this).addClass("btn-success")

        sampling = parseInt(this.value);

        d3.selectAll(".dot")
            .classed("activePoint", true)
            .style("visibility", "visible")
            .each(function (d, i) {
                if (i % sampling != 0) {
                    d3.select(this).style("visibility", "hidden")
                    d3.select(this).classed("activePoint", false);
                }
            })
    });

    $("#buttonGroup9 button").on("click", function () {
        colorWithKmeans(this.value);
    });

    var gradient = 50;
    $("#gradientSlider").val(gradient);
    $("#gradientSliderText").text("Gradient: " + gradient);

    $("#gradientSlider").on("mousemove", function () {
        gradient = this.value;
        $("#gradientSliderText").text("Gradient: " + gradient);
    })

    $("#buttonGroup11 button").on("click", function () {
        filterPredictions(this.value);
    });


    /////////////////////
    // Misc. functions // 
    /////////////////////

    function drawFloatingCircle(ev) {
        // Draws floating circle
        $('#floatingCircle').css({
            'left': '' + ev.pageX - (floatingCircleRadius / 2) + 'px',
            'top': '' + ev.pageY - (floatingCircleRadius / 2) + 'px',
            'width': '' + floatingCircleRadius + 'px',
            'height': '' + floatingCircleRadius + 'px',
            'background-color': categoryColor,
            'background-image': 'radial-gradient(circle, ' + categoryColor + ' ' + (gradient - 30) + '%, white 100%)'
        });
    }

    function changeAlgorithm() {
        var circle = map.selectAll(".dot");
        circle.transition()
            .duration(3000)
            .attr('cx', function (d) {
                if (alg == "tsne") {
                    return new_xScale(d.tsneX)
                } else if (alg == "pca") {
                    return new_xScale(d.pcaX)
                } else if (alg == "iso") {
                    return new_xScale(d.isoX)
                } else if (alg == "umap") {
                    return new_xScale(d.umapX)
                }
            })
            .attr('cy', function (d) {
                if (alg == "tsne") {
                    return new_yScale(d.tsneY)
                } else if (alg == "pca") {
                    return new_yScale(d.pcaY)
                } else if (alg == "iso") {
                    return new_yScale(d.isoY)
                } else if (alg == "umap") {
                    return new_yScale(d.umapY)
                }
            })
    }

    function changeGrouping() {
        var circle = map.selectAll(".dot").data(data);
        //circle.style("stroke", function(d) {
        //    if (group === 'n') {
        //      return ""
        //    } else {
        //      return "#34eb3d"
        //    }
        //  })
        circle.style("stroke", function(d) {
              if (group === 'l') {
                if (d.loudness === "Shouting") {
                    return "#34eb3d"
                } else if (d.loudness == "Talking"){
                    return "#eb34eb"
                }
              //} else if (group === 'd') {
              //  if (d.distress === "Distressed") {
              //      return ("2, 2")
              //    } else if (d.distress == "Not Distressed"){
              //      return ("7, 7")
              //    }
              //} else if (group === 'ld') {
              //  if ((d.loudness === "Shouting") && (d.distress === "Distressed")) {
              //      return ("1, 1")
              //    } else if ((d.loudness === "Shouting") && (d.distress === "Not Distressed")){
              //      return ("5, 5")
              //    } else if ((d.loudness === "Talking") && (d.distress === "Distressed")) {
              //      return ("10, 10")
              //    } else if ((d.loudness === "Talking") && (d.distress === "Not Distressed")) {
              //      return ("0, 0")
              //    }
              //}
    }})
    }

    function changeAffect() {
        var circle = map.selectAll(".dot").data(data);
        circle.style("stroke", function(d) {
            if (affect === 'off') {
              return ""
            } else if (affect === "on") {
              if (d.affect === 'anger') {
                return "#34eb3d"
              } else if(d.affect === 'joy') {
                return "#eb34eb"
              } else if (d.affect === 'disgust')  {
                return "#f74e05"
              } else if (d.affect === 'neutral')  {
                return "#05e7f7"
             } else if (d.affect === 'surprise')  {
                return "#fc0505"
             } else if (d.affect === 'sadness')  {
                return "#fcf005"
             }  else if (d.affect === 'fear')  {
                return "#0d05fc"
             }
            }
          })
    }

    function colorWithKmeans(clusterValue) {
        points.data(data)
            .style('fill', function (d) {
                if (clusterValue == "kcolor2") {
                    return d.kcolor2
                } else if (clusterValue == "kcolor3") {
                    return d.kcolor3
                } else if (clusterValue == "kcolor4") {
                    return d.kcolor4
                } else if (clusterValue == "kcolor5") {
                    return d.kcolor5
                } else if (clusterValue == "kcolor6") {
                    return d.kcolor6
                } else if (clusterValue == "kcolor7") {
                    return d.kcolor7
                } else if (clusterValue == "kcolor8") {
                    return d.kcolor8
                } else if (clusterValue == "kcolor20") {
                    return d.kcolor20
                } else if (clusterValue == "none") {
                    return d.color
                }
            })
    }

    function filterPredictions(filter) {
        d3.selectAll(".dot")
        .classed("activePoint", true)
        .style("visibility", "visible")
        .each(function (d) {
            if (filter === 'none') {
              console.log("none")
            }
            if (filter === 'cloud') {
              if (d.loudness !== d.predicted_loudness) {
                d3.select(this).style("visibility", "hidden")
                d3.select(this).classed("activePoint", false);
              }
            } else if (filter === 'iloud') {
              if (d.loudness === d.predicted_loudness) {
                d3.select(this).style("visibility", "hidden")
                d3.select(this).classed("activePoint", false);
              }
            } else if (filter === 'cdis') {
              if (d.distress !== d.predicted_distress) {
                d3.select(this).style("visibility", "hidden")
                d3.select(this).classed("activePoint", false);
              }
            }  else if (filter === 'idis') {
              if (d.distress === d.predicted_distress) {
                d3.select(this).style("visibility", "hidden")
                d3.select(this).classed("activePoint", false);
              }
              }
        })
    }

})
