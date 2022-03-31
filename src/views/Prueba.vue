<template>
  <div>
    <img :src="image" />
    <div class="container">
      <div id="canvas"></div>

      <div id="js-properties-panel" class="panel"></div>
    </div>
    <div>
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
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';

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
            additionalModules: [minimapModule, ZoomScrollModule, MoveCanvasModule],
          });
          console.log(viewer);
          this.viewer = viewer;
          try {
            viewer.importXML(xml, function () {
              var canvas = viewer.get("canvas");

              canvas.zoom("fit-viewport");
              //canvas.addMarker('task', 'highlight');
              //var elementRegistry = viewer.get('elementRegistry');
              
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
                  //viewer.get("minimap").open();
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
  },
};
</script>