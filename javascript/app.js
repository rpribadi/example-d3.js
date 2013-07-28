var lineChart = (function() {

    var svg = d3.select('svg.line-chart');
    var maxX = $('svg.line-chart').width();
    var maxY = $('svg.line-chart').height();

    var data = [];
    var lineData = [];
    var padding = 25;
    var startX = padding;
    var startY = maxY - padding;

    var maxData,
        maxValue,
        pixelPerUnitX,
        pixelPerUnitY;

    function init(maxD, minV, maxV) {
        maxData = maxD;
        minValue = minV;
        maxValue = maxV;

        pixelPerUnitX = (maxX - (2 * padding)) / maxData;
        pixelPerUnitY = (maxY - (2 * padding)) / (maxValue - minValue);

    }

    function setData(newData) {
        data.push(newData);
        if(data.length > maxData) {
            data = data.slice(data.length-maxData, data.length); 
        }

        lineData = [];
        for(var i=0; i<data.length-1; i++) {
            lineData.push([data[i], data[i+1]]);
        }
    }

    function getRandom(min, max) {
        return parseInt(Math.random() * (max - min) + min);
    };

    function getX(value) {
        return startX + (value * pixelPerUnitX);
    };

    function getY(value) {
        return startY - ((value - minValue) * pixelPerUnitY);
    };

    function draw(newData) {
        setData(newData);

        svg.selectAll(".line")
           .data(lineData)
               .attr("style", "stroke:white;")
               .attr("x1", function(d, i) { return getX(i); })
               .attr("y1", function(d, i) { return getY(d[0], i); })
               .attr("x2", function(d, i) { return getX(i + 1); })
               .attr("y2", function(d, i) { return getY(d[1], i); })
           .enter()
               .append("line")
               .attr("class", "line")
               .attr("style", "stroke:white;")
               .attr("x1", function(d, i) { return getX(i); })
               .attr("y1", function(d, i) { return getY(d[0], i); })
               .attr("x2", function(d, i) { return getX(i + 1); })
               .attr("y2", function(d, i) { return getY(d[1], i); })
    };

    return {
        init: init,
        draw: draw
    }
})();

var mainSVG = (function() {
    var svg = d3.select("svg.main");

    var data = [];
    var maxX = $(window).width();
    var maxY = $(window).height();

    var maxData, minValue, maxValue;    

    function init(maxD, minV, maxV) {
        maxData = maxD;
        minValue = minV;
        maxValue = maxV;

        calculate();
        initDraw();
    };

    function getRandom(min, max) {
        return parseInt(Math.random() * (max - min) + min);
    };

    function calculate() {
        data = [];
        for(var i=0; i<maxData; i++) {
            data.push(getRandom(minValue, maxValue));
        }
    };

    function initDraw() {
        svg.selectAll(".circle")
           .data(data)
           .enter()
           .append("circle")
           .attr("class", "circle")
           .attr("cx", function(d, i) { return getRandom(0 + d, maxX-d); })
           .attr("cy", function(d, i) { return getRandom(0 + d, maxY-d); })
           .attr("r", function(d, i) { return d; });
    };

    function draw() {
        svg.selectAll(".circle")
           .data(data)
           .attr("r", function(d, i) { return d; });
    };
    
    function setFill(fill) {
            svg.selectAll(".circle").attr("fill", fill);
    };

    function getAverage() {
        var average = 0;
        if(data.length > 0) {
            var sum = 0;
            for(var i=0; i<data.length; i++) {
                sum = sum + data[i];
            }
            average = sum / data.length;
        }
        return average;
    };

    return {
        init: init,
        draw: function() {
            calculate();
            draw();
        },
        setFill: setFill,
        getAverage: getAverage
    };

})();


$(document).ready(function(){
    mainSVG.init(100, 10, 30);
    lineChart.init(300, 15, 25);

    
    function play() {
        mainSVG.draw();
        lineChart.draw(mainSVG.getAverage());
    };

    var intervalID = 0;

    $('button.play').click(function() {
        var text = $(this).text();
        if(text === "PLAY") {
            intervalID = setInterval(play, 250);
            $(this).text("STOP");
        } else {
            if(intervalID !== 0) {
                clearInterval(intervalID);
            }
            $(this).text("PLAY");
        }
    });

    $('a.toggle ').click(function() {
        $('.panel').toggle('fast', function() {
            $('a.toggle-outside').toggle();
        });
        return false;
    });

    $('a.color ').click(function() {
        var fill = $(this).attr('class').replace("color ", "");
        mainSVG.setFill(fill);
        return false;
    });

});

