var MockupFoundry = (function (document) {
  var MockupFoundry = function (el) {
    var canvas;
    if (typeof el === 'string') {
      canvas = document.getElementById (el);
    } else {
      canvas = el;
    }

    this.context = canvas.getContext ('2d');
    this.elements = [];
    this.opts = {
      'plane-scale': 1,
      'plane-translate-x': 0,
      'plane-translate-y': 0
    };
  };

  MockupFoundry.prototype.addElement = function (source, x, y) {
    var elem = {};
    elem.source = source || 'default.png'
    elem.x = x || 0;
    elem.y = y || 0;
    var img = new Image ();
    img.src = elem.source;
    elem.img = img;
    this.elements.push (elem);
    return this;
  };

  MockupFoundry.prototype.option = function (key, val) {
    this.opts[key] = val;
    return this;
  };

  MockupFoundry.prototype.render = function (type) {
    var context = this.context;
    /* plane options */
    context.scale (this.opts['plane-scale'], this.opts['plane-scale']);
    context.translate (this.opts['plane-translate-x'], this.opts['plane-translate-y']);

    /* actual rendering */
    if (type === 'perspective') {
      context.scale (1, 0.5);
      context.rotate (-45/180*Math.PI);
    }
    this.elements.forEach (function (element) {
      context.drawImage (element.img, element.x, element.y);
    });
    return this;
  };

  return MockupFoundry;
}) (document);
