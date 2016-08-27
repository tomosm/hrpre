// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className
) {
  // your code here
  var isElementOfClassName = function (element, className) {
    for (var i = 0, l = (element.classList && element.classList.length) || 0; i < l; i++) {
      if (element.classList[i] === className) {
        return true;
      }
    }
    return false;
  };

  var filterElementsByClassName = function (element, className) {
    var elements = [];
    for (var i = 0, l = element.childNodes.length; i < l; i++) {
      var child = element.childNodes[i];
      if (isElementOfClassName(child, className)) {
        elements.push(child);
      }
      elements = elements.concat(filterElementsByClassName(child, className));
    }
    return elements;
  };

  return filterElementsByClassName(document, className);
};
