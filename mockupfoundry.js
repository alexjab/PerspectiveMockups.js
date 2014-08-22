var MockupFoundry = (function (document) {
  var MockupFoundry = function (el) {
    var canvas;
    if (typeof el === 'string') {
      canvas = document.getElementById (el);
    } else {
      canvas = el;
    }

    this.context = canvas.getContext ('2d');
    this.canvas = canvas;
    this.elements = [];
    this.params = {
      'plane-scale': 1,
      'plane-translate-x': 0,
      'plane-translate-y': 0,
      'plane-width': 1440,
      'plane-height': 900
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

  MockupFoundry.prototype.param = function (key, val) {
    this.params[key] = val;
    return this;
  };

  MockupFoundry.prototype.render = function (type) {
    var context = this.context;
    /* plane options */
    this.canvas.width = this.params['plane-width'];
    this.canvas.height = this.params['plane-height'];
    context.scale (this.params['plane-scale'], this.params['plane-scale']);
    context.translate (this.params['plane-translate-x'], this.params['plane-translate-y']);

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
      context.fillRect (element.x+10, element.y+10, element.img.width - 20, element.img.height - 20);
    });
    /* draw mocks */
    context.restore ();
    this.elements.forEach (function (element) {
      context.drawImage (element.img, element.x, element.y);
    });

    /* draw edges */
    if (type === 'perspective') {
      var initialCanvas = document.createElement ('canvas');
      var initialContext = initialCanvas.getContext ('2d');
      this.elements.forEach (function (element) {
        var width = element.img.width;
        var height = element.img.height;
        var thickness = 15;

        /* rendering the initial picture to get the left and bottom pixels */
        var initialImage = element.img;
        initialCanvas.width = width;
        initialCanvas.height = height;
        initialContext.drawImage (initialImage, 0, 0, width, height);
        var initialImageData = initialContext.getImageData (0, 0, width, height);

        /* iterating over the imageData.data to get the actual pixels */
        var data = initialImageData.data;
        var dataLength = data.length;
        var leftPixels = [];
        var bottomPixels = [];
        var j = 0, k = 0;
        for (var i = 0; i < dataLength; i+=4) {
          if ((i/4)%width === 0) {
            leftPixels[j] = data[i];
            leftPixels[j+1] = data[i+1];
            leftPixels[j+2] = data[i+2];
            leftPixels[j+3] = data[i+3];
            j+=4;
          }
          if (i >= (dataLength - width*4)) {
            bottomPixels[k] = data[i];
            bottomPixels[k+1] = data[i+1];
            bottomPixels[k+2] = data[i+2];
            bottomPixels[k+3] = data[i+3];
            k+=4;
          }
        }
        /* left edge */
        var leftImageData = context.createImageData (thickness, height);
        var k = 0;
        for (var j = 0; j < leftPixels.length; j+=4) {
          for (var i = 0; i < thickness; i++) {
            leftImageData.data[k] = leftPixels[j];
            leftImageData.data[k+1] = leftPixels[j+1];
            leftImageData.data[k+2] = leftPixels[j+2];
            leftImageData.data[k+3] = leftPixels[j+3];
            k+=4;
          }
        }
        var leftCanvas = document.createElement ('canvas');
        var leftContext = leftCanvas.getContext ('2d');
        leftCanvas.width = thickness;
        leftCanvas.height = height;
        leftContext.putImageData (leftImageData, 0, 0);
        leftContext.fillStyle = 'rgba(0,0,0,0.35)';
        leftContext.fillRect (0, 0, thickness, height);
        context.save ();
        context.translate (element.x - thickness, element.y + thickness);
        context.transform (1, -1, 0, 1, 0, 0)
        context.drawImage (leftCanvas, 0, 0);
        context.restore ();

        /* bottom edge */
        var bottomImageData = context.createImageData (width, thickness);
        k = 0;
        for (var i = 0; i < thickness; i++) {
          for (var j = 0; j < bottomPixels.length; j+=4) {
            bottomImageData.data[k] = bottomPixels[j];
            bottomImageData.data[k+1] = bottomPixels[j+1];
            bottomImageData.data[k+2] = bottomPixels[j+2];
            bottomImageData.data[k+3] = bottomPixels[j+3];
            k+=4;
          }
        }
        var bottomCanvas = document.createElement ('canvas');
        bottomCanvas.width = width;
        bottomCanvas.height = thickness;
        var bottomContext = bottomCanvas.getContext ("2d");
        bottomContext.putImageData (bottomImageData, 0, 0);
        bottomContext.fillStyle = 'rgba(0,0,0,0.35)';
        bottomContext.fillRect (0, 0, width, thickness);
        context.save ();
        context.translate (element.x, element.y + height);
        context.transform (1, 0, -1, 1, 0, 0)
        context.drawImage (bottomCanvas, 0, 0);
        context.restore ();
      });
    }
    return this;
  };

  return MockupFoundry;
}) (document);
