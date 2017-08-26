var SnapOneByFour = function(config) {
    this.config = config;
    // this.paper = Snap('#viewport', his.config.window_width, this.config.window_height);
    this.paper = Snap();
    this.paper.attr({
      viewBox: [0, 0, 2000, 750]
    });
    Snap.select('#viewport').append(this.paper);
    // this.frames = this.paper.group(); // List of SVG black rects
    // this.images = this.paper.group(); // List of SVG images
    // this.all = this.paper.group();
    // this.overlayImage = null;
    // this.photoBorder = 0;
    // this.compositeDim = null;
    // this.frameDim = null;
    // this.compositeOrigin = null;
    // this.compositeCenter = null;
    // this.state = state;
    this.totalPictures = 3;
    // this.overlay = null;
    // this.photoViewLayout = null;

    // Snap.plugin( function( Snap, Element, Paper, global ) {
    //   Element.prototype.getCenter = function() {
    //     var bbox = this.getBBox();
    //     return [bbox.cx, bbox.cy]
    //   };
    // });

    // Polyfill for getTransformToElement as Chrome 48 has deprecated it, may be able to simplify globalToLocal now and leave out polyfill
    SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(elem) {
      return elem.getScreenCTM().inverse().multiply(this.getScreenCTM());
    };

    Snap.plugin( function( Snap, Element, Paper, global ) {
      Element.prototype.hide = function() {
        this.attr({ 'opacity': 0.0 });
        // var bbox = this.getBBox();
        // return [bbox.cx, bbox.cy]
      };
      Element.prototype.show = function() {
        this.attr({ 'opacity': 1.0 });
        // var bbox = this.getBBox();
        // return [bbox.cx, bbox.cy]
      };
      Element.prototype.getCenter = function() {
        var bbox = this.getBBox();
        return {x: bbox.cx, y:bbox.cy};
      };
      Element.prototype.getSize = function() {
        var bbox = this.getBBox();
        return {w: bbox.width, h:bbox.height};
      };
      Element.prototype.getPos = function() {
        var bbox = this.getBBox();
        return {x: bbox.x, y:bbox.y};
      };
      Element.prototype.getTransformRelative = function(relativeObj, type, absolute, xadjust, yadjust) {
        var movex = 0;
        var movey = 0;
        switch (type) {
          case "center":
          var c = relativeObj.getCenter();
          var elpos = this.getPos();
          var elsize = this.getSize();
          var movex = c.x - (elsize.w / 2);
          var movey = c.y - (elsize.h / 2);

          movex = (elpos.x > movex ? 0 - (elpos.x - movex) : movex - elpos.x);
          movey = (elpos.y > movey ? 0 - (elpos.y - movey) : movey - elpos.y);
          break;
          case "topleft":
          var movepos = relativeObj.getPos();
          var elpos = this.getPos();

          movex = (elpos.x > movepos.x ? 0 - (elpos.x - movepos.x) : movepos.x - elpos.x);
          movey = (elpos.y > movepos.y ? 0 - (elpos.y - movepos.y) : movepos.y - elpos.y);
          break;
          case "bottomleft":
          var movepos = relativeObj.getBBox();
          var elpos = this.getPos();

          movex = (elpos.x > movepos.x ? 0 - (elpos.x - movepos.x) : movepos.x - elpos.x);
          movey = (elpos.y > movepos.y2 ? 0 - (elpos.y - movepos.y2) : movepos.y2 - elpos.y);
          break;
          case "topright":
          var movepos = relativeObj.getPos();
          var rsize = relativeObj.getSize();
          var elsize = this.getSize();
          var elpos = this.getPos();

          movex = (elpos.x > movepos.x ? 0 - (elpos.x - movepos.x) : movepos.x - elpos.x);
          movey = (elpos.y > movepos.y ? 0 - (elpos.y - movepos.y) : movepos.y - elpos.y);
          movex += rsize.w - elsize.w;
          break;
          case "bottomright":
          var movepos = relativeObj.getBBox();
          var rsize = relativeObj.getSize();
          var elsize = this.getSize();
          var elpos = this.getPos();

          movex = (elpos.x > movepos.x2 ? 0 - (elpos.x - movepos.x2) : movepos.x2 - elpos.x);
          movey = (elpos.y > movepos.y2 ? 0 - (elpos.y - movepos.y2) : movepos.y2 - elpos.y);
          break;
          case "topcenter":
          var c = relativeObj.getCenter();
          var rpos = relativeObj.getPos();
          var elpos = this.getPos();
          var elsize = this.getSize();
          var movex = c.x - (elsize.w / 2);

          movex = (elpos.x > movex ? 0 - (elpos.x - movex) : movex - elpos.x);
          movey = (elpos.y > rpos.y ? 0 - (elpos.y - rpos.y) : rpos.y - elpos.y);
          break;
          case "bottomcenter":
          var c = relativeObj.getCenter();
          var rpos = relativeObj.getBBox();
          var elpos = this.getPos();
          var elsize = this.getSize();
          var movex = c.x - (elsize.w / 2);

          movex = (elpos.x > movex ? 0 - (elpos.x - movex) : movex - elpos.x);
          movey = (elpos.y > rpos.y2 ? 0 - (elpos.y - rpos.y2) : rpos.y2 - elpos.y);
          break;
          case "leftcenter":
          var c = relativeObj.getCenter();
          var rpos = relativeObj.getPos();
          var elpos = this.getPos();
          var elsize = this.getSize();
          var movey = c.y - (elsize.h / 2);

          movex = (elpos.x > rpos.x ? 0 - (elpos.x - rpos.x) : rpos.x - elpos.x);
          movey = (elpos.y > movey ? 0 - (elpos.y - movey) : movey - elpos.y);
          break;
          case "rightcenter":
          var c = relativeObj.getCenter();
          var rbox = relativeObj.getBBox();
          var elpos = this.getPos();
          var elsize = this.getSize();
          var movey = c.y - (elsize.h / 2);

          movex = (elpos.x > rbox.x2 ? 0 - (elpos.x - rbox.x2) : rbox.x2 - elpos.x);
          movey = (elpos.y > movey ? 0 - (elpos.y - movey) : movey - elpos.y);
          break;
          default:
          console.log("ERROR: Unknown transform type in getTransformRelative!");
          break;
        }

        if (typeof(xadjust) === 'undefined') xadjust = 0;
        if (typeof(yadjust) === 'undefined') yadjust = 0;
        movex = movex + xadjust;
        movey = movey + yadjust;

        return (absolute ? "T"+movex+","+movey : "t"+movex+","+movey);
      };

      Element.prototype.getCenterPoint = function( x, y ) {
        var pt = this.paper.node.createSVGPoint();
        var center = this.getCenter();
        pt.x = center.x; pt.y = center.y;
        return pt.matrixTransform( this.paper.node.getScreenCTM().inverse());
      };

      Element.prototype.globalToLocal = function( globalPoint ) {
        var globalToLocal = this.node.getTransformToElement( this.paper.node ).inverse();
        globalToLocal.e = globalToLocal.f = 0;
        return globalPoint.matrixTransform( globalToLocal );
      };

      Element.prototype.zoomToFit = function() {
        //paper -> global?
        //var pt1 = frame1.getCursorPoint(paper.getCenterPoint().x,paper.getCenterPoint().y)
        // var pt = frame1.globalToLocal(pt1)
        // undefined
        // var t = "t" + [pt.x, pt.y]
        // undefined
        // t
        // "t354.1203918457031,132.8743133544922"
        // window.p.photoViewLayout.paper.animate({transform: t}, 1000, mina.easeinout);


        var centerPoint = this.getCenterPoint();

        var paperPoint = this.paper.getCenterPoint()
        var pt = this.paper.node.createSVGPoint();

        pt.x = paperPoint.x - centerPoint.x;
        pt.y = paperPoint.y - centerPoint.y;

        var localPt = this.globalToLocal( pt );
        var localMatrix = this.transform().localMatrix;

        // return this.transform( localMatrix.toTransformString() + "t" + [  localPt.x, localPt.y ] );
        return  localMatrix.toTransformString() + "t" + [  localPt.x, localPt.y ] ;
      };


      Element.prototype.ztf = function (stuff) {
        // paper -> global?
        var centerPoint = stuff.getCenterPoint();
        var pt1 = this.getCursorPoint(centerPoint.x, centerPoint.y)
        var pt = this.globalToLocal(pt1)
        // undefined
        var t = "t" + [pt.x, pt.y]
        return t;
        // undefined
        // t
        // "t354.1203918457031,132.8743133544922"
        // window.p.photoViewLayout.paper.animate({transform: t}, 1000, mina.easeinout);
      }
      Element.prototype.getCursorPoint = function( x, y ) {
        var pt = this.paper.node.createSVGPoint();
        pt.x = x; pt.y = y;
        return pt.matrixTransform( this.paper.node.getScreenCTM().inverse());
      };

      Element.prototype.altDrag = function() {
        return this.drag( altMoveDrag, altStartDrag );
      };

      function altMoveDrag( xxdx, xxdy, ax, ay ) {
        var tdx, tdy;
        var cursorPoint = this.getCursorPoint( ax, ay );
        var pt = this.paper.node.createSVGPoint();

        pt.x = cursorPoint.x - this.data('op').x;
        pt.y = cursorPoint.y - this.data('op').y;

        var localPt = this.globalToLocal( pt );

        this.transform( this.data('ot').toTransformString() + "t" + [  localPt.x, localPt.y ] );

      };

      function altStartDrag( x, y, ev ) {
        this.data('ibb', this.getBBox());
        this.data('op', this.getCursorPoint( x, y ));
        this.data('ot', this.transform().localMatrix);
      };
    });

  }

