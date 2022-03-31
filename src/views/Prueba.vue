<template>
  <div>
    <img :src="image" />
    <div id="canvas"></div>
  </div>
</template>
<style >
#bpmn .bjs-container {
  position: absolute;
}
</style>
<script>
import axios from "axios";
import { Buffer } from "buffer";
import BpmnJS from "bpmn-js";

export default {
  name: "PruebaImagen",
  components: {},
  data: function () {
    return {
      image: null,
      diagram: null,
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
            propertiesPanel: {
              parent: "#js-properties-panel",
            },
          });
          console.log(viewer);
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