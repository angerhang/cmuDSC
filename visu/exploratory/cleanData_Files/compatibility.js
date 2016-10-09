window.onbeforeprint = function()
{		
    // Bail out if not IE 7.
	if(window.navigator.appVersion.indexOf("MSIE 7.0") < 0)
	{
		return;
	}

	var forEach = function(collection, executor)
	{
	    var i;
		for(i=0; i<collection.length; i++)
		{
			executor(collection[i]);
		}
	};
	
	var getComputedStylePropertyValue = function(node, propertyName)
	{
	    var style = node.currentStyle || document.defaultView.getComputedStyle(node, null);	    
	    if(propertyName in style)
	    {
	        return style[propertyName];
	    }	    
	    return null;
	};
	
	var parseStylePropertyAsInteger = function(node, propertyName)
	{
	    var value = getComputedStylePropertyValue(node, propertyName);
	    var parsedValue = parseInt(value, 10);	    
	    return isNaN(parsedValue) ? 0 : parsedValue;	    
	};

	// This will compensate for the fact that IE 7 renders html in a different way when printing (compared to screen view).
	var compensate = function(multiplier)
	{
		forEach(document.getElementsByTagName("div"),
			function(div)
			{			    
				if(getComputedStylePropertyValue(div, "position") === "absolute")
				{
				    var parent = div.parentNode;
				    var parentBorderLeftWidth = parseStylePropertyAsInteger(parent, "borderLeftWidth");
					var parentBorderTopWidth = parseStylePropertyAsInteger(parent, "borderTopWidth");
					var top = parseStylePropertyAsInteger(div, "top");
					var left = parseStylePropertyAsInteger(div, "left");
													
					div.style.top = (top + parentBorderTopWidth * multiplier) + "px";
					div.style.left = (left + parentBorderLeftWidth * multiplier) + "px";
				}
			});
	};

	window.onafterprint = function()
	{
		compensate(-1);
	};
	
	compensate(1);
};