SnapOneByFour.prototype.render = function(cb) {
  var snap = this.paper;
  Snap.load("/images/drawing.svg", function(data){
    var el = data.select("svg");
  //   el.attr({'id':'paper'
  // // });
  // // , 'width':window.Config.window_width - 50
  // , 'width': "95%"
  // , 'height': "95%", 'display': "block", 'margin': "auto"});
  // ,'height':window.Config.window_height - 50});
    // el.transform('t0,'+0+'s'+compositeDim.w/755.91);

    snap.append(el)
    if (cb) {
      var overlay = el.select('#layer3');
      cb(overlay);
    }
  });
  return this.paper;


    // var w = this.config.window_width - this.config.photo_margin;
    // var h = this.config.window_height - this.config.photo_margin;
    // this.compositeDim = CameraUtils.scale4x1(w, h);
    // this.compositeOrigin = {
    //     x: (this.config.window_width - this.compositeDim.w) / 2,
    //     y: (this.config.window_height - this.compositeDim.h) / 2
    // };
    // this.compositeCenter = {
    //     x: this.compositeOrigin.x + (this.compositeDim.w/2),
    //     y: this.compositeOrigin.y + (this.compositeDim.h/2)
    // }
    // var r = this.paper.rect(this.compositeOrigin.x, this.compositeOrigin.y, this.compositeDim.w, this.compositeDim.h);
    //
    // r.attr({'fill': 'white'});
    //
    // this.paper.append(r);
    //
    // // Scale the photo padding too
    // this.photoBorder = this.compositeDim.w / 50;
    //
    //     //upper x
    // var frame_x = this.compositeOrigin.x + this.photoBorder;
    // var frame_y = this.compositeOrigin.y + this.photoBorder;
    //
    // var _frame_w = (this.compositeDim.w - (2*this.photoBorder));
    //
    // this.frameDim = {
    //     w: (this.compositeDim.w - (2*this.photoBorder)),
    //     h: _frame_w * 4/6 // TODO: Fixed aspect ratio?
    // };
    // var frame = this.paper.rect(frame_x, frame_y, this.frameDim.w, this.frameDim.h);
    // frame.attr({'fill': 'black'});
    // var img = this.paper.image(null, frame_x, frame_y, this.frameDim.w, this.frameDim.h);
    //
    // this.images.append(img);
    // this.frames.append(frame);
    // // this.all.append(img);
    // // this.all.append(frame);
    //
    // for (var i = 1; i < 4; i++) {
    //   frame = frame.clone();
    //   img = img.clone();
    //   frame.transform('t0,'+(i*(this.frameDim.h + this.photoBorder)));
    //   img.transform('t0,'+(i*(this.frameDim.h + this.photoBorder)));
    //   this.frames.append(frame);
    //   this.images.append(img);
    //   // this.all.append(frame);
    //   // this.all.append(img);
    // }
    //
    // // return [this.paper, this.all];
    // return this.paper;
    //
    // // // Draw the PNG logo overlay.
    // // var o = this.paper.image(
    // //     '/images/overlay_david.png',
    // //     this.compositeOrigin.x,
    // //     this.compositeOrigin.y,
    // //     this.compositeDim.w,
    // //     this.compositeDim.h);
    // // this.all.push(o);
    // // this.overlayImage = o;
    //
    // // Hide everything and move out of sight.
    // // this.all.hide();
    // // this.all.translate(-this.config.window_width, 0);
  }

