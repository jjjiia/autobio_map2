$(function() {
	queue()
		.defer(d3.json, "data_inuse/R11381234_SL150.json")
		.defer(d3.json,"data_inuse/nyc_bg.geojson")
        .defer(d3.json, "data_inuse/nyc_outline.geojson")
        .defer(d3.json, "data_inuse/neighbors.json")
        .defer(d3.csv, "data_inuse/openpaths_mlotek123_id_duration.csv")
        .defer(d3.json, "data_inuse/id_totalDuration.json")
        .defer(d3.json, "data_inuse/socialExplorer_dictionary.json")
		.await(dataDidLoad);
})
var settings = {
    center:[-74.1,40.79],
    scale:80000
}
function dataDidLoad(error,socialExplorer,blockgroups,outline,neighbors,points,totalDurations,socialExplorerKey) {

    var w = window.innerWidth;
    var h = window.innerHeight;
    var mapSvg = d3.select("#map").append("div")
       .append("svg").attr("width",w)
.attr("height",900)
    //.attr("height",h)

    var visited = idsVisited(points)
    var allNeighbors = idsneighbors(visited,neighbors)
    
    var totalDurations = filterNoPop(socialExplorer, totalDurations)
    var noHomeDurations = filterHome(totalDurations)

    var allBgIds = Object.keys(socialExplorer)
    
    
    drawPaths(points);animatePaths(points)
    drawBuildings(blockgroups,visited,allNeighbors,socialExplorer)    
    removeBlanks(blockgroups, socialExplorer)
    nopop(blockgroups, socialExplorer)
    drawCityOutline(outline)
    heatmap(visited,totalDurations)
  //  heatmap(visited,totalDurations)
    var age = ["SE_T007_013","SE_T007_007","SE_T007_008"]
    var race = ["SE_T013_002","SE_T013_003","SE_T013_005","SE_T013_004","SE_T013_008","SE_T014_010"]
    var education =["SE_T025_002","SE_T025_003","SE_T025_004","SE_T025_005","SE_T025_006","SE_T025_007","SE_T025_008"]
    var employeement =["SE_T037_003","SE_T050_002","SE_T053_003"]
    var income = ["SE_T056_002","SE_T056_017","SE_T057_001"]
    var transportation = ["SE_T128_003","SE_T129_003","SE_T129_009"]
    
    var keyCodesToGraph = ["SE_T002_002","SE_T007_002","SE_T007_003","SE_T014_010",
    "SE_T007_004","SE_T007_005","SE_T007_006","SE_T007_007","SE_T007_008","SE_T007_009",
    "SE_T007_010","SE_T007_011","SE_T007_012","SE_T007_013","SE_T013_002","SE_T013_003","SE_T013_004",
    "SE_T013_005","SE_T013_006","SE_T013_007","SE_T013_008","SE_T150_002","SE_T150_003","SE_T150_004",
    "SE_T150_005","SE_T150_006","SE_T150_007","SE_T150_008","SE_T057_001","SE_T059_001","SE_T094_002","SE_T094_003","SE_T128_002","SE_T128_009","SE_T128_010",
    "SE_T128_003","SE_T128_005","SE_T128_006","SE_T128_008","SE_T129_003","SE_T129_005","SE_T129_004","SE_T129_006","SE_T129_007","SE_T129_008",
    "SE_T129_009","SE_T037_003","SE_T050_002","SE_T050_003","SE_T050_004","SE_T050_005","SE_T050_006","SE_T050_007","SE_T050_008","SE_T050_009",
    "SE_T050_010","SE_T050_011","SE_T050_012","SE_T050_013","SE_T050_014",
    "SE_T099_002","SE_T099_003","SE_T099_004","SE_T099_005","SE_T099_006",
    "SE_T099_007","SE_T099_008","SE_T109_002"]
    
    
   // d3.select("#data").on("click",function(){
        var chartAnnotation = d3.select("#charts").append("div").attr("class","row")
         chartAnnotation.append("div").attr("class","col-md-5 chartHeader").html("   My New York City<br/> &darr;")
         chartAnnotation.append("div").attr("class","col-md-5 chartHeader").html("All of New York City <br/>&darr;")
        
        graphBarGroups(income,"Income")
        graphBarGroups(race,"Race and Ethnicity")
        graphBarGroups(transportation,"Commute")
        graphBarGroups(age,"Age")
        graphBarGroups(education,"Education")
        graphBarGroups(employeement,"Employeement")
        
 //   })
    function scrollTo(buttonName, scrollName){
        d3.select(buttonName).on("click",function(){$('html,body').animate({scrollTop: $(scrollName.split(" ").join("_")).offset().top},'slow');})
    }
    scrollTo("#income","#Income")
    scrollTo("#race","#Race_and_Ethnicity")
    scrollTo("#commute","#Commute")
    scrollTo("#age","#Age")
    scrollTo("#education","#Education")
    scrollTo("#employeement","#Education")
    scrollTo("#mapbutton","#map")

  function graphBarGroups(keyCodesToGraph,groupName){
      d3.select("#charts").append("div").html(groupName).attr("class","chartGroup ").attr("id",groupName.split(" ").join("_"))
      for(var i in keyCodesToGraph){
//      console.log(i)
      var keyCode = keyCodesToGraph[i]
      var keyCatetory = socialExplorerKey[keyCodesToGraph[i].replace("SE_","")]
      var title1 = "Block group I visited the last month:"
      var title2 = "If I spent the same amount of time in every block group:"
      
      //var key = "SE_T013_002"
      var visitedBar = formatDataForVisitedBg(socialExplorer, keyCode,noHomeDurations,1000)
      var all = formateDataForAllBg(socialExplorer,keyCode,1000)
      d3.select("#charts").append("div").html(socialExplorerKey[keyCode.replace("SE_","")]).attr("class","chartPairHeader")
      bar(noHomeDurations,socialExplorer,socialExplorerKey,visitedBar,title1,socialExplorerKey[keyCode.replace("SE_","")],"myTime")    
      bar(totalDurations,socialExplorer,socialExplorerKey,all,title2,socialExplorerKey[keyCode.replace("SE_","")],"allTime")
  }
}
    d3.select("#group").on("click",function(){moveVisited(blockgroups,Object.keys(totalDurations))})
    d3.select("#path").on("click",function(){drawPaths(points);animatePaths(points)})
    d3.select("#path2").on("click",function(){animatePaths(points)})
    d3.select("#dot").on("click",function(){drawDot(points)})
    d3.select("#heatmap").on("click",function(){heatmap(visited,totalDurations)})
    d3.select("#back").on("click",function(){ 
        d3.selectAll(".chartHeader").html("<br/><br/><br/>")
        end(allBgIds)
    })
    }

