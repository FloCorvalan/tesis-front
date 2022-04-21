<template>
    <div id="canvas"></div>
</template>

<script>
// MODELO
import axios from "axios";
import BpmnJS from "bpmn-js";
import minimapModule from "diagram-js-minimap";
import ZoomScrollModule from "diagram-js/lib/navigation/zoomscroll";
import MoveCanvasModule from "diagram-js/lib/navigation/movecanvas";

export default {
  name: "BPMNModel",
  components: {
  },
  props: {
      team_project_id: String
  },
  data() {
    return {
      apexLoading: false,
    };
  },
  created() {
    this.getProjectBPMN(this.team_project_id)
  },
  methods: {
    //funcion para obtener un modelo bpmn
    getProjectBPMN(team_project_id) {
      axios
        .get(
          process.env.VUE_APP_BASE_URL +
            "/process-model/get-last-bpmn/" +
            team_project_id
        )
        .then((r) => {
          this.diagram = r.data;
          //console.log(this.diagram);
          const xml = this.diagram; // my BPMN 2.0 xml
          const viewer = new BpmnJS({
            container: "#canvas",
            position: "relative",
            height: "100vh",
            additionalModules: [
              minimapModule,
              ZoomScrollModule,
              MoveCanvasModule,
            ],
          });
          console.log(viewer);
          this.viewer = viewer;
          try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(xml, "text/xml");
            var x = doc.getElementsByName("CONSTRUIR");
            console.log(x[0].id);
            //var el = doc.getElementById(x[0].id);
            //el.addEventListener("click", this.modifyText(), true);

            viewer.importXML(xml, function () {
              var canvas = viewer.get("canvas");
              canvas.addMarker(x[0].id, "highlight");

              canvas.zoom("fit-viewport");
              viewer.get("minimap").open();
              //console.log(viewer.get("minimap"));
              //canvas.addMarker('task', 'highlight');
              //var elementRegistry = viewer.get('elementRegistry');

              /*var eventBus = viewer.get("eventBus");

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
              });*/
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
  mounted() {

  },
};
</script>