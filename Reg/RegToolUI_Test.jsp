
<html>
  <head>
	<meta charset="utf-8">
    <title>X3D Integration Test</title>
    <link rel="stylesheet" href="http://www.x3dom.org/x3dom/release/x3dom.css">
    <script src="http://www.x3dom.org/x3dom/release/x3dom.js"></script>
	
	
	<!-- TinyMCE -->
	<script type="text/javascript" src="tinymce_3_3_9_3/tinymce/jscripts/tiny_mce/tiny_mce.js"></script>
	<script type="text/javascript">
		/*tinyMCE.init({
			mode : "textareas",
			theme : "simple"
		});*/
	</script>
	<!-- /TinyMCE -->

  
	
  <style> 
 
    body {
        margin:0;
        padding:10px;
    }
 
    #the_element {
        width: 80%;
        height: 70%;
        border: none;
        background: #000000
		
    }
  
    #toggler {
    	position: absolute;
    	float: left;
    	z-index: 1;
    	top: 0px;
    	left: 0px;
    	width: 10em;
    	height: 2em;
    	border: none;
    	background-color: #202021;
    	color: #ccc;
    }
    
	#toggler:hover {
		background-color:blue;
	}
	</style> 
	<!--#000 url(http://www.x3dom.org/x3dom/example/texture/solarSystem/starsbg.png);-->
  
  <script>
  
  function somethingClicked()
  {
  //alert(this.idex);
   var str = 1+" "+1+" "+ 0;
	if(this.m.getAttribute("diffuseColor") == str)
		this.m.setAttribute("diffuseColor",1 + " " + 0 + " " + 0);
	else
		this.m.setAttribute("diffuseColor",1 + " " + 1 + " " + 0);
  }
  
  var zoomed = false;
  
  function toggle(button) 
  {
 
		var new_size;
		var x3d_element;
		
		x3d_element = document.getElementById('the_element');

		title = document.getElementById('title')
		h1 = document.getElementById('h1')
		hr = document.getElementById('hr')
		body  = document.getElementById('body')
		
		if (zoomed) {
			new_width = "80%";
			button.innerHTML = "Zoom";
			title.style.display = "block"
			h1.style.display = "block"
			hr.style.display = "block"
			//body.style.padding = '10px'
		} else {
			new_width = "100%";
			button.innerHTML = "Unzoom";
			title.style.display = "none"
			h1.style.display = "none"
			hr.style.display = "none"
			body.style.padding = '0'
		}

		zoomed = !zoomed;

		x3d_element.style.width = new_width;

	}
    
	
  function addChild(uniqueValue)
    {
	
		x = Math.random() * 600 - 300;
		y = Math.random() * 600 - 300;
		z = Math.random() * 600 - 300;
	
		/*s0 = Math.random() + 0.5;
		s1 = Math.random() + 0.5;
		s2 = Math.random() + 0.5;
		*/
		s0 = 1;
		s1 = 1;
		s2 = 1;
		
				
        var t = document.createElement('Transform');
        t.setAttribute("translation", x + " " + y + " " + z );
        t.setAttribute("scale", s0 + " " + s1 + " " + s2 );
		
			var s = document.createElement('Shape');
			
			
				var a = document.createElement('Appearance');
				
						var m = document.createElement('Material');
						m.setAttribute("diffuseColor",1 + " " + 0 + " " + 0);
						//m.setAttribute("specularColor","0.5 0.5 0.5");
						a.appendChild(m);
				
				s.appendChild(a);
				
				
				var b = document.createElement('Box');
				b.m = m;
				b.idex = x + "," + y + "," + z;
				
				
				b.onclick = somethingClicked;
				
				s.appendChild(b);
			
		t.appendChild(s);
		
        var ot = document.getElementById('root');
        ot.appendChild(t);
        
        return false;
    };
  
	// ********** Scene Creation ************ //
	
	enum levels{REGULON,GENE};
	var currentLevel = REGULON;
	var lowerX = -100;
	var lowerY = -100;
	var lowerZ = -100;
	var upperX = 100;
	var upperY = 100;
	var upperZ = 100;
	var boundingBoxWidth = 10;
	
	function getNumberOfNodes(level)
	{
		if(level == REGULON)
		{
			return 200;
		}
		else
		{
			return 500;
		}
	}
	
	function getCurrentLevel()
	{
		return currentLevel;
	}
	
	function setCurrentLevel(theLevel)
	{
		currentLevel = theLevel;
	}
	
	function getLowerX()
	{
		return lowerX;
	}
	
	function setLowerX(x)
	{
		lowerX = x;
	}
	
	function getLowerY()
	{
		return lowerY;
	}
	
	function setLowerY(y)
	{
		lowerY = y;
	}
	
	function getLowerZ()
	{
		return lowerZ;
	}
	
	function setLowerZ(z)
	{
		lowerZ = z;
	}
	
	function getUpperX()
	{
		return upperX;
	}
	
	function setUpperX(x)
	{
		upperX = x;
	}
	
	function getUpperY()
	{
		return upperY;
	}
	
	function setUpperY(y)
	{
		upperY = y;
	}
	
	function getUpperZ()
	{
		return upperZ;
	}
	
	function setUpperZ(z)
	{
		upperZ = z;
	}
	
	function getBoundingBoxWidth()
	{
		return boundingBoxWidth;
	}
	
	function setBoundingBoxWidth(value)
	{
		boundingBoxWidth = value;
	}
	
	function isNotOverlapping(point1,point2,widthOfCube)
	{
		var term1 = Math.pow((point2.x-point1.x),2);
		var term2 = Math.pow((point2.y-point1.y),2);
		var term3 = Math.pow((point2.z-point1.z),2);
		var distance = Math.sqrt(term1 + term2 + term3);
		// if the distance between the centers is > (sqrt(3) * width) , then the cubes definitely do not intersect
		// necessary but not sufficient condition to prove if two cubes dont intersect
		return ( distance > Math.sqrt(3)*widthOfCube) );
	}
	
	function createNewPoint(xRange,yRange,zRange)
	{
		var point = new Object();
		point.x = ( Math.random() * xRange ) + getLowerX();
		point.y = ( Math.random() * yRange ) + getLowerY();
		point.z = ( Math.random() * zRange ) + getLowerZ();
		return point;
	}
	
	function maxFailedAttempts()
	{
		return 100;
	}
	
	function createNonOverlappingNodes(count)
	{
		var dataPoints = new Array();
		if(count>0)
		{
			// entire range of coordinate points in which the cubes could be present.
			var xRange = getUpperX() - getLowerX();
			var yRange = getUpperY() - getLowerY();
			var zRange = getUpperZ() - getLowerZ();
			
			// firstNode		
			var firstPoint = createNewPoint(xRange,yRange,zRange);
			
			dataPoints.push(firstPoint);
			
			for(var i=1;i<count;)
			{
				var flag = 1;
				nextPoint = createNewPoint(xRange,yRange,zRange);
				for(var j=0;j<dataPoints.size();j++)
				{
					if(!isNotOverlapping(nextPoint,dataPoints[j],getWidthOfCube()))
					{
						flag = 0;
						break;
					}
				}
				if(flag)
				{
					dataPoints.push(nextPoint);
					i++;
					failedAttempts = 0;
				}
				else
				{
					failedAttempts++;
					if(failedAttempts >= maxFailedAttempts())
					{
						alert('function createNonOverlappingNodes(count): Could not fully populate nodes. Exceeded maximum number of failed attempts.');
						break;
					}
				}
			}
			
		}
		return dataPoints;	
	}
	
	function createScene()
	{
		distinctPoints = createNonOverlappingNodes(getNumberOfNodes(getCurrentLevel()));
		for(var i=0;i<distinctPoints.size();i++)
		{
			
		}
	}
	
	// ********** END Scene Creation ************ //
	
	//AddSelectOption(theSelectList, "My Option", "123", true);
	function testScene()
	{
		var maxDistance = 5;
		for(var i=0;i<1000;i++)
		{
			//determinePositions();
			addChild(i);
		}
	}
	
	
	
  </script>
  
  
	<script src="sselect/js/jquery-1.4.2.min.js" type="text/javascript"></script>
    <script src="sselect/js/jquery-ui-1.8.6.custom.min.js" type="text/javascript"></script>
    <link href="sselect/css/ui-lightness/jquery-ui-1.8.6.custom.css" rel="stylesheet" type="text/css" />
    <script src="sselect/js/ui.sexyselect.0.5.js" type="text/javascript"></script>
    <link href="sselect/css/ui.sexyselect.0.5.css" rel="stylesheet" type="text/css" />
    <script src="sselect/js/ui.checkboxDotNet.0.1.js" type="text/javascript"></script>
    
    <!-- Sample None of the below is required-->
    <script src="sselect/js/sample.js" type="text/javascript"></script>
    <script src="sselect/js/shCore.js" type="text/javascript"></script>
    <link rel="stylesheet" type="text/css" href="sselect/css/layout.css" />
    <link href="sselect/css/shCore.css" rel="stylesheet" type="text/css" />
    <link href="sselect/css/shThemeDefault.css" rel="stylesheet" type="text/css" />
    <script src="sselect/js/shBrushJScript.js" type="text/javascript"></script>
    <script type="text/javascript">
	
	
	
	function AddSelectOption(selectObj, text, value, isSelected) 
	{
		var selectbox = document.getElementById(selectObj);
		var optn = document.createElement("OPTION");
		optn.text = text;
		optn.value = value;
		selectbox.options.add(optn);
	}
	
	function createSelectBox()
	{
		var arr = new Array("Regulon1","Regulon2","Regulon3","Regulon4","Regulon5");
		
		for(var i=0;i<5;i++)
		{
			AddSelectOption("pretty_select4",arr[i],arr[i],false);		
		}
		$('#pretty_select4').sexyselect({ title: 'Regulons', onItemSelected: function (element, options) {
			actOnChoosingRegulon(element.val(),element.attr('checked'));
		}, autoSort: true, allowInput: true, allowDebug: false, allowCollapse: true, selectionMode: 'single', styleize: true, triStateRadio: false, allowFilter: true });
	}
	
	
	
	function actOnChoosingRegulon(val,checked)
	{
		//alert(val+":"+checked);
	}
	
	
	
	function save() 
	{ 
		
		var myform = document.getElementById('txtarea');
		
		var theText = myform.value;
		alert("heyy!" + myform.value);
		/*
		var mydoc = document.open(); 
		mydoc.write(theText); 
		mydoc.execCommand("saveAs",true,".txt"); //you can change the .txt to your extention
		history.go(-1);*/
	} 
	
    </script>
	
	<!--[if IE]><script language="javascript" type="text/javascript" src="../excanvas.min.js"><![endif]--> 
    
    <script language="javascript" type="text/javascript" src="flot/jquery.flot.js"></script> 
    <script language="javascript" type="text/javascript" src="flot/jquery.flot.selection.js"></script> 
	
	<script id="source"> 
