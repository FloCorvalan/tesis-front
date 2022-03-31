<template>
  <div>
    <img :src="image" />
    <div class="container" v-on:click="setViewboxCenteredAroundPoint">
      <div id="canvas"></div>

      <div id="js-properties-panel" class="panel"></div>
    </div>
    <div>
      <button v-on:click="zoomOut">zoom out</button>
      <button v-on:click="zoomIn">zoom in</button>
    </div>
  </div>
</template>
<style >
@import url("diagram-js-minimap/assets/diagram-js-minimap.css");
@import url("bpmn-js/dist/assets/diagram-js.css");
@import url("bpmn-js/dist/assets/bpmn-font/css/bpmn.css");
</style>
<script>
import axios from "axios";
import { Buffer } from "buffer";
import BpmnJS from "bpmn-js";
import minimapModule from "diagram-js-minimap";
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

export default {
  name: "PruebaImagen",
  components: {},
  data: function () {
    return {
      image: null,
      diagram: null,
      viewer: null,
    };
  },
  created() {
    this.prueba();
    this.pruebados();
  },
  methods: {
    displayImage() {
      axios.get("http://localhost:8081/prueba/image/").then((response) => {
        console.log(response);
        try {
          this.image =
            "data:image/jpeg;base64," +
            btoa(
              new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
        } catch (err) {
          console.log(err);
        }
      });
    },
    getTeamParticipation() {
      axios
        .get("http://127.0.0.1:5001/jenkins/team-participation")
        .then((response) => {
          console.log(response.data[0].username);
        });
    },
    displayImage2() {
      axios
        .get(
          "http://127.0.0.1:5001/process-model/get-last-image/6241fad36d714f635bafbc9f",
          {
            responseType: "blob",
          }
        )
        .then((response) => {
          console.log(response);
          //let res1 = response.data
          //let blob = new Blob ([res1], {
          //type: "image/png"
          //});
          console.log(typeof response.data);
          var x = Buffer.from(response.data, "binary");
          console.log(x);
          var y = x.toString("base64");
          console.log(y);
          this.image = "data:image/png;base64,".concat(y);
          //console.log(this.image)
        });
    },
    prueba() {
      axios
        .get(
          "http://127.0.0.1:5001/process-model/get-last-image/6241fad36d714f635bafbc9f",
          {
            responseType: "blob",
          }
        )
        .then((response) => {
          var objectURL = URL.createObjectURL(response.data);
          this.image = objectURL;
        });
    },
    pruebados() {
      axios
        .get("http://127.0.0.1:5001/process-model/get-bpmn")
        .then((r) => {
          this.diagram = r.data;
          //console.log(this.diagram);
          const xml = this.diagram; // my BPMN 2.0 xml
          const viewer = new BpmnJS({
            container: "#canvas",
            position: "absolute",
            display: "flex",
            additionalModules: [minimapModule, ZoomScrollModule],
          });
          console.log(viewer);
          this.viewer = viewer;
          try {
            viewer.importXML(xml, function () {
              var canvas = viewer.get("canvas");

              canvas.zoom("fit-viewport");
              var eventBus = viewer.get("eventBus");

              // you may hook into any of the following events
              var events = [
                //"element.hover",
                //"element.out",
                "element.click",
                //"element.dblclick",
                //"element.mousedown",
                //"element.mouseup",
              ];

              events.forEach(function (event) {
                eventBus.on(event, function (e) {
                  // e.element = the model element
                  // e.gfx = the graphical element

                  console.log(event, "on", e.element.id);
                  viewer.get("minimap").open();
                  var canvas = document.getElementById("canvas");
                  console.log(canvas)
                  var context = canvas.getContext("2d");
                  var scale = 1;
                  var originx = 0;
                  var originy = 0;
                  canvas.onmousewheel = function (event) {
                    var mousex = event.clientX - canvas.offsetLeft;
                    var mousey = event.clientY - canvas.offsetTop;
                    var wheel = event.wheelDelta / 120; //n or -n

                    var zoom = 1 + wheel / 2;

                    context.translate(originx, originy);
                    context.scale(zoom, zoom);
                    context.translate(
                      -(mousex / scale + originx - mousex / (scale * zoom)),
                      -(mousey / scale + originy - mousey / (scale * zoom))
                    );

                    originx =
                      mousex / scale + originx - mousex / (scale * zoom);
                    originy =
                      mousey / scale + originy - mousey / (scale * zoom);
                    scale *= zoom;
                  };
                });
              });
            });
          } catch (err) {
            console.log("error rendering", err);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    zoomIn() {
      this.viewer.get("canvas").zoom(0.5);
    },
    setViewboxCenteredAroundPoint(point) {
      var canvas = this.viewer.get("canvas");
      // get cached viewbox to preserve zoom
      var cachedViewbox = canvas.viewbox(),
        cachedViewboxWidth = cachedViewbox.width,
        cachedViewboxHeight = cachedViewbox.height;

      canvas.viewbox({
        x: point.x - cachedViewboxWidth / 2,
        y: point.y - cachedViewboxHeight / 2,
        width: cachedViewboxWidth,
        height: cachedViewboxHeight,
      });
    },
    zoomOut() {
      var SCALE_FACTOR = 1.01;
      var canvas = this.viewer.get("canvas");

      canvas.height = canvas.height * (1 / SCALE_FACTOR);
      canvas.width = canvas.width * (1 / SCALE_FACTOR);

      var objects = canvas.objects;
      for (var i in objects) {
        var scaleX = objects[i].scaleX;
        var scaleY = objects[i].scaleY;
        var left = objects[i].left;
        var top = objects[i].top;

        var tempScaleX = scaleX * (1 / SCALE_FACTOR);
        var tempScaleY = scaleY * (1 / SCALE_FACTOR);
        var tempLeft = left * (1 / SCALE_FACTOR);
        var tempTop = top * (1 / SCALE_FACTOR);

        objects[i].scaleX = tempScaleX;
        objects[i].scaleY = tempScaleY;
        objects[i].left = tempLeft;
        objects[i].top = tempTop;

        objects[i].setCoords();
      }

      //canvas.save();
    },
  },
};
</script>