(function (document) {
  document.getElementById ('column-center').style.width = window.innerWidth - 520;

  document.getElementById ('btn-default-scale').addEventListener ('mouseup', function () {
    document.getElementById ('input-scale').value = '1.0';
  });

  document.getElementById ('btn-default-offset').addEventListener ('mouseup', function () {
    document.getElementById ('input-offset-x').value = '0';
    document.getElementById ('input-offset-y').value = '0';
  });

  document.getElementById ('btn-default-size').addEventListener ('mouseup', function () {
    document.getElementById ('input-size-x').value = '1440';
    document.getElementById ('input-size-y').value = '900';
  });

  document.getElementById ('btn-default-thickness').addEventListener ('mouseup', function () {
    document.getElementById ('input-thickness').value = '15';
  });

  document.getElementById ('btn-default-spacing').addEventListener ('mouseup', function () {
    document.getElementById ('input-spacing').value = '100';
  });

  var pictures = [];
  var onAddPicture = function () {
    var source = document.getElementById ('input-picture-path').value;
    var container = document.createElement ('div');
    container.style.width = 175;
    container.style.height = 250;
    container.style.overflow = 'clip';
    container.style.marginBottom = 10;
    container.style.padding = 10;
    //container.style.border = '1px solid #B2B2B2';
    container.style.backgroundColor = '#4F4F4F';
    var image = new Image ();
    image.src = source;
    pictures.push (source);
    image.width = 150;
    image.height = 225;
    image.alt = 'File not found !'
    var button = document.createElement ('input');
    button.type = 'button';
    button.value = 'Remove';
    button.setAttribute ('data-src', image.src);
    button.setAttribute ('class', 'btn-remove-picture');
    button.style.marginTop = 10;
    button.addEventListener ('mouseup', function () {
      var index = pictures.indexOf (source);
      pictures.splice (index, 1);
      document.getElementById ('picture-items').removeChild (container);
    });
    container.appendChild (image);
    container.appendChild (button);
    document.getElementById ('picture-items').appendChild (container);
  };

  document.getElementById ('btn-add-picture').addEventListener ('mouseup', onAddPicture);
  document.getElementById ('input-picture-path').addEventListener ('keyup', function (event) { 
    if (event.keyCode === 13) {
      onAddPicture ();
    }
  });
  

  var mockups = new PerspectiveMockups ('main-canvas');
  document.getElementById ('btn-render').addEventListener ('mouseup', function () {
    document.getElementById ('btn-render').value = 'Rendering...';
    mockups.reset ();
    mockups.usePictures (pictures);
    var parameters = {
      planeScale: parseFloat (document.getElementById ('input-scale').value) || 1.0,
      planeWidth: parseInt (document.getElementById ('input-size-x').value) || 1440,
      planeHeight: parseInt (document.getElementById ('input-size-y').value) || 900,
      planeOffsetX: parseInt (document.getElementById ('input-offset-x').value) || 0,
      planeOffsetY: parseInt (document.getElementById ('input-offset-y').value) || 0,
      edgeThickness: parseInt (document.getElementById ('input-thickness').value) || 15,
      screenSpacing: parseInt (document.getElementById ('input-spacing').value) || 100
    };
    console.log (parameters);
    mockups.setParameters (parameters);

    mockups.onReady (function () {
      mockups.setLayout ('terminal');
      mockups.render ();
      document.getElementById ('btn-render').value = 'Render';
    });
  });

}) (document)
