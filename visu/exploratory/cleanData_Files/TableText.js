//
// Copyright (c) 2011 TIBCO Software AB,
// Forsta Langgatan 26, SE-413 28 Goteborg, Sweden.
// All rights reserved.
//
// This software is the confidential and proprietary information
// of Spotfire AB ("Confidential Information"). You shall not
// disclose such Confidential Information and shall use it only
// in accordance with the terms of the license agreement you
// entered into with Spotfire.
//
(function()
{
    /**
      * Find a valid background for a node. Goes recursively up the tree.
      * @param {Object} elem - A pure dom node
      * @returns {String} - A rgba color
      */
    function validBackground(elem)
    {
        if (!elem.parentNode)
        {
            // We are at document level. Return a default value.
            return "rgb(255, 255, 255)"; // White
        }

        var style = window.getComputedStyle(elem);
        var background = style.getPropertyValue("background-color");
        if (background === "rgba(0, 0, 0, 0)")
        {
            return validBackground(elem.parentNode);
        }

        return background;
    }

    /**
     * Helper function that filters a list. Is more performant than native version
     * @param {Array} arr
     * @param {Function} fn
     * @returns {Array} - Retturns a new array with filtered values
     */
    function filter(arr, fn)
    {
        var value, i, results = [];
        for (i = 0; i < arr.length; i += 1)
        {
            value = arr[i];
            if (fn(value, i))
            {
                results.push(value);
            }
        }
        return results;
    }

    /**
     * Helper function to map arrays. Is more performant than native version
     * @param {Array} arr
     * @param {Function} fn
     * @returns {Array} - Returns a new array with transformed values
     */
    function loop(arr, fn)
    {
        var value, i, results = [];
        for (i = 0; i < arr.length; i += 1)
        {
            value = arr[i];
            results.push(fn(value, i));
        }
        return results;
    }

    /**
    * Apply wordwrap class to all elements with overflow text
    * @param {object} elems - DOM node list of elements
    */
    var applyWordWrap = function (elems)
    {
        // Extract available element height and font size and then apply max-height styling
        var measuredElements = loop(Array.prototype.slice.call(elems, 0), function (elem)
        {
            var style = window.getComputedStyle(elem);
            return {
                node: elem,
                height: elem.parentNode.clientHeight,
                background: validBackground(elem.parentNode),
                fontSize: parseInt(style.getPropertyValue("font-size"), 10),
                lineHeight: parseInt(style.getPropertyValue("line-height"), 10)
            };
        });

        loop(measuredElements, function (elemData)
        {
            var maxHeight = Math.floor(elemData.height / elemData.lineHeight) * elemData.lineHeight;
            elemData.node.style.maxHeight = maxHeight + "px";
            elemData.node.classList.add("sf-element-text-overflow-check");
        });

        var elementsWithOverFlow = filter(measuredElements, function (elemData)
        {
            return elemData.node.clientHeight < elemData.node.scrollHeight;
        });

        // Apply overflow class on elements with hidden content
        loop(elementsWithOverFlow, function (elem)
        {
            var ellipsis = document.createElement("div");
            ellipsis.classList.add("sf-element-text-ellipsis");
            ellipsis.innerHTML = "&hellip;";
            ellipsis.style.backgroundImage = "linear-gradient(to right, rgba(255, 255, 255, 0), " + elem.background + ", " + elem.background + ")";
            elem.node.classList.add("sf-element-text-overflow");
            elem.node.appendChild(ellipsis);
        });
    };

    /**
    * Rotate a set of dom nodes
    * This function is split up into four sections to reduce the number of forced reflows needed to rotate all cells.
    * @param {Array} elements - Node list of elements
    * @param {Number} angle - Number of degrees to tilt the text
    */
    function rotateCells(elements, angle)
    {
        // This Factor is an approximation of the text descender height
        var descentFactor = (11 / 2.68 + 20 / 6.57) / 2;

        // Convert DOM node list into array to handle forEach
        elements = Array.prototype.slice.call(elements, 0);
        if (!elements.length)
        {
            return;
        }

        angle = angle || 90;

        // Removing the identifier class to reduce extra calls for already rendered cells
        elements.forEach(function (elem)
        {
            elem.classList.remove("textOrientationDirection-vertical");
        });

        // Start by wrapping each cell in a div (Reading and writing)
        elements.forEach(function (elem)
        {
            var classes = elem.getAttribute("class") || "";
            var rotationCell = document.createElement("div");
            rotationCell.setAttribute("class", classes.replace("sf-element-table-cell", "") + " sf-element-rotated-cell");

            // Element can contain sorting arrow
            var childCount = elem.childElementCount;
            rotationCell.appendChild(elem.firstChild);
            if (childCount > 1)
            {
                elem.insertBefore(rotationCell, elem.children[0]); // Insert before the sorting arrow
            }
            else
            {
                elem.appendChild(rotationCell);
            }

        });

        // Calculate the size of each cell (Reading only)
        elements.forEach(function (elem)
        {
            var style = window.getComputedStyle(elem);
            var fontSize = style.getPropertyValue("font-size");
            var justifyContent = style.getPropertyValue("justify-content");
            var flexStart = style.getPropertyValue("flex-start");
            var alignItems = style.getPropertyValue("align-items");

            var paddingTop = parseInt(style.getPropertyValue("padding-top"), 10);
            var paddingBottom = parseInt(style.getPropertyValue("padding-bottom"), 10);
            var paddingLeft = parseInt(style.getPropertyValue("padding-left"), 10);
            var paddingRight = parseInt(style.getPropertyValue("padding-right"), 10);

            // Visually adjusted descent value
            var descent = parseFloat(fontSize) / descentFactor - 1;
            var width = elem.offsetWidth - paddingLeft - paddingRight;
            var height = elem.offsetHeight - paddingTop - paddingBottom;

            // Switch the alignments    
            var temp = alignItems;
            alignItems = justifyContent;
            justifyContent = temp;


            if (justifyContent === "flex-start")
            {
                justifyContent = "flex-end";
            }
            else if (justifyContent === "flex-end")
            {
                justifyContent = "flex-start";
            }
            else if (justifyContent === "middle")
            {
                justifyContent = "center";
            }

            if (alignItems === "center")
            {
                alignItems = "middle";
            }

            // Append dimensions property on the dom node
            elem.dimensions = {
                paddingLeft: paddingLeft,
                paddingTop: paddingTop,
                width: width,
                height: height,
                descent: descent,
                justifyContent: justifyContent,
                flexStart: flexStart,
                alignItems: alignItems
            };
        });

        // Add a css transform to each cell (Writing to the DOM)
        elements.forEach(function (elem)
        {
            var child = elem.firstChild;
            var dimensions = elem.dimensions;

            var value = "rotate(-" + angle + "deg) " +
                "translateX( " + (-(dimensions.height - dimensions.descent)) + "px)";

            var textAlign = "";
            if (dimensions.justifyContent === "flex-start")
            {
                textAlign = "left";
            }
            else if (dimensions.justifyContent === "center")
            {
                textAlign = "center";
            }
            else if (dimensions.justifyContent === "flex-end")
            {
                textAlign = "right";
            }

            child.style.top = dimensions.paddingTop + "px";
            child.style.left = dimensions.paddingLeft + "px";
            child.style.webkitTransform = value;
            child.style.transform = value;

            child.style.justifyContent = dimensions.justifyContent;
            child.style.flexStart = dimensions.flexStart;
            child.style.alignItems = dimensions.alignItems;
            child.firstChild.style.textAlign = textAlign;

            // width becomes height and height becomes width
            child.style.height = dimensions.width + "px";
            child.style.width = (dimensions.height - dimensions.descent) + "px";
        });
    }

    /**********************************************************************************************************
      * Apply word wrap and rotate on table cells.
   
      */
    function processTableCells()
    {
        rotateCells(document.querySelectorAll(".textOrientationDirection-vertical"));
        applyWordWrap(document.querySelectorAll(".sfc-wrap .cell-text:not(.sf-element-text-overflow-check)"));
    }

    window.addEventListener("load", processTableCells);
}());