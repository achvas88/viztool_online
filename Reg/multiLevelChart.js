 //*********************************************************************************************//
 // Javascript file that holds the datastructure and functionalities of the Multi Level Chart   //
 //*********************************************************************************************//
 
 //Dependencies

 //website : http://www.phpied.com/rgb-color-parser-in-javascript/
 document.write("<script type=\"text/javascript\" src=\"rgbcolor.js\"></script>");
 
 ///////////// Datastructure /////////////////////////////////////////////////////////////////////
 
 // to access width and height information and to draw on the canvas object
 var canvasID;
 
 // the canvas
 var canvas
 
 // determines the number of levels in the graph
 var numberOfLevels;
 
 // contents is a 2D array . 
 // Rows indicate the different levels
 // columns indicate the values in that particular level.
 // each value is an object containing the divisionRatio, description and color
 var contents = new Array();
 
 // for displaying debugging information
 var debuggingTextAreaID;
 
 // local variables
 var levelRadius;
 var ie  = document.all
 var ns6 = document.getElementById&&!document.all
 var isMenu  = false ;
 var overpopupmenu = false; 
 
 ///////////// Functions //////////////////////////////////////////////////////////////////////////
 
 // void initChart(theCanvasID,theContents,theDebuggingTextAreaID)
 // void displayDebugInformation()
 // void drawChart()
 
 function drawTheChart(theCanvasID,theContents,theDebuggingTextAreaID)
 {
	
	canvasID = theCanvasID;
	canvas  = document.getElementById(canvasID);
	contents = theContents;
	numberOfLevels = contents.length;
	debuggingTextAreaID = theDebuggingTextAreaID;
	
	/*if(document.getElementById("omw_scrollpane").style.width > canvas.width)
		alert(canvas.style.margin-left) = (document.getElementById("omw_scrollpane").width - canvas.width)/ 2;
	if(document.getElementById("omw_scrollpane").style.height > canvas.height)
		alert(canvas.style.margin-top) = (document.getElementById("omw_scrollpane").height - canvas.height)/ 2;
	*/	
	drawChart();
	canvas.addEventListener("click", handleMouseClick);
	document.getElementById("zoomin").addEventListener("click",handleZoomIn);
	document.getElementById("zoomout").addEventListener("click",handleZoomOut);
		
 }
 
 function handleZoomIn()
 {
	
	//canvas.width = canvas.width; // canvas clearing - doesnt work on chrome 
	var context=canvas.getContext("2d");
	context.clearRect ( 0 , 0 , canvas.width , canvas.height );
	
	canvas.width+=20;
	canvas.height+=20;
	
	drawChart();
	
	var scrollbar = document.getElementById("omw_scrollpane");
	var val;
	var styleProp="width";
	
	if (scrollbar.currentStyle)
		val = scrollbar.currentStyle[styleProp];
	else if (window.getComputedStyle)
		val = document.defaultView.getComputedStyle(scrollbar,null).getPropertyValue(styleProp);
	
	var scrollbarwidth = val.substring(0,val.length-2);
	
	if (scrollbarwidth< canvas.width)
	{
		scrollbar.scrollLeft =(canvas.width - scrollbarwidth)/2;
		scrollbar.scrollTop = (canvas.height - scrollbarwidth)/2;
	}
	
 }
 
 function handleZoomOut()
 {
	
	//canvas.width = canvas.width; // canvas clearing - doesnt work on chrome 
	var context=canvas.getContext("2d");
	context.clearRect ( 0 , 0 , canvas.width , canvas.height );
	
	canvas.width-=20;
	canvas.height-=20;
	
	drawChart();
 }
 
 function displayDebugInformation()
 {
	var debTA  = document.getElementById(debuggingTextAreaID);
	var debugText = "";
	debugText += canvas.id +":"+numberOfLevels+"\n";
	debugText += "\n";
	for (var i=0;i<contents.length;i++)
	{
		debugText += "----------\n"
		var levelContents = contents[i];
		for(var j=0;j<levelContents.length;j++)
		{
			var theObject = levelContents[j];
			//divisionRatio, description and color
			debugText += theObject.description + ":" + theObject.divisionRatio +":" + theObject.color +"\n";
		}
	}
	debTA.value = debugText;
 }
 
 function drawChart()
 {
	var canvas  = document.getElementById(canvasID);
	var canvasWidth = canvas.width;
	var radiusDecrement = (canvasWidth/2)/numberOfLevels;
	levelRadius = canvasWidth/2;
	var centerx = canvasWidth/2;
	var centery = canvasWidth/2;
	for(var i = numberOfLevels-1;i>=0;i--)
	{
		var theLevelContents = contents[i];
		drawLevel(theLevelContents,centerx,centery,levelRadius);
		levelRadius-=radiusDecrement;
	}
 }

 function drawLevel(theLevelContents,centerX,centerY,radius)
 {
	
	var context=canvas.getContext("2d");
	
	var counterclockwise = false;
	
	context.lineWidth=0;
	context.strokeStyle="black"; // line color
	
	var angles = new Array();
	for(var i=0;i<theLevelContents.length-1;i++) // -1 because the last angle is not required 
	{
		var totalratio = 0;
		for(var j=0;j<=i;j++)
		{
			totalratio += theLevelContents[j].divisionRatio;
		}
		angles.push(2 * Math.PI * totalratio);
	}
	
	
	for(var i=0;i<angles.length;i++)
	{
		context.beginPath();
		if(i==0)
		{
		context.arc(centerX,centerY, radius, 0, 
			angles[i],counterclockwise);
		}
		else
		{
		context.arc(centerX,centerY, radius, angles[i-1], 
			angles[i],counterclockwise);
		}
				
		context.lineTo(centerX,centerY);
		context.closePath();
		context.fillStyle=theLevelContents[i].color; // line color
		context.fill();	
		context.stroke();	
	}
	
	context.beginPath();
	context.arc(centerX,centerY, radius, angles[angles.length-1],
		0,counterclockwise);
	context.lineTo(centerX,centerY);
	context.closePath();
	context.fillStyle=theLevelContents[theLevelContents.length-1].color; // line color
	context.fill();	
	context.stroke();
	
 }
 
