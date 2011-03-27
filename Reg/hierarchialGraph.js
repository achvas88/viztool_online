 //******************************************************************************************************//
 // Javascript file that holds the datastructure and functionalities of the degreeBasedRadialSortGraph   //
 //******************************************************************************************************//
 
 //Dependencies

 //website : http://www.phpied.com/rgb-color-parser-in-javascript/
 document.write("<script type=\"text/javascript\" src=\"rgbcolor.js\"></script>");
 
 ///////////// Datastructure /////////////////////////////////////////////////////////////////////

 var LEVELS_IN_OCT_TREE = 7; // has to be a minimum of 2 
 var RADIUS_OF_CIRCLES;
 var HORIZONTAL_SPACING = 100;
 var VERTICAL_SPACING = 100;
 var RADIUS_OF_CIRCLES;
 var octTreeRegions = new Array();
 var octTreeCounter = 0;
 var highlightedChildren = new Array();
 
 // to access width and height information and to draw on the canvas object
 var canvasID;
 
 // the canvas
 var canvas,canvas2;
 

 // holds the elements present in each level
 var levelElements = new Array();
 
 // adjacencyList is a 2D array . 
 // Rows indicate the different elements
 // columns indicate the neighbors of the elements
 // each value is an object containing the description, location
 var childrenList = new Array();
 
 var elements = new Array();
 
 // for displaying debugging information
 var debuggingTextAreaID;
 
 // local variables
 var levelRadius;
 var ie  = document.all
 var ns6 = document.getElementById&&!document.all
 var isMenu  = false ;
 var overpopupmenu = false; 
 var startX;
 var startY;
 var endY;
 var endX;
 var isDown=false;
 
 // list of selected Node indices
 var selectedNodes = new Array();
 
 ///////////// Functions //////////////////////////////////////////////////////////////////////////
 
 
 function populateLevelElements(parentIndex,depth)
 {
	if(levelElements[depth])
	{
		for(var i=0;i<levelElements[depth].length;i++)
		{
			if(levelElements[depth][i] == parentIndex) return;
		}
		levelElements[depth].push(parentIndex);
	}
	else
	{
		levelElements[depth] = new Array();
		levelElements[depth].push(parentIndex);
	}
	
	for(var i=0;i<childrenList[parentIndex].length;i++)
	{
		populateLevelElements(childrenList[parentIndex][i],depth+1);
	}
 }
 
 function drawTheChart(theCanvasID,selectionCanvasID,theElements,theChildren,theDebuggingTextAreaID)
 {
	
	canvasID = theCanvasID;
	canvas  = document.getElementById(canvasID);
	canvas2 = document.getElementById(selectionCanvasID);
	elements = theElements;
	childrenList = theChildren;
	debuggingTextAreaID = theDebuggingTextAreaID;
	RADIUS_OF_CIRCLES = (0.00003*canvas.width*canvas.height);
	
	
	drawChart();
	
	canvas2.addEventListener("click", handleMouseClick);
	document.getElementById("zoomin").addEventListener("click",handleZoomIn);
	document.getElementById("zoomout").addEventListener("click",handleZoomOut);
		
 }
 
 function redrawChart()
 {
	octTreeRegions = [];
	RADIUS_OF_CIRCLES = (0.00003*canvas.width*canvas.height);
		
	maxWidth = calculateMaxCanvasWidth(RADIUS_OF_CIRCLES,HORIZONTAL_SPACING);
	canvas.width = Math.max(maxWidth,canvas.width); 
	canvas2.width = Math.max(maxWidth,canvas.width); 
	
	maxHeight = calculateMaxCanvasHeight(RADIUS_OF_CIRCLES,VERTICAL_SPACING);
	canvas.height = Math.max(maxHeight,canvas.height); 
	canvas2.height = Math.max(maxHeight,canvas.height); 
	
	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;
	var centerx = canvasWidth/2;
	var centery = canvasWidth/2;
	
	octTreeCounter = 0;
	initializeOctTree(0,0,canvas.width,canvas.height,LEVELS_IN_OCT_TREE,-1);
	drawOctTreeRegions();
	
	for(var i = 0;i<levelElements.length;i++)
	{
		drawLevel(i,centerx,centery,HORIZONTAL_SPACING,VERTICAL_SPACING);
	}
	
	connectThemAll();
	highlightSelectedNodes();
	
 }
  
 function handleZoomIn()
 {
	
	canvas.width+=20;
	canvas.height+=20;
	canvas2.width+=20;
	canvas2.height+=20;
	
	redrawChart();
	
	centerScrollbar();
 }
 
 function handleZoomOut()
 {
	
	canvas.width-=20;
	canvas.height-=20;
	canvas2.width-=20;
	canvas2.height-=20;
	
	redrawChart();
	
	centerScrollbar();
 }
 
 function centerScrollbar()
 {
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
 
 function displayDebugInformation()
 {
	var debTA  = document.getElementById(debuggingTextAreaID);
	var debugText = "\n+++++++++++";
	
	for(var i =0 ; i<levelElements.length;i++)
	{
		debugText +="\n" + i +":"; 
		for(var j=0;j<levelElements[i].length;j++)
		{
			debugText += levelElements[i][j]+" ";
		}
	}
	debTA.value = debTA.value +debugText;
	
	/*debugText = "";
	debugText += canvas.id +":"+elements.length+"\n";
	
	for (var i=0;i<childrenList.length;i++)
	{
		debugText += "\n----------\n";
		debugText += elements[i].name + "-" + elements[i].description + ":";
		
		var elementNeighbors = adjacencyList[i];
		for(var j=0;j<elementNeighbors.length;j++)
		{
			debugText += elements[elementNeighbors[j]].name +" ";
		}
	}
	debTA.value = debTA.value +debugText;*/
 }
 
 function drawCircle(x,y,rgb)
 {
	var ctx = canvas.getContext("2d");

	ctx.fillStyle = rgb;//"#33FF00";
	//draw a circle
	ctx.beginPath();
	ctx.arc(x, y, RADIUS_OF_CIRCLES, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
 }
 
 function handleDeselection()
 {
	if(selectedNodes.length>0)
	{
		for(var i=0;i<selectedNodes.length;i++)
		{
			drawCircle(elements[selectedNodes[i]].X,elements[selectedNodes[i]].Y,"#33FF00");
		}
		selectedNodes = [];
	}
 }
 
function deselectNode(i)	// this 'i' refers to the index in the elements array
{
	drawCircle(elements[i].X,elements[i].Y,"#33FF00");
	for(var j=0;j<selectedNodes.length;j++)
	{
		if(selectedNodes[j] == i)
		{
			selectedNodes.splice(j,1);
		}
	}
	highlightSelectedNodes();
}

 function handleSelection(startX,startY,endX,endY)
 {
	var minX = Math.min(startX,endX);
	var maxX = Math.max(startX,endX);
	
	var minY = Math.min(startY,endY);
	var maxY = Math.max(startY,endY);
	
	var centerX = canvas.width/2;
	var centerY = canvas.height/2;
	//var distanceFromCenter = Math.sqrt(Math.pow(,2) + Math.pow(,2));
	var selectedRegion = new Object();
	selectedRegion.x = minX;
	selectedRegion.y = minY;
	selectedRegion.width = maxX-minX;
	selectedRegion.height = maxY-minY;
	
	regionToOctTreeNodes(selectedRegion,0); // x,y,width,height
	
	highlightSelectedNodes();
 }
 
 function highlightSelectedNodes()
 {
	var debTA  = document.getElementById(debuggingTextAreaID);
	var debText = "\nSelected Nodes:";
	for(var i=0;i<selectedNodes.length;i++)
	{
		debText+=selectedNodes[i]+" ";
		drawCircle(elements[selectedNodes[i]].X,elements[selectedNodes[i]].Y,"#FF0000");
	}
	debText+="\n";
	debTA.value = debText;
 }
 
 function drawLine(x1,y1,x2,y2)
 {
	var ctx = canvas.getContext("2d");
	ctx.strokeStyle = "rgba(0,0,0,0.2)";
	ctx.beginPath();
	ctx.moveTo(x1, y1); 
	ctx.lineTo(x2, y2); 
	ctx.closePath();
	ctx.stroke();
 }
 
 
 function connectThemAll()
 {
	for(var i=0;i<childrenList.length;i++)
	{
		var theChildren = childrenList[i];
		for (var j=0;j<theChildren.length;j++)
		{
			drawLine(elements[i].X,elements[i].Y,elements[theChildren[j]].X,elements[theChildren[j]].Y);
		}
	}
 }
 
 
 function drawOctTreeRegions()
 {
	var div = Math.pow(2,LEVELS_IN_OCT_TREE-1);
	var divWidth = canvas.width/div;
	var divHeight = canvas.height/div;
	for(var i=0;i<div;i++)
	{
		drawLine(i*divWidth,0,i*divWidth,canvas.height);
		drawLine(0,i*divHeight,canvas.width,i*divHeight);
	}
 }
 
 function calculateMaxCanvasWidth(RADIUS_OF_CIRCLES,HORIZONTAL_SPACING)
 {
	var maxElementsInALevel = 0;
	for(var i=0;i<levelElements.length;i++)
	{
		if(maxElementsInALevel<levelElements[i].length) maxElementsInALevel = levelElements[i].length;
	}
	
	return ((RADIUS_OF_CIRCLES*2*maxElementsInALevel) + (maxElementsInALevel+1)*HORIZONTAL_SPACING);
 }
 
 function calculateMaxCanvasHeight(VERTICAL_SPACING)
 {
	return ((levelElements.length + 1) * VERTICAL_SPACING);
 }
 
 function drawChart()
 {
	populateLevelElements(0,0);
	
	maxWidth = calculateMaxCanvasWidth(RADIUS_OF_CIRCLES,HORIZONTAL_SPACING);
	canvas.width = Math.max(maxWidth,canvas.width); 
	canvas2.width = Math.max(maxWidth,canvas.width); 
	
	maxHeight = calculateMaxCanvasHeight(RADIUS_OF_CIRCLES,VERTICAL_SPACING);
	canvas.height = Math.max(maxHeight,canvas.height); 
	canvas2.height = Math.max(maxHeight,canvas.height); 
	
	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;
	var centerx = canvasWidth/2;
	var centery = canvasHeight/2;
	
	octTreeCounter = 0;
	initializeOctTree(0,0,canvas.width,canvas.height,LEVELS_IN_OCT_TREE,-1);
	drawOctTreeRegions();
	
	for(var i = 0;i<levelElements.length;i++)
	{
		drawLevel(i,centerx,centery,HORIZONTAL_SPACING,VERTICAL_SPACING);
	}
	
	connectThemAll();
	viewOctTree();
}


 function drawLevel(index,centerX,centerY,h_space,v_space)
 {
	
	var context=canvas.getContext("2d");
	
	context.lineWidth=1;
	context.strokeStyle="black"; // line color
	
	var initX = centerX - ((levelElements[index].length - 1)/2 * h_space); 
	var initY = (index + 1) * v_space; 
	
	for(var i=0;i<levelElements[index].length;i++)
	{
		var x = initX + h_space * i;
		var y = initY;
			
		elements[levelElements[index][i]].X = x;
		elements[levelElements[index][i]].Y = y;
		
		insertIntoOctTree(levelElements[index][i],x,y,0);
		
		drawCircle(x,y,"#33FF00");
	}

}

  
 function initializeOctTree(x,y,width,height,level,parent)
 {
	
	var region0,region1,region2,region3;
	
	if(level == 0)
	{
		return;
 	}
	else
	{
		level--;
		
		////////// for region 0 ///////////
		
		region0 = new Object();
		region0.x = x;
		region0.y = y;
		region0.width = width/2;
		region0.height = height/2;
		region0.children = new Array();
		
		// check if this is the last level
		if(level <= 1) region0.isFinal = true;
		else region0.isFinal = false;
		
		// insert into the regions array
		octTreeRegions[octTreeCounter] = region0;
		
		// tell parent that i am your child
		if(parent!=-1)
		{
			octTreeRegions[parent].children.push(octTreeCounter);
		}
		
		// increment octTreeCounter
		octTreeCounter++;
		
		//recursively call for the region if more levels exist
		if(level>1)
		{
			initializeOctTree(region0.x,region0.y,region0.width,region0.height,level,octTreeCounter-1);
		}
				
		
		////////// for region 1 ///////////		
		
		region1 = new Object();
		region1.x = x+width/2;
		region1.y = y;
		region1.width = width/2;
		region1.height = height/2;
		region1.children = new Array();
		
		if(level <= 1) region1.isFinal = true;
		else region1.isFinal = false;
		
		octTreeRegions[octTreeCounter] = region1;
		
		if(parent!=-1)
		{
			octTreeRegions[parent].children.push(octTreeCounter);
		}
		
		octTreeCounter++;
		
		//recursively call for the region if more levels exist
		if(level>1)
		{
			initializeOctTree(region1.x,region1.y,region1.width,region1.height,level,octTreeCounter-1);
		}
		
		
		region2 = new Object();
		region2.x = x;
		region2.y = y+height/2;
		region2.width = width/2;
		region2.height = height/2;
		region2.children = new Array();
		
		if(level <= 1) region2.isFinal = true;
		else region2.isFinal = false;
		
		octTreeRegions[octTreeCounter] = region2;
		
		if(parent!=-1)
		{
			octTreeRegions[parent].children.push(octTreeCounter);
		}
		
		octTreeCounter++;
		
		//recursively call for the region if more levels exist
		if(level>1)
		{
			initializeOctTree(region2.x,region2.y,region2.width,region2.height,level,octTreeCounter-1);
		}
		
		region3 = new Object();
		region3.x = x + width/2;
		region3.y = y + height/2;
		region3.width = width/2;
		region3.height = height/2;
		region3.children = new Array();
		
		if(level <= 1) region3.isFinal = true;
		else region3.isFinal = false;
		
		octTreeRegions[octTreeCounter] = region3;
		
		if(parent!=-1)
		{
			octTreeRegions[parent].children.push(octTreeCounter);
		}
		
		octTreeCounter++;
		
		//recursively call for the region if more levels exist
		if(level>1)
		{
			initializeOctTree(region3.x,region3.y,region3.width,region3.height,level,octTreeCounter-1);
		}
	}
 }
 
 function fallInRegion(region,x,y)
 {
	return (x>=region.x && x<=(region.x+region.width) && y>=region.y && y<=(region.y+region.height));
 }
 
 
 
 function regionToOctTreeNodes(selectedRegion,region) // initially region should be 0
 {
	var region0,region1,region2,region3;
	
	if(region==0)
	{
		if(LEVELS_IN_OCT_TREE == 2)
		{
			region0 = octTreeRegions[0];
			region1 = octTreeRegions[1];
			region2 = octTreeRegions[2];
			region3 = octTreeRegions[3];
		}
		else
		{
			var c=0;
			var incr = calculateIncrement(LEVELS_IN_OCT_TREE);  //((1 + Math.pow(4,LEVELS_IN_OCT_TREE-2) + 4*(LEVELS_IN_OCT_TREE - 3));  // number of children within one biggest box
			region0 = octTreeRegions[c];
			c += incr
			region1 = octTreeRegions[c];
			c += incr;
			region2 = octTreeRegions[c];
			c += incr;
			region3 = octTreeRegions[c];
		}
	}
	else
	{
		region0 = octTreeRegions[region.children[0]];
		region1 = octTreeRegions[region.children[1]];
		region2 = octTreeRegions[region.children[2]];
		region3 = octTreeRegions[region.children[3]];
	}
	if(overlappingRegions(region0,selectedRegion))
	{
		if(region0.isFinal)
		{
			for(var i=0;i<region0.children.length;i++)
			{
				if(!alreadySelected(region0.children[i]) && fallInRegion(selectedRegion,elements[region0.children[i]].X,elements[region0.children[i]].Y))
				{
					selectedNodes.push(region0.children[i]);
				}
			}
		}
		else
		{
			regionToOctTreeNodes(selectedRegion,region0);
		}
	}
	if(overlappingRegions(region1,selectedRegion))
	{
		if(region1.isFinal)
		{
			for(var i=0;i<region1.children.length;i++)
			{
				if(!alreadySelected(region1.children[i]) && fallInRegion(selectedRegion,elements[region1.children[i]].X,elements[region1.children[i]].Y))
					selectedNodes.push(region1.children[i]);
			}
		}
		else
		{
			regionToOctTreeNodes(selectedRegion,region1);
		}
	}
	if(overlappingRegions(region2,selectedRegion))
	{
		if(region2.isFinal)
		{
			for(var i=0;i<region2.children.length;i++)
			{
				if(!alreadySelected(region2.children[i]) && fallInRegion(selectedRegion,elements[region2.children[i]].X,elements[region2.children[i]].Y))
					selectedNodes.push(region2.children[i]);
			}
		}
		else
		{
			regionToOctTreeNodes(selectedRegion,region2);
		}
	}
	if(overlappingRegions(region3,selectedRegion))
	{
		if(region3.isFinal)
		{
			for(var i=0;i<region3.children.length;i++)
			{
				if(!alreadySelected(region3.children[i]) && fallInRegion(selectedRegion,elements[region3.children[i]].X,elements[region3.children[i]].Y))
					selectedNodes.push(region3.children[i]);
			}
		}
		else
		{
			regionToOctTreeNodes(selectedRegion,region3);
		}
	}
 }
 
 function alreadySelected(i)
 {
	for (var j=0;j<selectedNodes.length;j++)
	{
		if(selectedNodes[j] == i) return true;
	}
	return false;
 }
 
 function overlappingRegions(region1,region2)
 {
	// if one of the points of one of the regions lies entirely within another region, then overlapping
	
	// for region1 against region2
	if((region1.x >= region2.x && region1.x <= (region2.x + region2.width)) && (region1.y >= region2.y && region1.y <= region2.y + region2.height)) return true;
	if(((region1.x+region1.width) >= region2.x && (region1.x+region1.width) <= (region2.x + region2.width)) && (region1.y >= region2.y && region1.y <= (region2.y + region2.height))) return true;
	if((region1.x >= region2.x && region1.x <= (region2.x + region2.width)) && ((region1.y+region1.height) >= region2.y && (region1.y+region1.height) <= (region2.y + region2.height))) return true;
	if(((region1.x+region1.width) >= region2.x && (region1.x+region1.width) <= (region2.x + region2.width)) && ((region1.y+region1.height) >= region2.y && (region1.y+region1.height) <= (region2.y + region2.height))) return true;
		
	// for region2 against region1	
	if((region2.x >= region1.x && region2.x <= (region1.x + region1.width)) && (region2.y >= region1.y && region2.y <= region1.y + region1.height)) return true;
	if(((region2.x+region2.width) >= region1.x && (region2.x+region2.width) <= (region1.x + region1.width)) && (region2.y >= region1.y && region2.y <= (region1.y + region1.height))) return true;
	if((region2.x >= region1.x && region2.x <= (region1.x + region1.width)) && ((region2.y+region2.height) >= region1.y && (region2.y+region2.height) <= (region1.y + region1.height))) return true;
	if(((region2.x+region2.width) >= region1.x && (region2.x+region2.width) <= (region1.x + region1.width)) && ((region2.y+region2.height) >= region1.y && (region2.y+region2.height) <= (region1.y + region1.height))) return true;

	// if none of the points of one region is within the other , there is still a possibility of overlap, if the regions overlap each other like a cross. 
	
	// region1 being the longer horizonral region and region 2 being the taller vertical region
	if(region2.x>=region1.x && (region2.x + region2.width <= region1.x + region1.width) && region2.y< region1.y && (region2.y + region2.height > region1.y + region1.height)) return true;
	
	// region2 being the longer horizonral region and region 2 being the taller vertical region
	if(region1.x>=region2.x && (region1.x + region1.width <= region2.x + region2.width) && region1.y< region2.y && (region1.y + region1.height > region2.y + region2.height)) return true;
	
	// cannot think of more conditions in which this test might fail . If anything comes up, add them here.
	
	return false;
 }
 
 function calculateIncrement(level)
 {
	if(level<=2) return 1;
	else
	{
		return 1+ 4*calculateIncrement(level-1);
	}
 }
 
 function insertIntoOctTree(elementIndex,x,y,region)
 {
	
	if(region==0)
	{
		if(LEVELS_IN_OCT_TREE == 2)
		{
			region0 = octTreeRegions[0];
			region1 = octTreeRegions[1];
			region2 = octTreeRegions[2];
			region3 = octTreeRegions[3];
		}
		else
		{
			var c=0;
			var incr = calculateIncrement(LEVELS_IN_OCT_TREE);  //((1 + Math.pow(4,LEVELS_IN_OCT_TREE-2) + 4*(LEVELS_IN_OCT_TREE - 3));  // number of children within one biggest box
			region0 = octTreeRegions[c];
			c += incr
			region1 = octTreeRegions[c];
			c += incr;
			region2 = octTreeRegions[c];
			c += incr;
			region3 = octTreeRegions[c];
		}
	}
	else
	{
		region0 = octTreeRegions[region.children[0]];
		region1 = octTreeRegions[region.children[1]];
		region2 = octTreeRegions[region.children[2]];
		region3 = octTreeRegions[region.children[3]];
	}
	if(fallInRegion(region0,x,y))
	{
		if(region0.isFinal)
		{
			region0.children.push(elementIndex);
			return;
		}
		else
		{
			insertIntoOctTree(elementIndex,x,y,region0);
		}
	}
	else if(fallInRegion(region1,x,y))
	{
		if(region1.isFinal)
		{
			region1.children.push(elementIndex);
			return;
		}
		else
		{
			insertIntoOctTree(elementIndex,x,y,region1);
		}
	}
	else if(fallInRegion(region2,x,y))
	{
		if(region2.isFinal)
		{
			region2.children.push(elementIndex);
			return;
		}
		else
		{
			insertIntoOctTree(elementIndex,x,y,region2);
		}
	}
	else if(fallInRegion(region3,x,y))
	{
		if(region3.isFinal)
		{
			region3.children.push(elementIndex);
			return;
		}
		else
		{
			insertIntoOctTree(elementIndex,x,y,region3);
		}
	}
 }
 
 function viewOctTree()
 {
	var debTA  = document.getElementById(debuggingTextAreaID);
	debugText = "\nOCT-TREE HIERARCHY\n\n";
	for(var i=0;i<octTreeRegions.length;i++)
	{
		debugText+=i+" :";
		var ch = octTreeRegions[i].children;
		for(var j=0;j<ch.length;j++)
		{
			debugText += ch[j] + ",";
		}
		debugText += "\n";
	}
	debTA.value = debTA.value +debugText;
 }
 
 function determineLevel(x,y)
 {
	var distanceFromTop = y;
	var widthOfLevel = VERTICAL_SPACING;
	
	lowerLevel = (Math.floor(distanceFromTop/widthOfLevel)) - 1;
	higherLevel = (Math.ceil(distanceFromTop/widthOfLevel)) - 1; 
	
	if(lowerLevel == -1) return 0;
	
	heightOfLowerLevel = (lowerLevel+1) * widthOfLevel;
	heightOfHigherLevel = (higherLevel+1) * widthOfLevel;
	
	if ((distanceFromTop - heightOfLowerLevel) <  (heightOfHigherLevel - distanceFromTop)) return lowerLevel;
	else
	{
		if (higherLevel<levelElements.length)	return higherLevel;
		else return lowerLevel;
	}
 }
 
function handleMouseClick(evt) {

	unHighlightAllChildren();

	var debTA  = document.getElementById(debuggingTextAreaID);
		
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
	//x += scrollbar.scrollLeft;
	//y += scrollbar.scrollTop;
	context.moveTo(x, y);
	var imgd = context.getImageData(x,y, 1, 1);
	var pix = imgd.data;
	
	var regionOfPress = new Object();
	regionOfPress.x = x-RADIUS_OF_CIRCLES;
	regionOfPress.y = y-RADIUS_OF_CIRCLES;
	regionOfPress.width  = RADIUS_OF_CIRCLES*2;
	regionOfPress.height  = RADIUS_OF_CIRCLES*2;			// based on hardcoded values for radius of the circle. should be changed once that is made automatic based on size of graph
	
	for(var i =0;i<pix.length;i+=4)
	{
		var val1 = pix[i]; // red
		var val2 = pix[i+1]; // green
		var val3 = pix[i+2]; // blue
	}
	
	var locr = document.getElementById('col');
	locr.value = val1 + ":" +val2 +":" +val3; 
	
	if((val1 == 51 && val2 == 255 && val3 == 0) || (val1 == 255 && val2 == 0 && val3 == 0))
	{
		var levelAt = determineLevel(x,y);
		
		var levelContents = levelElements[levelAt];
		
		for(var i=0;i<levelContents.length;i++)
		{
			if(fallInRegion(regionOfPress,elements[levelContents[i]].X,elements[levelContents[i]].Y))
			{
				if(val1 == 51 && val2 == 255 && val3 == 0) // if unselected
				{
					selectedNodes.push(levelContents[i]);
					highlightChildren(levelContents[i]);
					highlightSelectedNodes();
					break;
				}
				else 	// if selected
				{
					if(evt.ctrlKey)	// selected again with ctrl key down should deselect the node
					{
						deselectNode(levelContents[i]);
						break;
					}
					else	//selected again without pressing the ctrl key should clear all selected other than this
					{
						handleDeselection();
						selectedNodes.push(levelContents[i]);
						highlightChildren(levelContents[i]);
						highlightSelectedNodes();
						break;
					}
				}
			}
		}
	}
}

function highlightChildren(index)
{
	var children = childrenList[index];
	for(var i=0;i<children.length;i++)
	{
		if(!alreadySelected(children[i]))
		{
			highlightChild(children[i]);
			highlightedChildren.push(children[i]);
		}
	}
}

function unHighlightAllChildren()
{
	for(var i=0;i<highlightedChildren.length;i++)
	{
		unHighlightChild(highlightedChildren[i]);
	}
	highlightedChildren = [];
}

function highlightChild(index)
{
	var x = elements[index].X;
	var y = elements[index].Y;
	
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 3;
	ctx.strokeStyle = "blue";
	ctx.fillStyle = "#33FF00";
	//draw a circle
	ctx.beginPath();
	ctx.arc(x, y, RADIUS_OF_CIRCLES, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "black";
	
}

function unHighlightChild(index)
{
	var x = elements[index].X;
	var y = elements[index].Y;
	
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 3;
	ctx.strokeStyle = "white";
	ctx.fillStyle = "white";
	//draw a circle
	ctx.beginPath();
	ctx.arc(x, y, RADIUS_OF_CIRCLES, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "black";
	ctx.fillStyle = "#33FF00";
	//draw a circle
	ctx.beginPath();
	ctx.arc(x, y, RADIUS_OF_CIRCLES, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}