function end(allBgIds){
d3.selectAll(".heatMapKey").remove()
var colors =["#e9563e","#63e743","#a4ea35","#5cf07f","#40bf37","#ea471c",
"#48e7b6","#df6860","#4ccb6f","#e57e20","#379f54","#3ba025","#f18c58","#9de866","#9fed93","#eca821","#579233","#e1a348","#74bc3b","#ddbf29","#83bf68","#e0f23c","#d6ed75",
"#7e9726","#dfda39","#bfab42","#9bbd20","#e9d56a","#adc450"]
    for(var i in allBgIds){
        var gid =allBgIds[i]
        
        var py = parseFloat(d3.select("._"+gid).attr("px"))

        d3.select("._"+gid).style("stroke","none").transition().duration(1000).delay(i%100*50)
       //     .style("opacity",1)
            .style("fill",colors[i%(colors.length-1)])
        .attr("transform",function () {
                return "translate("+0+","+0-py+")";})
        }
      //  d3.selectAll(".notVisited").style("fill","red").style("opacity",.2)
      //  d3.selectAll(".neighbor").style("fill","red").style("opacity",.5)
      //  d3.selectAll(".visited").style("fill","red")
        d3.selectAll(".nopop").style("fill","none")
         for(var i in allBgIds){
        var gid =allBgIds[i]
        d3.select("._"+gid).style("stroke","none").transition().duration(1000).delay(i%100*50+5000).style("opacity",0)
         }
}