function handleMouseClick(evt) {
	var debTA  = document.getElementById(debuggingTextAreaID);
	debTA.value = "Clicked at:" + evt.clientX+":"+evt.clientY+"\n";
	
	var context=canvas.getContext("2d");
	
	var x, y;

    // Get the mouse position relative to the canvas element.
    if (evt.layerX || evt.layerX == 0) { // Firefox
      x = evt.layerX;
      y = evt.layerY;
    } else if (evt.offsetX || evt.offsetX == 0) { // Opera
      x = evt.offsetX;
      y = evt.offsetY;
    }
	//x = evt.clientX,y = evt.clientY;
	var scrollbar = document.getElementById("omw_scrollpane");
	x+=scrollbar.scrollLeft;
	y+=scrollbar.scrollTop;
	context.moveTo(x, y);
	var imgd = context.getImageData(x,y, 1, 1);
	var pix = imgd.data;
	
	for(var i =0;i<pix.length;i+=4)
	{
		var val1 = pix[i]; // red
		var val2 = pix[i+1]; // green
		var val3 = pix[i+2]; // blue
		//pix[i+3] = 1; // blue
    }
	
	var locr = document.getElementById('col');
	locr.value = val1 + ":" +val2 +":" +val3; 
	
	var centerX = canvas.width/2;
	var centerY = canvas.width/2;
	
	
	var distanceFromCenter = Math.sqrt(Math.pow((x - centerX),2) + Math.pow((y - centerY),2));
	
	var widthOfLevel= (canvas.width/2)/numberOfLevels;
	
	var levelAt = Math.floor(distanceFromCenter/widthOfLevel);
	
	if(levelAt<contents.length)
	{
		var levelContents = contents[levelAt];
		for(var i=0;i<levelContents.length;i++)
		{
			var theColor = new RGBColor(levelContents[i].color);
			if(theColor.r == val1 && theColor.g == val2 && theColor.b == val3 )
			{
				debTA.value+="\n Description of Node Selected:\n"+levelContents[i].description+"\n";
				
				document.getElementById('desc').innerHTML = levelContents[i].description;
				var obj = ns6 ? evt.target.parentNode : event.srcElement.parentElement; 
				if (ns6)
				{
					document.getElementById('menudiv').style.left = evt.clientX+ "px";
					document.getElementById('menudiv').style.top = evt.clientY + "px";
				} 
				else
				{
					document.getElementById('menudiv').style.pixelLeft = event.clientX;
					document.getElementById('menudiv').style.pixelTop = event.clientY;
				}

				document.getElementById('menudiv').style.display = "";
				document.getElementById('desc').style.backgroundColor='#FFFFAA';
				break;
			}
		}
	}
	else
	{
		document.getElementById('menudiv').style.display = "none" ;
	}
	
}