SnapOneByFour.prototype.toString = function() {
    ret = [];
    ret.push("Size of 'all' set: " + this.all.length);
    ret.push("Size of 'frames' set: " + this.frames.length);
    ret.push("Composite photo is: " + this.all[0].attr('width') + 'x' + this.all[0].attr('height'));
    ret.push("Frame photo is: " + this.frameDim.w + 'x' + this.frameDim.h);
    return ret.join('\n');
  }

  /**
   * Updates the image at the set location.
   * @param {String} img_src
   *   The URL of the image resource the browser should fetch and display
   * @param {Integer} idx
   *   Index of frame to update
   * @param cb
   *   The callback to be executed when the UI has finished updating and zooming out.
   */
  SnapOneByFour.prototype.updatePhotoSet = function(img_src, idx, cb) {
    var view = this;
    var frameEl = view.select('#frame'+(idx + 1));
    var imgEl = frameEl.clone();

    return [imgEl, frameEl]
    // imgEl.attr({'src': img_src, 'opacity': 0});
    // imgEl.show();
    //
    // var afterShowPhoto = function () {
    //   // We've found and revealed the photo, now hide the old black rect and zoom out
    //   frameEl.hide();
    //   p.zoomFrame(idx, 'out', cb);
    // }
    // imgEl.animate({'opacity': 1}, 200, afterShowPhoto);
  }



  /**
   * zoomFrame zooms into the indicated frame.
   * Call it once to zoom in, call it again to zoom out.
   *
   * @param idx Frame index
   *   Expect zoomFrame(1) to be matched immediately by zoomFrame(1)
   * frame: 0 (upper left), 1 (upper-right), 2 (lower-left), 3 (lower-right)
   * @param dir 'in' or 'out'
   *   Zoom in or out
   * @param onfinish
   *   Callback executed when the animation is finished.
   *
   * Depends on the presence of the .zoomed object to store zoom info.
   */
  SnapOneByFour.prototype.zoomFrame = function(idx, dir, state, onfinish) {
      var view = this.paper;
      // var composite = this.all[idx];

      var bbox = view.select('#frame' + (idx + 1)).getBBox();
      var frameX = bbox.x;//frame.attr('x');
      var frameW = bbox.width;//frame.attr('width');
      var frameY = bbox.y;//frame.attr('y');
      var frameH = bbox.height;//frame.attr('height');
      var centerX = bbox.cx;//frameX + frameW/2;
      var centerY = bbox.cy;//frameY + frameH/2;

      var animSpeed = 1000;

      // delta to translate to.
      // var dx = (window.Config.window_width/2) - centerX;
      // var dy = (window.Config.window_height/2) - centerY;

      var svg = Snap.select('svg');
      var b = svg.getBBox();

      var compositeCenter = { x: b.cx,
                              y: b.cy };
      // var compositeCenter = { x: window.Config.window_width / 2,
      //                         y: window.Config.window_height / 2 };

      var dx = compositeCenter.x - centerX;
      var dy =  compositeCenter.y - centerY;
      var scaleFactor = b.width / frameW;
      if (dir === "out" && state.zoomed) {
          scaleFactor = 1;
          dx = -state.zoomed.dx;
          dy = -state.zoomed.dy;
          view.animate({
              transform: 's' + [1, 1, compositeCenter.x, compositeCenter.y].join(','),
          }, animSpeed, mina.bounce, //onFinish);
          function() {
              view.animate({
                  'translation': dx+','+dy
              }, animSpeed, mina.easeInOut, onfinish)
          });
          return null;
      } else if (dir !== "out") {
          view.animate({
              transform: 't'+ dx+','+ dy
              // transform: 's' + [1, 1, centerX, centerY].join(','),
          }, animSpeed, mina.easeInOut);//, function() {
          //     view.animate({
          //         transform: 's' + [scaleFactor, scaleFactor, compositeCenter.x, compositeCenter.y].join(','),
          //     }, animSpeed, mina.bounce, onfinish)
          // });
          // Store the zoom data for next zoom.
          return  {
              dx: dx,
              dy: dy,
              scaleFactor: scaleFactor
          };
      }
  }

SnapOneByFour.prototype.removeImages = function () {
  // // this.images.clear();
  // for (var i = 0; i < this.totalPictures; i++) {
  //   this.images.pop();
  // }
  // this.images.hide();
  // this.frames.show();
}

SnapOneByFour.prototype.createOverlayImage = function() {
  return this.paper.select('#layer3');
  // return this.overlay;
  // return this.paper.image(
    //   overlayImage,
    //   this.compositeOrigin.x,
    //   this.compositeOrigin.y,
    //   this.compositeDim.w,
    //   this.compositeDim.h);
  }

// SnapOneByFour.prototype.set = function() {
//   return this.paper.set();
// }
