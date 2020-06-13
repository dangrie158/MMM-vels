let sparkline = {

  getY: function (max, height, diff, value) {
    return parseFloat((height - (value * height / max) + diff).toFixed(2));
  },

  removeChildren: function (svg) {
    [...svg.querySelectorAll("*")].forEach(element => svg.removeChild(element));
  },

  defaultFetch: function (entry) {
    return entry.value;
  },

  buildElement: function (tag, attrs) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);

    for (let name in attrs) {
      element.setAttribute(name, attrs[name]);
    }

    return element;
  },

  sparkline: function (svg, entries, options) {
    let self = this;
    self.removeChildren(svg);

    if (entries.length <= 1) {
      return;
    }

    options = options || {};

    if (typeof (entries[0]) === "number") {
      entries = entries.map(entry => {
        return { value: entry };
      });
    }

    // This function will be called whenever the mouse moves
    // over the SVG. You can use it to render something like a
    // tooltip.
    const onmousemove = options.onmousemove;

    // This function will be called whenever the mouse leaves
    // the SVG area. You can use it to hide the tooltip.
    const onmouseout = options.onmouseout;

    // Should we run in interactive mode? If yes, this will handle the
    // cursor and spot position when moving the mouse.
    const interactive = ("interactive" in options) ? options.interactive : !!onmousemove;

    // Define how big should be the spot area.
    const spotRadius = options.spotRadius || 2;
    const spotDiameter = spotRadius * 2;

    // Define how wide should be the cursor area.
    const cursorWidth = options.cursorWidth || 2;

    // Get the stroke width; this is used to compute the
    // rendering offset.
    const strokeWidth = parseFloat(svg.attributes["stroke-width"].value);

    // By default, data must be formatted as an array of numbers or
    // an array of objects with the value key (like `[{value: 1}]`).
    // You can set a custom function to return data for a different
    // data structure.
    const fetch = options.fetch || self.defaultFetch;

    // Retrieve only values, easing the find for the maximum value.
    const values = entries.map(entry => fetch(entry));

    // The rendering width will account for the spot size.
    const width = parseFloat(svg.attributes.width.value) - spotDiameter * 2;

    // Get the SVG element's full height.
    // This is used
    const fullHeight = parseFloat(svg.attributes.height.value);

    // The rendering height accounts for stroke width and spot size.
    const height = fullHeight - (strokeWidth * 2) - spotDiameter;

    // The maximum value. This is used to calculate the Y coord of
    // each sparkline datapoint.
    const max = options.max || Math.max(...values);

    // Some arbitrary value to remove the cursor and spot out of
    // the viewing canvas.
    const offscreen = -1000;

    // Cache the last item index.
    const lastItemIndex = values.length - 1;

    // Calculate the X coord base step.
    const offset = width / lastItemIndex;

    // Hold all datapoints, which is whatever we got as the entry plus
    // x/y coords and the index.
    const datapoints = [];

    // Hold the line coordinates.
    const pathY = self.getY(max, height, strokeWidth + spotRadius, values[0]);
    let pathCoords = `M -${spotDiameter} ${max} V 0 M${spotDiameter} ${pathY}`;

    values.forEach((value, index) => {
      const x = index * offset + spotDiameter;
      const y = self.getY(max, height, strokeWidth + spotRadius, value);

      datapoints.push(Object.assign({}, entries[index], {
        index: index,
        x: x,
        y: y
      }));

      pathCoords += ` L ${x} ${y}`;
    });

    const path = self.buildElement("path", {
      class: "sparkline--line",
      d: pathCoords,
      fill: "none"
    });

    let fillCoords = `${pathCoords} V ${fullHeight} L ${spotDiameter} ${fullHeight} Z`;

    const fill = self.buildElement("path", {
      class: "sparkline--fill",
      d: fillCoords,
      stroke: "none"
    });

    svg.appendChild(fill);
    svg.appendChild(path);
  }
};