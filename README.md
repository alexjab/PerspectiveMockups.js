PerspectiveMockups.js
================

Give a flat, perspective look to your mockups and screenshots.

**Important**: it must be used to generate a picture to be saved as a PNG and then uploaded on a website or whatever; it is not meant to generate pictures at page load.

![Mockups picture](http://i.imgur.com/EdOXg9m.png)

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
mockups.usePictures (['pictures/01.png', 'pictures/02.png', 'pictures/03.png', /* ... */ ]);
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

```
mockups.setParameters ({ planeScale: 1, /* ... */ });
```

### mockups.onReady( Function )

A callback to be executed once the pictures have loaded.

```
mockups.onReady (function () {
  /* ... */
});
```

### mockups.setLayout( String )

The name of the layout of the mockups. They are from my imagination and although they try to reflect the layout itself, they are quite subjective.

Possible values for String:
 - `city`: the mockups are packed three by three, like a chocolate tablet,
 - `metro`: the mockups are laid side-by-side, by their height,
 - `terminal`: the mockups are laid side-by-side, like tapes, but with a different vertical offset.

```
mockups.setLayout ('terminal');
```

### mockups.render( String )

Renders the scene. The scene must be rendered once all the pictures have loaded. To make sure this is the case, you can use it in the callback of `mockups.onReady`.

Possible values for String:
 - `blueprint`: the mockups are laid flat,
 - `perspective`: the mockups are rendered in 3D (what you might expect).

```
mockups.render ('perspective');
```

## A practical guide to actually achieving what was promised

### Using Firefox (recommended)

It works out of the box on recent versions of Firefox. You can create your HTML page and then just open it from Firefox.

### Using Chrome

#### #1 issue
TL;DR: you need to use a web server (e.g. `python -m SimpleHTTPServer`).

Explanation: it works, but Chrome's default security settings actually prevent some canvas operations for files from different domains. Moreover, Chrome consider that static files all come from different domains, so those operations are still impossible even though everything happens on your machine.

Workaround #1 (untested): you can launch Chrome from the command line with this setting: `--allow-file-access-from-files`

Credit where credit is due: [http://stackoverflow.com/questions/16217521/i-get-a-canvas-has-been-tainted-error-in-chrome-but-not-in-ff](http://stackoverflow.com/questions/16217521/i-get-a-canvas-has-been-tainted-error-in-chrome-but-not-in-ff).

Workaround #2: fire up a small web server from the command line (using Python): go to your project's directory and enter `python -m SimpleHTTPServer`, then point your browser to [http://localhost:8000](http://localhost:8000).

#### #2 issue

If your picture gets too large, then any attempt to save it may crash the tab. No workaround found yet.

### The planeScale parameter and glitches

When setting `planeScale` to a lower value, you will most likely see artifacts and glitches on your picture, this is due to the way browsers render pictures. If you need a smaller picture, just render a full size view (`planeScale` = `1`), and then reduce the picture size using an editor.

## An example
```
<html>
  <body>
    <canvas id="canvas" width="1440" height="900"></canvas>
    <script src="perspectivemockups.js"></script>
    <script>
      var mockups = new PerspectiveMockups ('canvas');

      mockups.usePictures (['screenshots/01.png', 'screenshots/02.png', 'screenshots/03.png', 'screenshots/04.png', 'screenshots/05.png', 'screenshots/06.png', 'screenshots/07.png', 'screenshots/08.png']);

      mockups.setParameters ({
        planeScale: 1,
        planeWidth: 5000,
        planeHeight: 3000,
        planeOffsetX: 0,
        planeOffsetY: 900,
        edgeThickness: 15,
        screenSpacing: 100
      });

      mockups.onReady (function () {
        mockups.setLayout ('terminal');
        mockups.render ('perspective');
      });
    </script>
  </body>
</html>
```

## The application

For more convenience, I've built a small web app; open it in a browser as you would have the library.

![application](http://i.imgur.com/ujSiIjB.png)

