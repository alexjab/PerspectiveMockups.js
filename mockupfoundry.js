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
      'plane-height': 900,
      'edge-thickness': 15,
      'screen-spacing': 50
    };
  };

  MockupFoundry.prototype.addElement = function (source) {
    if (source) {
      var elem = {};
      elem.source = source || 'default.png'
      elem.x = 0;
      elem.y = 0;
      var img = new Image ();
      img.src = elem.source;
      elem.img = img;
      elem.ready = false;
      img.onload = function () { elem.ready = true; };
      this.elements.push (elem);
    } else {
      this.elements.push (null);
    }
    return this;
  };

  MockupFoundry.prototype.ready = function (callback) {
    /* ugly hack to cope with the asynchronous nature of canvas image loading */
    if (typeof callback === 'function') {
      var elements = this.elements;
      var isReady = function () {
        return elements.reduce (function (memo, elem) {
          if (elem.ready === false) {
            memo = false;
          }
          return memo;
        }, true);
      };
      if (isReady ()) return callback ();
      var interval = setInterval (function () {
        if (isReady ()) {
          clearInterval (interval);
          return callback ();
        }
      }, 100);
    }
  };

  MockupFoundry.prototype.param = function (key, val) {
    this.params[key] = val;
    return this;
  };

  MockupFoundry.prototype.render = function (type) {
    var context = this.context;
    var params = this.params;
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
      if (element) {
        context.shadowColor = 'rgba(0,0,0,0.5)';
        context.shadowBlur = 30;
        if (type === 'perspective') {
          context.shadowOffsetY = 30;
        }
        context.fillStyle = 'rgb(255,255,255)';
        context.fillRect (element.x+10, element.y+10, element.img.width - 20, element.img.height - 20);
      }
    });
    /* draw mocks */
    context.restore ();
    this.elements.forEach (function (element) {
      if (element) {
        context.drawImage (element.img, element.x, element.y);
      }
    });

    /* draw edges */
    if (type === 'perspective') {
      var initialCanvas = document.createElement ('canvas');
      var initialContext = initialCanvas.getContext ('2d');
      this.elements.forEach (function (element) {
        if (element) {
          var width = element.img.width;
          var height = element.img.height;
          var thickness = params['edge-thickness'];

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
        }
      });
    }
    return this;
  };

  MockupFoundry.prototype.layout = function (name) {
    var maxHeight = 0, maxWidth = 0;
    var elements = this.elements;
    var params = this.params;
    elements.forEach (function (element) {
      if (element) {
        if (element.img.height > maxHeight) {
          maxHeight = element.img.height;
        }
        if (element.img.width > maxWidth) {
          maxWidth = element.img.width;
        }
      }
    });
    this.elements = elements.map (function (element, index) {
      var spacing = params['screen-spacing'];
      if (element) {
        if (name === 'metro') {
          element.x = index*(maxWidth + spacing) + (maxWidth - element.img.width)/2;
        } else if (name === 'city') {
          element.x = (index%3)*(maxWidth + spacing) + (maxWidth - element.img.width)/2;
          element.y = (Math.floor (index/3)*(maxHeight + spacing)) + (maxHeight - element.img.height)/2;
        } else if (name === 'terminal') {
          var offsets = [0.5, 0, 0.25];
          element.x = (index%3)*(maxWidth + spacing) + (maxWidth - element.img.width)/2;
          element.y = Math.floor (index/3)*(maxHeight + spacing) + maxHeight*(offsets[index%3]) + (maxWidth - element.img.width)/2;
        }
      }
      return element;
    });
    return this;
  };

  return MockupFoundry;
}) (document);