$(function () {
    // setup plot
    function getData() {
        var d = [];
        for (var i = 0; i <= 300; ++i) {
            d.push([i, Math.round(Math.sin(i)*50)]);
        }
 
        return [
            { label: "Number of genes", data: d }
        ];
    }
 
    var options = {
        legend: { show: false },
        series: {
            lines: { show: true },
			points: { show: true }
		},
		xaxis: { ticks: []},
		grid: { hoverable: true, clickable: true },
		selection: { mode: "x" }
    };
 
    var startData = getData();
    
    var plot = $.plot($("#placeholder"), startData, options);
 
    // setup overview
    var overview = $.plot($("#overview"), startData, {
        legend: { show: true, container: $("#overviewLegend") },
        series: {
            bars: { show: true, lineWidth: 1 },
            shadowSize: 0
        },
        
        grid: { color: "#999" },
        selection: { mode: "x" }
    });
 
    // now connect the two
    
    $("#placeholder").bind("plotselected", function (event, ranges) {
        // clamp the zooming to prevent eternal zoom
        if (ranges.xaxis.to - ranges.xaxis.from < 0.00001)
            ranges.xaxis.to = ranges.xaxis.from + 0.00001;
        if (ranges.yaxis.to - ranges.yaxis.from < 0.00001)
            ranges.yaxis.to = ranges.yaxis.from + 0.00001;
        
        // do the zooming
        plot = $.plot($("#placeholder"), getData(ranges.xaxis.from, ranges.xaxis.to),
                      $.extend(true, {}, options, {
                          xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to },
                          yaxis: { min: ranges.yaxis.from, max: ranges.yaxis.to }
                      }));
        
        // don't fire event on the overview to prevent eternal loop
        overview.setSelection(ranges, true);
    });
	
    $("#overview").bind("plotselected", function (event, ranges) {
        plot.setSelection(ranges);
    });
	
	$("#placeholder").bind("plotclick", function (event, pos, item) {
        if (item) {
            $("#clickdata").text("You clicked point " + item.dataIndex + " : " + item.datapoint[1] + ".");
            plot.highlight(item.series, item.datapoint);
        }
    });
	
	function showTooltip(x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y + 5,
            left: x + 5,
            border: '1px solid #fdd',
            padding: '2px',
            'background-color': '#fee',
            opacity: 0.80
        }).appendTo("body").fadeIn(200);
    }
	
	var previousPoint = null;
    $("#placeholder").bind("plothover", function (event, pos, item) {
        
        
		if (item) {
			if (previousPoint != item.datapoint) {
				previousPoint = item.datapoint;
				
				$("#tooltip").remove();
				var x = item.datapoint[0],
					y = item.datapoint[1];
				
				showTooltip(item.pageX, item.pageY,
							item.series.label + " in Regulon " + x + " is " + y);
			}
		}
		else {
			$("#tooltip").remove();
			previousPoint = null;            
		}
        
    });
});

