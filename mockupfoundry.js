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

    context.save ();
    /* actual rendering */
    if (type === 'perspective') {
      context.scale (1, 0.5);
      context.rotate (-45/180*Math.PI);
    }
    context.save ()
    /* draw shadows */
    this.elements.forEach (function (element) {
      context.shadowColor = 'rgba(0,0,0,0.5)';
      context.shadowBlur = 30;
      if (type === 'perspective') {
        context.shadowOffsetY = 30;
      }
      context.fillStyle = 'rgb(255,255,255)';
      context.fillRect (element.x+10, element.y+10, 620, 1110);
    });
    /* draw mocks */
    context.restore ();
    this.elements.forEach (function (element) {
      context.drawImage (element.img, element.x, element.y);
    });

    if (type === 'perspective') {
      this.elements.forEach (function (element) {
        var width = element.img.width;
        var height = element.img.height;
        var x = element.x;
        var y = element.y;
        var thickness = 15;
        context.save ();
        context.translate (x-thickness, y+thickness);
        context.transform (1, -1, 0, 1, 0, 0)
        context.fillRect (0,0,thickness,height);
        context.restore ();
        context.save ();
        context.translate (x, y+height);
        context.transform (1, 0, -1, 1, 0, 0)
        context.fillRect (0,0,width,thickness);
        context.restore ();
      });
    }
    return this;
  };

  return MockupFoundry;
}) (document);