function filterHome(totalDurations){
    var tempArray = []
    for(var i in totalDurations){
        var gid = i
        var duration = totalDurations[i]
        tempArray.push({gid:i, duration:duration})
    }
    
    var sorted = tempArray.sort(function(a, b) {
            return parseFloat(b.duration) - parseFloat(a.duration);
        });
        var noHome = sorted.splice(1, sorted.length-1);
    
    var noHomeDictionary = {}
    for(var j in noHome){
        noHomeDictionary[noHome[j].gid]=noHome[j].duration
    }
      return noHomeDictionary 
}
function filterNoPop(socialExplorer, totalDurations){
    var filtered = {}
    for(var i in totalDurations){
        var gid = i
        var pop = socialExplorer[i]["SE_T001_001"]
        var income = socialExplorer[i]["SE_T057_001"]
        if(pop != 0 && income!=0){
            filtered[gid]=totalDurations[i]
        }
    }
    return filtered
}
function heatmap(visited,totalDurations){
  //  d3.selectAll(".lines").remove()
//    d3.selectAll(".lines2").remove()
   // d3.selectAll('.boroughs').remove()
    
    var scale = d3.scale.linear().domain([60*10, 24*60*60]).range(["orange","red"])
    for(var v in visited){
        var gid = visited[v]
        d3.select("._"+gid).style("fill",function(){
            return scale(parseFloat(totalDurations[gid]))
        })
    }
    var svg = d3.select("#map svg")

    var gradient = svg.append("defs")
      .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");
        
    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "red")
        .attr("stop-opacity", 1);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "orange")
        .attr("stop-opacity", 1);
    var rect = svg.append("rect").attr("x",150).attr("y",200).attr("height",0).attr("width",10).style("opacity",0)
        .style("fill", "url(#gradient)").transition().duration(1000).attr("height",100).style("opacity",1).attr("class","heatMapKey");
    var label1 = svg.append("text").attr("x",165).attr("y",200+15).text("10% of total time or more").attr("class","heatMapKey")
    var label1 = svg.append("text").attr("x",165).attr("y",300-5).text("2% of total time or less").attr("class","heatMapKey").style("opacity",0).transition().delay(900).style("opacity",1)
}
function totalDuration(totalDurations){
    var total = 0
    for(var i in totalDurations){
        var duration = parseFloat(totalDurations[i])
        total+=duration
    }
    return total
}
function formatDataForVisitedBg(socialExplorer, dataKey,totalDurations,interval){
    var formatted = {}
    var totalSeconds = totalDuration(totalDurations)
    var total = 0
    for(var i in totalDurations){
        var gid = i
        var duration = Math.round(parseInt(totalDurations[i])/totalSeconds*10000)/100
        if(dataKey.split("_")[2]=="001"){
            var value = Math.round(socialExplorer[i][dataKey]/interval)*interval
        }else{
            var totalKey = dataKey.split("_")[0]+"_"+dataKey.split("_")[1]+"_001"
            var total =socialExplorer[i][totalKey]
            var value = Math.round(socialExplorer[i][dataKey]/total*100)
        }
            total+=duration
        
        if( formatted[value] != undefined){
            formatted[value]=formatted[value]+duration
        }else{
            formatted[value]=duration
        }
    }
    
    var formattedArray = []
    for(var j in formatted){
        formattedArray.push({value:parseInt(j), percent:formatted[j]})
    }
        var sorted = formattedArray.sort(function(a, b) {
            return parseFloat(b.value) - parseFloat(a.value);
    });
    cumulative = 0
    for(var k in sorted){
        var entry = sorted[k]
        sorted[k]["cumulative"]=cumulative
        var cumulative = cumulative+entry.percent
    }
    
    return sorted
}
function formateDataForAllBg(socialExplorer, dataKey,interval){
    
    var totalSeconds = 0
    var formatted = {}
    for(var i in socialExplorer){
        var gid = i
        if(dataKey.split("_")[2]=="001"){
            var value = Math.round(socialExplorer[i][dataKey]/interval)*interval
        }else{
            var totalKey = dataKey.split("_")[0]+"_"+dataKey.split("_")[1]+"_001"
            var total =socialExplorer[i][totalKey]
            var value = Math.round(socialExplorer[i][dataKey]/total*100)
        }
      //  console.log(socialExplorer)
        if(socialExplorer[i][dataKey]!=0){
            totalSeconds=totalSeconds+1
            if (formatted[value]!=undefined){
                formatted[value] = formatted[value]+1
            }else{
                formatted[value]=1
            }
        }   
    }

    formattedArray = []
    for(var j in formatted){
        var percentDuration = Math.round(formatted[j]/totalSeconds*10000)/100
        formattedArray.push({value:parseInt(j), percent:percentDuration})
    }
    var sorted = formattedArray.sort(function(a, b) {
        return parseFloat(b.value) - parseFloat(a.value);
    });
    cumulative = 0
    for(var k in sorted){
        var entry = sorted[k]
        sorted[k]["cumulative"]=cumulative
        var cumulative = cumulative+entry.percent
    }
   // console.log(sorted)
    return sorted
}