</script> 

	
	
	
    <style type="text/css">
        .style1
        {
            font-size: small;
        }
        .style2
        {
            color: #000000;
        }
    </style>
	
	<link rel="stylesheet" type="text/css" href="ddsmoothmenu.css" />
	<link rel="stylesheet" type="text/css" href="ddsmoothmenu-v.css" />
	<script type="text/javascript" src="ddsmoothmenu.js"></script>
	
	<script type="text/javascript">
	
	ddsmoothmenu.init({
		mainmenuid: "smoothmenu1", //menu DIV id
		orientation: 'h', //Horizontal or vertical menu: Set to "h" or "v"
		classname: 'ddsmoothmenu', //class added to menu's outer DIV
		//customtheme: ["#1c5a80", "#18374a"],
		contentsource: "markup" //"markup" or ["container_id", "path_to_menu_file"]
	})

	</script>
	
	</head>
  <body id="body" onLoad = "createSelectBox();">
   
   <div id="smoothmenu1" class="ddsmoothmenu">
<ul>

<li><a href="#">Project</a>
  <ul>
  <li><a href="#">Load Data</a></li>
  <li><a href="#">Export Data</a></li>
  </ul>
</li>

<li><a href="#">Configure</a>
  <ul>
  <li><a href="#">Species</a>
	<ul>
		<li><a href="#">Human</a></li>
		<li><a href="#">Yeast</a></li>
		<li><a href="#">Arabidopsis</a></li>
	</ul>
  </li>
  <li><a href="#">Pearson Threshold Value</a></li>
  <li><a href="#">View Type</a>
	<ul>
		<li><a href="#">View All Genes</a></li>
		<li><a href="#">View All Regulons</a></li>
	</ul>
  </li>
  </ul>
