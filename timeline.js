'use strict';

import flags from './flags.js'

const domain = ["deceased", "transferred", "hospitalized","recovered","unknown","0"];
const range = ["#fddfdf", "#EFEFEF", "#fcf7de", "#defde0", "#def3fd", "#f0defd"];
const scale = d3.scaleOrdinal()
  .domain(domain)
  .range(range);
const legend = d3.legendColor()
  // .shape("path", d3.symbol().type(d3.symbolSquare).size(2000)())
  .shapePadding(5)
  .labelWrap(50)
  .shapeWidth(50)
  .orient("horizontal")
  .scale(scale);
d3.select(".legend")
  .call(legend);

d3.csv("5lab.csv", function(error, data) {
  console.log("data");
  console.log(data[0]);
  var list = document.getElementsByTagName("ul")[0];
  for(var i = 0; i < data.length; i++) {
    var item = document.createElement("li");
    switch(data[i].patientstatus) {
      case "recovered": item.className = "type1"; break;
      case "hospitalized": item.className = "type2"; break;
      case "deceased": item.className = "type3"; break;
      case "transferred": item.className = "type4"; break;
      case "unknown": case "0": case 0: item.className = "type3"; break;
      default: break;
    }

    var flagEmoji = "";

    if (data[i].nationality && data[i].nationality !== "0") {
      const nationality = data[i].nationality.split(",")
      for (let i = 0; i < nationality.length; i++) {
        flagEmoji += flags[nationality[i].trim()]
      }
    }

    var htmlString = "<div>";
    htmlString += "<div class='time'>" + data[i].date + "</div>";
    htmlString += "<div class='text'><div class='flag'>"+flagEmoji+"</div>" + data[i].note + "</div>";
    if (data[i].source) { htmlString += "<div class='source'>ref: <a target='_blank' href='"+data[i].source+"'>"+data[i].source+"</a></div>"; };
    htmlString += ""; 
    htmlString += "<div class='image-wrapper'><img src='https://ichef.bbci.co.uk/news/660/cpsprodpb/9147/production/_110819173_84301324_772297283292227_1576464872663678976_n.jpg' /></div>"; 
    htmlString += "</div>";
    item.innerHTML = htmlString;

    list.insertAdjacentElement("beforeend", item);
  }

  var items = document.querySelectorAll(".timeline li");

  // check if an element is in viewport
  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    // Check only top and bottom and consider the case that the post's height is longer than the window height
    return (rect.bottom - 100 > 0 && rect.top + 100 < (window.innerHeight || document.documentElement.clientHeight));
  }

  // Initialize with three cards
  let lazyIndex = 3
  let initialize = false

  function callbackFunction() {
    if (initialize && isElementInViewport(items[lazyIndex])) {
      items[lazyIndex].classList.add("in-view");
      lazyIndex += 1;
    }
  }

  function initial() {
    for (let i = 0; i < lazyIndex; i++) {
      items[i].classList.add("in-view");
    }

    initialize = true
  }

  window.addEventListener("load", initial);
  window.addEventListener("resize", callbackFunction);
  window.addEventListener("scroll", callbackFunction);
});
