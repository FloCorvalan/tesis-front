<template>
  <div>
    <div v-if="listo == false" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <div v-else id="canvas"></div>
  </div>
</template>

<script>
// MODELO
import axios from "axios";
import BpmnJS from "bpmn-js";
import minimapModule from "diagram-js-minimap";
import ZoomScrollModule from "diagram-js/lib/navigation/zoomscroll";
import MoveCanvasModule from "diagram-js/lib/navigation/movecanvas";
//import PaletteProvider from "bpmn-js/lib/features/palette/PaletteProvider";
//import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

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
    };
  },
  created() {
    this.generateLastModel();
  },
  methods: {
    getJenkinsRegisters() {
      axios
        .post(process.env.VUE_APP_JENKINS_BASE_URL + "/jenkins", {
          team_id: this.team_id,
          team_project_id: this.team_project_id,
          source_id: this.jenkins_id,
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
        .catch((e) => {
          console.log(e);
        });
    },
    generateLastModel() {
      this.getJenkinsRegisters();
      this.getGithubRegisters();
      this.getJiraRegisters();
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
      /*class CustomPaletteProvider extends PaletteProvider {
        constructor(
          create,
          elementFactory,
          globalConnect,
          handTool,
          lassoTool,
          palette,
          spaceTool,
          translate
        ) {
          super(
            palette,
            create,
            elementFactory,
            spaceTool,
            lassoTool,
            handTool,
            globalConnect,
            translate
          );

          this.create = create;
          this.elementFactory = elementFactory;
          this.translate = translate;
        }

        getPaletteEntries(element) {
          const { create, elementFactory, translate } = this;

          return Object.assign(super.getPaletteEntries(element), {
            "terminate-end-event": {
              group: "event",
              className: "bpmn-icon-script-task",
              title: translate("Create Script Task"),
              action: {
                click: function (event) {
                  var shape = elementFactory.createShape({
                    type: "bpmn:ScriptTask",
                  });

                  shape.businessObject.scriptFormat = "Javascript";
                  shape.businessObject.script =
                    'console.log("test");\nnext(null, "done");';

                  create.start(event, shape);
                },
              },
            },
          });
        }
      }

      CustomPaletteProvider.$inject = [
        "create",
        "elementFactory",
        "globalConnect",
        "handTool",
        "lassoTool",
        "palette",
        "spaceTool",
        "translate",
      ];*/
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
  mounted() {},
};
</script>