function bar(totalDurations,socialExplorer,socialExplorerKey,formattedData,title,yAxisLabel,className){
    var totalSeconds = totalDuration(totalDurations)
    var entry = socialExplorer["360850291043"]
    var height = 140
    var width = 400
    var svg = d3.select("#charts").append("svg")
    .attr("width",width+120).attr("height",height+80)
    svg.append("text").text(title).attr("x",10).attr("y",20).attr("class","chartTitle")
    
    var svg = svg.append("g").attr("transform", "translate(80,50)")
    
    svg.append("text").text("% of time spent at census block group").attr("class","axisName").attr("x",width/2).attr("y",height+15).attr("text-anchor","middle")
    svg.append("text").text(yAxisLabel.split("(")[0]).attr("class","vertical-text").attr("x",-60).attr("y",height/2).attr("text-anchor","middle")
    
    var barW = 4

    var incomeScale = d3.scale.linear().range([0,height])
    var incomeAxisScale = d3.scale.linear().range([height,0])
    
    var barTip = d3.tip()    
        .attr('class', 'd3-tip')

    var percentageScale = d3.scale.linear().domain([0,100]).range([0,width])

    var max = d3.max(formattedData, function(d) { return d.value; })
    if(max<=100){
        incomeScale.domain([0,100])
        incomeAxisScale.domain([0,100])
    }else{
           incomeScale.domain(d3.extent(formattedData, function(d) { return d.value; }));    
       incomeAxisScale.domain(d3.extent(formattedData, function(d) { return d.value; }));    
    }
    
    var cScale = d3.scale.linear().domain([60*60, 24*60*60]).range(["orange","red"])
    
    for(var i in Object.keys(totalDurations)){
       var gid = Object.keys(totalDurations)[i]
        d3.select("._"+gid).transition().duration(1000).delay(i*1000).attr
    }
    
    var xAxis = d3.svg.axis()
        .scale(percentageScale)
        .orient("bottom")
        .ticks(0);
 
    var yAxis = d3.svg.axis()
        .scale(incomeAxisScale)
        .orient("left")
        .ticks(3)
        .tickFormat( function(d) { return d } );
        svg.call(barTip)
    var graph = svg.selectAll("rect")
                .data(formattedData)
                .enter()
                .append("rect")
                .attr("class",function(d){ return "_"+d+" bargraph"})
                .attr("y",function(d,i){
                    return height-incomeScale(d.value)
                })
                .attr("width",function(d){
                   return percentageScale(d.percent)
                })
                .attr("height",function(d){
                   return incomeScale(d.value)
                })
                .attr("x",function(d,i){
                    return percentageScale(d.cumulative)
                })
                .style("fill",function(d,i){
                   // console.log(d.percent)
                    return cScale(d.percent/100*totalSeconds)
                })
                .attr("opacity",.7)
                .attr("class",className)
                .on("mouseover",function(d){
                    var barClass = d3.select(this).attr("class")
                    
                    if(d.value<=100){
                        var textValue = d.value+"%"
                    }else{
                        var textValue = "$"+d.value
                    }
                    barTip.html(function() {
                        if(barClass=="myTime"){
                            return Math.round(d.percent)+"% of my time is spent at places with "+textValue+" "+yAxisLabel
                            
                        }else{
                            return Math.round(d.percent)+"% of places have "+textValue+" "+yAxisLabel
                            
                        }
                    })
                    barTip.show()
                    
                })
                .on("mouseout",function(){barTip.hide()})
    var minThreshold = 3
    var label = svg.selectAll("text")
                .data(formattedData)
                .enter()
                .append("text")
                .attr("class","x axis")
                .text(function(d){
                    if(Math.round(d.percent)>minThreshold){ 
                        return Math.round(d.percent)+"%"
                    }
                    else {return ""}
                })
                .attr("text-anchor","middle")
                .attr("x",function(d,i){return percentageScale(d.cumulative)+percentageScale(d.percent)/2})
                .attr("y",function(d,i){return height-incomeScale(d.value)-3})
                
   // var labelMarkerL = svg.selectAll(".labelMarkersL")
   //             .data(formattedData)
   //             .enter()
   //             .append("rect")
   //             .attr("class","labelMarkersL")
   //             .style("fill","black")
   //             .attr("height",function(d){return 6})
   //             .attr("width",function(d){
   //                 if(Math.round(d.percent)>minThreshold){ return 1}
   //                 else {return 0}
   //             })
   //             .attr("x",function(d,i){return percentageScale(d.cumulative)})
   //             .attr("y",function(d,i){return height})           
   // var labelMarkerL = svg.selectAll(".labelMarkersR")
   //             .data(formattedData)
   //             .enter()
   //             .append("rect")
   //             .attr("class","labelMarkersR")
   //             .style("fill","black")
   //             .attr("height",function(d){return 6})
   //             .attr("width",function(d){
   //                 if(Math.round(d.percent)>minThreshold){ return 1}
   //                 else {return 0}
   //             })
   //             .attr("x",function(d,i){return percentageScale(d.cumulative)+percentageScale(d.percent)})
   //             .attr("y",function(d,i){return height})              
   // var labelMarkerB = svg.selectAll(".labelMarkersB")
   //             .data(formattedData)
   //             .enter()
   //             .append("rect")
   //             .attr("class","labelMarkersR")
   //             .style("fill","black")
   //             .attr("height",function(d){return 1})
   //             .attr("width",function(d){
   //                 if(Math.round(d.percent)>minThreshold){ return percentageScale(d.percent)}
   //                 else {return 0}
   //             })
   //             .attr("x",function(d,i){return percentageScale(d.cumulative)})
   //             .attr("y",function(d,i){return height+6})                      
   // var labelMarkerB2 = svg.selectAll(".labelMarkersB2")
   //             .data(formattedData)
   //             .enter()
   //             .append("rect")
   //             .attr("class","labelMarkersB2")
   //             .style("fill","black")
   //             .attr("height",function(d){return 15})
   //             .attr("width",function(d){
   //                 if(Math.round(d.percent)>minThreshold){ return 1}
   //                 else {return 0}
   //             })
   //             .attr("x",function(d,i){return percentageScale(d.cumulative)+percentageScale(d.percent)/2})
   //             .attr("y",function(d,i){return height+6})     
    svg.append("g")
                .attr("class", "x axis").call(xAxis)
                .attr("transform", "translate(0," + height + ")")
                
    svg.append("g")
                .attr("class", "y axis").call(yAxis) 
}