</li>

<li><a href="#">Toggle</a>
  <ul>
	  <li onclick="alert('Notepad clicked');"><a href="#">Notepad</a></li>
	  <li><a href="#">Chart</a></li>
  </ul>
</li>

</ul>
<br style="clear: left" />
</div>

    <center>
	
    	
	
	<x3d id= "the_element">
		<button id="toggler" onclick="toggle(this); return false;">Zoom</button> 
		<scene>
			<transform id="root" translation="0 0 0">
				<shape>
					<!--appearance>
						<material diffuseColor='red'></material>
					</appearance-->
					 
					<box></box>
				</shape>
			</transform>
		</scene>
    </x3d>
	

	</br>
	<h1 id = "h1">X3DOM Integration with JSP Example </h1>
	<hr id = "hr"> 
	
	<input type="button" onClick="addChild()" value="Add Node" id="title">
	
	
	<select id="pretty_select4">
		
	</select>
	
	<div id="chart" >	
    <div style="float:left"> 
      <div id="placeholder" style="width:800px;height:120px"></div> 
    </div> 
    
    <div id="miniature" style="float:left;margin-left:0px"> 
      <div id="overview" style="width:166px;height:120px"></div> 
 
      </div> 
	  </div>
	</br>
	<form name="form1" id="form1" method = "post">
	
	<textarea name="txtarea" id="txtarea" rows="15" cols="30" style="width: 20%;height: 200px">
	</textarea>
		
	<input type = "button" value = "Save" onclick ="testScene();">
	</form>
	</center>
	

 
  </body>
</html>

