var PerspectiveMockups = (function (document) {
  //'use strict';

  var PerspectiveMockups = function (el) {
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
      planeScale: 1,
      planeOffsetX: 0,
      planeOffsetY: 0,
      planeWidth: 1440,
      planeHeight: 900,
      edgeThickness: 10,
      screenSpacing: 100
    };
  };

  PerspectiveMockups.prototype.usePicture = function (source) {
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

  PerspectiveMockups.prototype.usePictures = function (sources) {
    this.elements = [];
    if (sources instanceof Array) {
      sources.forEach (this.usePicture.bind (this));
    }
    return this;
  };

  PerspectiveMockups.prototype.onReady = function (callback) {
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
    return this;
  };

  PerspectiveMockups.prototype.setParameter = function (key, val) {
    this.params[key] = val;
    return this;
  };

  PerspectiveMockups.prototype.setParameters = function (params) {
    if (params instanceof Object) {
      var keys = Object.keys (params);
      keys.forEach (function (key) {
        this.setParameter (key, params[key]);
      }.bind (this));
    }
    return this;
  };

  PerspectiveMockups.prototype.render = function () {
    var context = this.context;
    var params = this.params;
    /* plane options */
    this.canvas.width = params.planeWidth;
    this.canvas.height = params.planeHeight;
    context.translate (params.planeOffsetX, params.planeOffsetY);
    context.scale (params.planeScale, params.planeScale);

    context.save ();
    // actual rendering
    context.scale (1, 0.5);
    context.rotate (-45/180*Math.PI);
    context.save ()
    // draw shadows
    this.elements.forEach (function (element) {
      if (element) {
        context.shadowColor = 'rgba(0,0,0,0.5)';
        context.shadowBlur = 30;
        context.shadowOffsetY = 30;
        context.fillStyle = 'rgb(255,255,255)';
        context.fillRect (element.x+10, element.y+10, element.img.width - 20, element.img.height - 20);
      }
    });
    // draw mocks
    context.restore ();
    context.restore ();
    context.save ();
    this.elements.forEach (function (element) {
      if (element) {
        context.save ();
        for (var i = 0; i < params.edgeThickness; i++) {
          context.translate (0, -1);
          context.save ();
          context.scale (1, 0.5);
          context.rotate (-45/180*Math.PI);
          context.drawImage (element.img, element.x, element.y);
          context.restore ();
        }
        context.restore ();
      }
    });


    // draw edge shadow
    context.fillStyle = 'rgba(0,0,0,0.35)';
    context.scale (1, 0.5);
    context.rotate (-45/180*Math.PI);
    this.elements.forEach (function (element) {
      if (element) {
        var width = element.img.width;
        var height = element.img.height;
        var thickness = params.edgeThickness;

        context.save ();
        context.translate (element.x, element.y);
        context.transform (1, -1, 0, 1, 0, 0)
        context.fillRect (0, 0, thickness*Math.sqrt (2), height);
        context.restore ();

        context.save ();
        context.translate (element.x + thickness*Math.sqrt (2), element.y + height - thickness*Math.sqrt (2));
        context.transform (1, 0, -1, 1, 0, 0)
        context.fillRect (0, 0, width, thickness*Math.sqrt (2));
        context.restore ();
      }
    });
    return this;
  };

  PerspectiveMockups.prototype.setLayout = function (name) {
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
      var spacing = params.screenSpacing;
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

  PerspectiveMockups.prototype.reset = function () {
    this.canvas.size = this.canvas.size;
  };

  return PerspectiveMockups;
}) (document);
