PerspectiveMockups.js
================

A flat, perspective app screen mockup generator

PerspectiveMockups is a javascript library that renders nice phone screen mockups.

*Important*: it must be used to generate a picture to be saved as a PNG and then uploaded on a website or whatever; it is not meant to be used as a front-end framework;

##TL;DR
```
<html>
  <body>
    <canvas id="canvas"></canvas>
    <script src="perspectivemockups.js"></script>
    <script>
      var mockups = new PerspectiveMockups ('canvas');

      mockups.usePictures ([
        /* ... */
      ]);

      mockups.setParameters ({
        /* ... */
      });

      mockups.onReady (function () {
        mockups.setLayout ( /* city / metro / terminal */);
        mockups.render ( /* perspective / blueprint */);
      });
    </script>
  </body>
</html>
```

## Usage
(use the previous excerpt as a cheatsheet)
1. create a blank HTML page,
2. import the `perspectivemockups.js` script,
3. create a PerspectiveMockups object,
4. use some pictures, 
5. set some parameters,
6. set a layout,
7. render the scene.

## Methods

### new PerspectiveMockups ( String / Element )

Create a new `PerspectiveMockups` object. The parameter can either be the `id` of the `canvas` or the `canvas` element itself.

### mockups.usePictures( Array )

Add pictures to the set.

```
mockups.usePictures ( ['pictures/01.png', 'pictures/02.png', 'pictures/03.png', ... ] );
```

### mockups.setParameters( Object )

Set parameters for the rendering.

Possible keys of the Object:
 - `planeScale`: the scale (i.e. the "zoom") of the rendered picture (`Float`),
 - `planeWidth`: the width of the canvas (`Integer`),
 - `planeHeight`: the height of the canvas (`Integer`),
 - `planeOffsetX`: the translation on the horizontal axis of the rendered picture (`Integer`),
 - `planeOffsetY`: the translation on the vertical axis of the rendered picture (`Integer`),
 - `edgeThickness`: the thickness of the mockups' edge (`Integer`),
 - `screenSpacing`: the spacing between mockups (`Integer`).

### mockups.onReady( Function )

A callback to be executed once the pictures have loaded.

### mockups.setLayout( String )

The name of the layout of the mockups. They are from my imagination and although they try to reflect the layout itself, they are quite subjective.

Possible values for String:
 - `city`: the mockups are packed three by three, like a chocolate tablet,
 - `metro`: the mockups are laid side-by-side, by their height,
 - `terminal`: the mockups are laid side-by-side, like tapes, but with a different vertical offset.


### mockups.render( String )

Renders the scene. The scene must be rendered once all the pictures have loaded. To make sure this is the case, you can use it in the callback of `mockups.onReady`.

Possible values for String:
 - `blueprint`: the mockups are laid flat,
 - `perspective`: the mockups are rendered in 3D (what you might expect).
