jQuery(document).ready(function() {
	// do something here
	$("#orderedlist").addClass("red");
	$("#orderedlist > li").addClass("blue");
	
	
	$("#orderedlist li:last").hover(function() {
	 $(this).addClass("green");
	},function(){
	 $(this).removeClass("green");
	});
	
	$("#orderedlist").find("li").each(function(i) {
     $(this).append( " BAM! " + i );
   });
	
 
 });