function animatePaths(points){
    d3.select(".marker").remove()
    var path = d3.select(".lines2")
    var totalLength = 100
            path.attr("stroke-dasharray", totalLength + " " + totalLength*10).style("opacity",.3)
                    .attr("stroke-dashoffset", totalLength*150)
                    .transition()
                    .duration(100000)
                    .ease("linear")
                    .attr("stroke-dashoffset", -totalLength*20);
}
function drawPaths(points){
    
    var projection = d3.geo.mercator().scale(settings.scale).center(settings.center)
    var line = d3.svg.line()
        .y(function(d) { 
            var lat = parseFloat(d.lat)
            var lng = parseFloat(d.lng)
            var projectedLat = projection([lat,lng])[1]
            return projectedLat
        })
        .x(function(d) {
            var lat = parseFloat(d.lat)
            var lng = parseFloat(d.lng)
            var projectedLon = projection([lat,lng])[0]
        
           // console.log([projection([lat,lng])[0],projection([lat,lng])[1]])
            return projectedLon
        });
    var svg = d3.select("#map svg")
    var path = svg//.selectAll(".paths")
        .append("path")
        .attr("d", line(points))
        .attr("class", "lines")
        .style("stroke", "black" )
        .style("fill","none")
        .style("opacity",0)
        .style("stroke-width",1)
        .transition()
        .duration(1000)
        .style("opacity",.1)
        
        
    var path2 = svg//.selectAll(".paths")
        .append("path")
        .attr("d", line(points))
        .attr("class", "lines2")
        .style("stroke", "black" )
        .style("fill","none")
        .style("opacity",0)
        .style("stroke-width",1)
        .transition()
        .duration(1000)
        .style("opacity",.1)
}
function drawDot(points){
        
    var projection = d3.geo.mercator().scale(settings.scale).center(settings.center)    
    
   
    var startPointLat = points[0].lat
    var startPointLng = points[0].lng
    var projectedLat = projection([startPointLat,startPointLng])[0]
    var projectedLng = projection([startPointLat,startPointLng])[1]

    var svg = d3.select("#map svg")
        var g = svg.append("g")           
            .attr("transform","translate("+projectedLat+","+projectedLng+")")

        var marker = g.append("circle").attr("class","marker");
             marker.attr("r", 7).attr("fill","none")
        blink()

        
    var timeScale = d3.scale.linear().domain([0,60*60*2]).range([0,1000])
    var cScale = d3.scale.linear().domain([0,24*60*6]).range(["#fff","red"])

    var segment = 0
    var wait =0
    var totalTime=0
    var maxTime = 0
    var startOpacity = 1

        for(var i in points){
        //        setTimeout(function() {
                   var point = points[parseInt(i)]
                   var lat = parseFloat(point.lat)
                   var lng = parseFloat(point.lng)
                   var projectedLat = projection([lat,lng])[0]
                   var projectedLng = projection([lat,lng])[1]
            
                    
                    wait = wait+ parseFloat(points[segment].durationSeconds)
                    g.transition()
                    .duration(500)
                   //.delay(segment*100)
                   .delay(Math.round(timeScale(parseInt(wait))))
                    .attr("transform",function () {
                        //console.log([ Math.round(timeScale(parseInt(wait))), projectedLat,projectedLng])
                        return "translate("+projectedLat+","+projectedLng+")";
                    })
                    segment++
        }
        var totalLength = 100
//        path.attr("stroke-dasharray", totalLength + " " + totalLength*10)
//                .attr("stroke-dashoffset", totalLength*20000)
//                .transition()
//                .duration(wait)
//                .ease("linear")
//                .attr("stroke-dashoffset", -totalLength*20);
        
    function blink(){
        marker.style("r",8).style("opacity",.3).style("stroke-width",2)
        .transition().style("fill","black").style("opacity",0.7)
        .duration(600).style("r",5)
        .transition()
        .duration(400).style("opacity",.3).style("r",8)
        .each("end", blink);
    }

}
function idsVisited(points){
    var visited = []
    for(var p in points){
        var gid = points[p].gid
        if(visited.indexOf(gid)==-1){
            visited.push(gid)
        }
    }
    return visited
}
function idsneighbors(visited,neighbors){
    var allNeighbors = []
    for(var p in visited){
        var gid = visited[p]
        var gidNeighbors = neighbors[gid]
        for(var n in gidNeighbors){
            var ngid = gidNeighbors[n]
            if(visited.indexOf(ngid)==-1 && allNeighbors.indexOf(ngid)==-1){
                allNeighbors.push(ngid)
            }
        }        
    }
    return allNeighbors
}
function moveVisited(blockgroups,list){    
    var projection = d3.geo.mercator().scale(settings.scale).center(settings.center)    
    var index = 0
    for(var b in blockgroups.features){
        var geoid = blockgroups.features[b].properties.GEOID
        if(list.indexOf(geoid)>-1){
            index+=1
       //    var coordinates =  blockgroups.features[b].geometry.coordinates[0][0]
       //    var plng = projection([coordinates[0],coordinates[1]])[0]
       //    var plat = projection([coordinates[0],coordinates[1]])[1]
       //    var x= parseInt(index/100)*10-plng+20
       //    var y = index%100*10-plat+20
            d3.select("._"+geoid)
                .transition().duration(1000).delay(index*2).style("fill","red")
               // .attr("transform",function () {
                 //   return "translate("+-1200+","+0+")";
                //})
        }else{
           var coordinates =  blockgroups.features[b].geometry.coordinates[0][0]
            while(coordinates.length !=2){
                coordinates=coordinates[0]
            }
           var plng = projection([coordinates[0],coordinates[1]])[0]
           var plat = projection([coordinates[0],coordinates[1]])[1]
           var x= parseInt(index/100)*10-plng+20
           var y = 800-plat
            if(isNaN(y)==true){
                d3.select("._"+geoid).attr("opacity",0)
            }
            d3.select("._"+geoid)
                .transition().duration(1000).delay(1000+index%20*30).style("fill","#fffff2")
                .attr("transform",function () {                    
                    return "translate("+0+","+y+")";
                })
        }        
    }
}
function nopop(blockgroups, socialExplorer){
    
    for(var b in blockgroups.features){
        var geoid = blockgroups.features[b].properties.GEOID
        var population = socialExplorer[geoid][populationKey]
        var populationKey = "SE_T001_001"
        if(population ==0 || population ==""){
            d3.select("._"+geoid).style("opacity",0).attr("class","_"+geoid+" nopop")
        }
    }
}
function removeBlanks(blockgroups, socialExplorer){
    for(var b in blockgroups.features){
        var geoid = blockgroups.features[b].properties.GEOID
        var landArea = blockgroups.features[b].properties.ALAND
        if(landArea == 0){
            d3.select("._"+geoid).style("opacity",0)
        }
        var population = socialExplorer[geoid][populationKey]
        var populationKey = "SE_T001_001"
        if(population ==0){
            d3.select("._"+geoid).style("opacity",0.3)
        }
    }
}
function drawCityOutline(geoData){
    var projection = d3.geo.mercator().scale(settings.scale).center(settings.center)    
	var path = d3.geo.path().projection(projection);
   //console.log(geoData)
    var svg = d3.select("#map svg")
	svg.selectAll(".boroughs")
		.data(geoData.features)
        .enter()
        .append("path")
		.attr("d",path)
        .attr("class","boroughs")
		.style("stroke","#000")
		.style("fill","none")
        .style("opacity",0.3)
}
function drawBuildings(geoData,visited,allNeighbors,socialExplorer){    
    var projection = d3.geo.mercator().scale(settings.scale).center(settings.center)    
	var path = d3.geo.path().projection(projection);
    
     var tip = d3.tip()
    .attr('class', 'd3-tip')

    
    var svg = d3.select("#map svg")
svg.call(tip)    
	svg.selectAll(".buildings")
		.data(geoData.features)
        .enter()
        .append("path")
		.attr("class",function(d){
            var gid =d.properties.GEOID 
            if(visited.indexOf(gid)>-1){
                return "_"+gid+" visited"
            }else if(allNeighbors.indexOf(gid)>-1){
                return "_"+gid+" neighbor"
            }
            else{
                return "_"+gid+" notVisited"
            }
        })
		.attr("d",path)
	//	.style("stroke","#b4d7de")
	//	.style("opacity",1)
	//	.style("fill","#fffff2")
		.style("stroke","none")
		.style("opacity",1)
		.style("fill","none")
        .attr("px",function(d){
            var coordinates = d.geometry.coordinates[0][0]
            while(coordinates.length !=2){
                coordinates=coordinates[0]
            }
            var plng = projection([coordinates[0],coordinates[1]])[1]
            return plng
        })
        .attr("py",function(d){
            var coordinates = d.geometry.coordinates[0][0]
            while(coordinates.length !=2){
                coordinates=coordinates[0]
            }
            var plat = projection([coordinates[0],coordinates[1]])[0]
       
            return plat
        })
        .attr("id",function(d){
            var gid =d.properties.GEOID 
            return gid
        })
        .on("mouseover",function(d){
            var gid =d.properties.GEOID 
            var population = socialExplorer[gid]["SE_T001_001"]
            tip.html(function(d) {
                return "<strong>BlockGroup:</strong>" + gid + "<br/>"+"<strong>Population:</strong>" + population})
            if(visited.indexOf(gid)>-1){
         //   console.log([gid,population])
                tip.show()
                }
        })
        .style("cursor", function(d){
            var gid =d.properties.GEOID 
            
            if(visited.indexOf(gid)>-1){
                return "pointer"
            }
        })
        .on("mouseout",function(){tip.hide()})
}