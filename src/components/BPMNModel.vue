<template>
  <div>
    <div v-if="listo == false" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <!--div v-else id="canvas"></div-->
    <div id="svgContainer">
      <panZoom>
        <p v-html="svgDiagram"></p>
      </panZoom>
    </div>
  </div>
</template>

<script>
// MODELO
import axios from "axios";
//import BpmnJS from "bpmn-js";
import BpmnJS from "@/js";
import minimapModule from "diagram-js-minimap";
import ZoomScrollModule from "diagram-js/lib/navigation/zoomscroll";
import MoveCanvasModule from "diagram-js/lib/navigation/movecanvas";
//import PaletteProvider from "bpmn-js/lib/features/palette/PaletteProvider";
//import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
//import AutoLayout from "@/js/Layout"

export default {
  name: "BPMNModel",
  components: {},
  props: {
    team_id: String,
    team_project_id: String,
    jenkins_id: String,
    github_id: String,
  },
  data() {
    return {
      apexLoading: false,
      listo: false,
      svgDiagram: null,
    };
  },
  created() {
    this.getModel();
    // DESCOMENTAR ESTO DESPUESSSSSSSSSSSSSSSS// ??????
    //this.generateLastModel();
    //this.getProjectBPMN(this.team_project_id);
  },
  methods: {
    getJenkinsRegisters() {
      axios
        .post(process.env.VUE_APP_JENKINS_BASE_URL + "/jenkins", {
          team_id: this.team_id,
          team_project_id: this.team_project_id,
          source_id: this.jenkins_id,
        })
        .then(() => {
          return true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getGithubRegisters() {
      axios
        .post(process.env.VUE_APP_GITHUB_BASE_URL + "/github", {
          team_project_id: this.team_project_id,
          source_id: this.github_id,
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getJiraRegisters() {
      axios
        .post(process.env.VUE_APP_JIRA_BASE_URL + "/jira", {
          team_id: this.team_id,
        })
        .then(() => {
          return true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getModel() {
      axios
        .post(process.env.VUE_APP_BASE_URL + "/process-model/get-model", {
          team_id: this.team_id,
          team_project_id: this.team_project_id,
          source_id_github: this.github_id,
          source_id_jenkins: this.jenkins_id,
        })
        .then((r) => {
          this.svgDiagram = r.data;
          this.listo = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    generateLastModel() {
      this.getRegisters();
      axios
        .get(
          process.env.VUE_APP_BASE_URL +
            "/pm/generate-model/" +
            this.team_project_id
        )
        .then(() => {
          this.getProjectBPMN(this.team_project_id);
          this.listo = true;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //funcion para obtener un modelo bpmn
    getProjectBPMN(team_project_id) {
      axios
        .get(
          process.env.VUE_APP_BASE_URL +
            "/process-model/get-last-bpmn/" +
            team_project_id
        )
        .then((r) => {
          this.svgDiagram = r.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getProjectBPMNantiguo(team_project_id) {
      axios
        .get(
          process.env.VUE_APP_BASE_URL +
            "/process-model/get-last-bpmn/" +
            team_project_id
        )
        .then((r) => {
          this.svgDiagram = r.data;
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
              //{
              //  __init__: ["paletteProvider"],
              //  paletteProvider: ["type", CustomPaletteProvider],
              //},
            ],
            //propertiesPanel: {
            //  parent: "#properties",
            //},
          });
          console.log(viewer);
          this.viewer = viewer;
          try {
            var parser = new DOMParser();
            var doc = parser.parseFromString(xml, "text/xml");
            var x = doc.getElementsByName("CONSTRUIR");
            //var elements = doc.getElementsByTagName("bpmn:task")
            //console.log(elements)
            console.log(x[0]);
            //var el = doc.getElementById(x[0].id);
            //el.addEventListener("click", this.modifyText(), true);

            //var AutoLayout = require("@/js/Layout5");

            //var diagramXML = xml;

            //var autoLayout = new AutoLayout();

            //(async () => {
            //  var layoutedDiagramXML = await autoLayout.layoutProcess(
            //    diagramXML
            //  );
            viewer.importXML(xml, function () {
              var canvas = viewer.get("canvas");
              //canvas.addMarker(x[0].id, "highlight");

              canvas.zoom("fit-viewport");
              viewer.get("minimap").open();

              var elementRegistry = viewer.get("elementRegistry");
              //var elements = [];
              //var cont = 0;
              elementRegistry.filter(function (element) {
                //bpmn:Process bpmn:StartEvent label bpmn:ParallelGateway bpmn:EndEvent
                if (
                  //element.type == "bpmn:Task" ||
                  element.type == "bpmn:ExclusiveGateway" ||
                  //element.type == "bpmn:SequenceFlow" ||
                  //element.type == "bpmn:Process" ||
                  //element.type == "bpmn:StartEvent" ||
                  element.type == "bpmn:ParallelGateway" //||
                  //element.type == "bpmn:EndEvent"
                ) {
                  //cont += 1
                  /*console.log(element.di.waypoint)
                  if(element.di.waypoint != undefined){
                    element.di.waypoint[0].x = 20
                    element.di.waypoint[1].x = 20
                  }*/
                  //elements.push(element);
                }
                //console.log(element);
              });
              //console.log(cont);
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
              //});
              //console.log(layoutedDiagramXML);
            })();
          } catch (err) {
            console.log("error rendering", err);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {},
};
</script>

<style>
svg {
  height: 100%;
  width: 100%;
}
</style>