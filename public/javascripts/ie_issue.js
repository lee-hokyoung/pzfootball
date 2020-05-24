// IE issue 오류 관련

// querySelectAll 으로 Element 를 선택했을 경우, Array 로 인식하지 못할 때
if (typeof NodeList !== "undefined" && NodeList.prototype && !NodeList.prototype.forEach) {
  // Yes, there's really no need for `Object.defineProperty` here
  NodeList.prototype.forEach = Array.prototype.forEach;
}
// Create Element.remove() function if not exist
if (!("remove" in Element.prototype)) {
  Element.prototype.remove = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}
// Call remove() according to your need
