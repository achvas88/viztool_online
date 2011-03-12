<html>
 <head>
 
  <!-- Drawing on a canvas object -->
  <script type="application/javascript">	
    function draw() {
      var canvas = document.getElementById("canvas");
      if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

		ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (10, 10, 55, 50);

        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect (30, 30, 55, 50);
      }
    }
  </script>
  
  <script src="scenejs.min.js" type="text/javascript"></script>
   <script type='text/javascript' src='http://code.jquery.com/jquery-1.5.js'></script> 
  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.7/jquery-ui.js"></script> 
  
  
  <script>
  /*
 Introductory SceneJS scene which renders the venerable OpenGL teapot.

 Lindsay S. Kay,
 lindsay.kay@xeolabs.com

 To render the teapot, SceneJS will traverse the scene in depth-first order. Each node will set some
 WebGL state on visit, then un-set it again before exit. In this graph, the root
 scene node binds to a Canvas element, then the rest of the nodes specify various transforms, lights,
 material properties, all wrapping a teapot geometry node.

 This scene is interactive; to rotate the view, it takes two variables, "yaw" and "pitch", which are
 updated on rotate nodes from mouse input.

 */

 var DISTZ = -50;
 
$(document).ready(function() {
    SceneJS.createNode({

        type: "scene",

        /* ID that we'll access the scene by when we want to render it
         */
        id: "theScene",

        /* Bind scene to a WebGL canvas:
         */
        canvasId: "theCanvas",

        /* You can optionally write logging to a DIV - scene will log to the console as well.
         */
        loggingElementId: "theLoggingDiv",

        nodes: [

        /* Viewing transform specifies eye position, looking
         * at the origin by default
         */

         {
            type: "lookAt",
			id: "eyepos",
            eye: {
				x: 0.0,
                y: 0.0,
                z: DISTZ
            },
            look: {
                y: 0.0
            },
            up: {
                y: 1.0
            },

            nodes: [

                /* Camera describes the projection
                 */
              {
                type: "camera",
                optics: {
                    type: "perspective",
                    fovy: 25.0,
                    aspect: 1.47,
                    near: 0.10,
                    far: 300.0
                },

                nodes: [


                        /* A lights node inserts  point lights into the world-space.
                         * You can have many of these, nested within modelling transforms
                         * if you want to move them around.
                         */



                  {
                    type: "light",
                    mode: "dir",
                    color: {
                        r: 1.0,
                        g: 0.5,
                        b: 0.5
                    },
                    diffuse: true,
                    specular: true,
                    dir: {
                        x: 1.0,
                        y: 1.0,
                        z: -1.0
                    }
                },

                {
                    type: "light",
                    mode: "dir",
                    color: {
                        r: 0.5,
                        g: 1.0,
                        b: 0.5
                    },
                    diffuse: true,
                    specular: true,
                    dir: {
                        x: 0.0,
                        y: 1.0,
                        z: -1.0
                    }
                },

                {
                    type: "light",
                    mode: "dir",
                    color: {
                        r: 0.2,
                        g: 0.2,
                        b: 1.0
                    },
                    diffuse: true,
                    specular: true,
                    dir: {
                        x: -1.0,
                        y: 0.0,
                        z: -1.0
                    }
               },

               /* Next, modelling transforms to orient our teapot. See how these have IDs,
                * so we can access them to set their angle attributes.
                */



               {
                    type: "rotate",
                    id: "pitch",
                    angle: 0.0,
                    x: 1.0,

                    nodes: [
                        {
                        type: "rotate",
                        id: "yaw",
                        angle: 0.0,
                        y: 1.0,

                        nodes: [

                            /* Specify the amounts of ambient, diffuse and specular
                             * lights our teapot reflects
                             */
                         {
                            type: "material",
							emit: 0,
                            baseColor: {
                                r: 0.3,
                                g: 0.3,
                                b: 0.9
                            },
                            specularColor: {
                                r: 0.9,
                                g: 0.9,
                                b: 0.9
                            },
                            specular: 0.9,
                            shine: 100.0,

                            nodes: [
                               { 
									type: "cube",
									id: "prototypeCube"
							   }

                            ]}
                        ]}
                    ]}
                ]}
            ]}
        ]
    });


/*----------------------------------------------------------------------
 * Enable scene graph compilation (disabled by default in V0.8).
 *
 * This feature is alpha status and may break some scene graphs.
 *
 * It can speed your scene graph up by an order of magnitude - we'll
 * do it here just to show how it's done.
 *
 * http://scenejs.wikispaces.com/V0.8+Branch
 *---------------------------------------------------------------------*/

    SceneJS.setDebugConfigs({
        compilation: {
            enabled: true
        }
    });

/*----------------------------------------------------------------------
 * Scene rendering loop and mouse handler stuff follows
 *---------------------------------------------------------------------*/
    var yaw = 0;
    var pitch = 0;
	var tranx = 0;
    var trany = 0;
	var tranz = DISTZ;
    var lastX;
    var lastY;
    var dragging = false;
	var panning = false;
	var zooming = false;
	
    //SceneJS.setDebugConfigs({
    //
    //    shading : {
    //        whitewash : true
    //    }
    //});
    SceneJS.withNode("theScene").render();

    var canvas = document.getElementById("theCanvas");

    function mouseDown(event) {
	
		lastX = event.clientX;
		lastY = event.clientY;
		if(event.which == 1)
		{
			dragging = true;
		}
		if(event.which == 2)
		{
			panning = true;
		}
		if(event.which == 3)
		{
			zooming = true;
		}
    }

    function mouseUp() {
        dragging = false;
		panning = false;
		zooming = false;
		return false;
    }

/* On a mouse drag, we'll re-render the scene, passing in
 * incremented angles in each time.
 */

    function mouseMove(event) {
        if (dragging) {
            yaw += (event.clientX - lastX) * 0.5;
            pitch += (event.clientY - lastY) * -0.5;

            SceneJS.withNode("yaw").set("angle", yaw);
            SceneJS.withNode("pitch").set("angle", pitch);

            SceneJS.withNode("theScene").render();

            lastX = event.clientX;
            lastY = event.clientY;
        }
		if(panning){
		
		
			tranx += (event.clientX - lastX) * 0.01;
            trany += (event.clientY - lastY) * 0.01;
			
			SceneJS.withNode("eyepos").set("eye",{x:tranx , y:trany , z:tranz});
			SceneJS.withNode("eyepos").set("look",{x:tranx , y:trany , z:0});
			
			SceneJS.withNode("theScene").render();
			
			lastX = event.clientX;
            lastY = event.clientY;
			
			
		}
		if(zooming){
			tranz +=(event.clientY - lastY) * 0.03;
			
			SceneJS.withNode("eyepos").set("eye",{x:tranx , y:trany , z:tranz});
						
			SceneJS.withNode("theScene").render();
			
			lastX = event.clientX;
            lastY = event.clientY;
		}
    }

    canvas.addEventListener('mousedown', mouseDown, true);
    canvas.addEventListener('mousemove', mouseMove, true);
    canvas.addEventListener('mouseup', mouseUp, true);
	

});

var global_node_count = 0;

function thread_start(callback) {
	
    setTimeout(callback, 1);
    return true;
}

function displayfps()
{
	var fps = SceneJS.withNode("theScene").get("fps");
	var tf3 = document.getElementById("tffps");
	tf3.value = fps;
	t=setTimeout(displayfps,1000);
}

function testScene()
{
	for(var i=0;i<100;i++)
	{
		//thread_start(addNode);
	}
}

	
function conmenu(e)
{
	return false;
}

document.oncontextmenu=conmenu;//new Function("return false")
  
 
  </script>
  
  
 </head>
 
 <body>
   <canvas id="theCanvas" width="800" height="600" style="float:left">
    <p>This example requires a browser that supports the
        <a href="http://www.w3.org/html/wg/html5/">HTML5</a>
        &lt;canvas&gt; feature.</p>
   </canvas>
   <input type = "textfield" id = "tf" value="Nodes">   
   <input type = "textfield" id = "tffps" value="fps">   
   <input type = "button" value="display fps" onclick="displayfps();">
   <input type = "button" value="Create Scene" onclick="createScene();">
   <input type = "button" value="checkvalue" onclick="alert(getWidthOfCube());">

<br/><br/>

 </body>
</html>