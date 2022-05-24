<template>
  <div>
    <div v-if="listo == false" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <!--div v-else id="canvas"></div-->
    <div id="svgContainer" v-if="listo">
      <panZoom>
        <p v-html="svgDiagram"></p>
      </panZoom>
    </div>
    <div class="disp-center">
      <div v-if="chart_jira != null">
        <BarChart
          :options="chart_jira.options"
          :series="chart_jira.series"
          :width="'50%'"
          :height="'100%'"
        >
        </BarChart>
      </div>
      <div v-if="chart_jenkins != null">
        <BarChart
          :options="chart_jenkins.options"
          :series="chart_jenkins.series"
          :width="'50%'"
          :height="'200%'"
        >
        </BarChart>
      </div>
      <div v-if="chart_github != null">
        <BarChart
          :options="chart_github.options"
          :series="chart_github.series"
          :width="'50%'"
          :height="'100%'"
        >
        </BarChart>
      </div>
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
import BarChart from "@/components/BarChart.vue";

export default {
  name: "BPMNModel",
  components: {
    BarChart,
  },
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
      chart_jira: null,
      chart_github: null,
      chart_jenkins: null,
      token: JSON.parse(localStorage.getItem("token")),
    };
  },
  created() {
    this.getModel();
    //this.getColors();
    // DESCOMENTAR ESTO DESPUESSSSSSSSSSSSSSSS// ??????
    //this.generateLastModel();
    //this.getProjectBPMN(this.team_project_id);
  },
  computed: {},
  methods: {
    getModel() {
      var headers = {
        Authorization: `Bearer: ${this.token}`,
      };
      axios
        .post(
          process.env.VUE_APP_BASE_URL + "/process-model/get-model",
          {
            team_id: this.team_id,
            team_project_id: this.team_project_id,
            source_id_github: this.github_id,
            source_id_jenkins: this.jenkins_id,
          },
          { headers }
        )
        .then((r) => {
          //console.log(r)
          this.svgDiagram = r.data;
          this.getActCount();
          this.listo = true;
        })
        .catch((error) => {
          console.log(error);
          this.$store.commit("saveAuthen", false);
          this.$store.commit("saveToken", null);
          this.$router.push("/login");
        });
    },
    getActCount() {
      var headers = {
        Authorization: `Bearer: ${this.token}`,
      };
      axios
        .post(
          process.env.VUE_APP_BASE_URL + "/process-model/get-activities-count",
          {
            team_project_id: this.team_project_id,
          },
          { headers }
        )
        .then((r) => {
          console.log(r);
          var i = 0;
          var count_jira = [];
          while (i < r.data.jira.count.length) {
            count_jira.push(parseInt(r.data.jira.count[i], 10));
            i += 1;
          }
          i = 0;
          var count_github = [];
          while (i < r.data.github.count.length) {
            count_github.push(parseInt(r.data.github.count[i], 10));
            i += 1;
          }
          i = 0;
          var count_jenkins = [];
          while (i < r.data.jenkins.count.length) {
            count_jenkins.push(parseInt(r.data.jenkins.count[i], 10));
            i += 1;
          }
          var bar_options_jira = {
            series: [
              {
                data: count_jira,
              },
            ],
            options: {
              chart: {
                type: "bar",
                height: 350,
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                  dataLabels: {
                    position: "top",
                  },
                },
              },
              dataLabels: {
                enabled: true,
                offsetX: -6,
                style: {
                  fontSize: "12px",
                  colors: ["#000"],
                },
              },
              tooltip: {
                shared: true,
                intersect: false,
              },
              stroke: {
                width: 0,
                colors: ["#fff"],
              },
              title: {
                text: "Actividades en Jira: cantidad de veces realizadas",
              },
              xaxis: {
                categories: r.data.jira.activities,
              },
              legend: {
                position: "top",
                verticalAlign: "top",
                containerMargin: {
                  left: 35,
                  right: 60,
                },
              },
              responsive: [
                {
                  breakpoint: 1000,
                  options: {
                    plotOptions: {
                      bar: {
                        horizontal: false,
                      },
                    },
                    legend: {
                      position: "top",
                    },
                  },
                },
              ],
            },
          };
          var bar_options_github = {
            series: [
              {
                data: count_github,
              },
            ],
            options: {
              chart: {
                type: "bar",
                height: 350,
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                  dataLabels: {
                    position: "top",
                  },
                },
              },
              dataLabels: {
                enabled: true,
                offsetX: -6,
                style: {
                  fontSize: "12px",
                  colors: ["#000"],
                },
              },
              tooltip: {
                shared: true,
                intersect: false,
              },
              stroke: {
                width: 0,
                colors: ["#fff"],
              },
              title: {
                text: "Actividades en GitHub: cantidad de veces realizadas",
              },
              xaxis: {
                categories: r.data.github.activities,
              },
              legend: {
                position: "top",
                verticalAlign: "top",
                containerMargin: {
                  left: 35,
                  right: 60,
                },
              },
              responsive: [
                {
                  breakpoint: 1000,
                  options: {
                    plotOptions: {
                      bar: {
                        horizontal: false,
                      },
                    },
                    legend: {
                      position: "top",
                    },
                  },
                },
              ],
            },
          };
          var bar_options_jenkins = {
            series: [
              {
                data: count_jenkins,
              },
            ],
            options: {
              chart: {
                type: "bar",
                height: 350,
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                  dataLabels: {
                    position: "top",
                  },
                },
              },
              dataLabels: {
                enabled: true,
                offsetX: -6,
                style: {
                  fontSize: "12px",
                  colors: ["#000"],
                },
              },
              tooltip: {
                shared: true,
                intersect: false,
              },
              stroke: {
                width: 0,
                colors: ["#fff"],
              },
              title: {
                text: "Actividades en Jenkins: cantidad de veces realizadas",
              },
              xaxis: {
                categories: r.data.jenkins.activities,
              },
              legend: {
                position: "top",
                verticalAlign: "top",
                containerMargin: {
                  left: 35,
                  right: 60,
                },
              },
              responsive: [
                {
                  breakpoint: 1000,
                  options: {
                    plotOptions: {
                      bar: {
                        horizontal: false,
                      },
                    },
                    legend: {
                      position: "top",
                    },
                  },
                },
              ],
            },
          };
          this.chart_jira = bar_options_jira;
          this.chart_github = bar_options_github;
          this.chart_jenkins = bar_options_jenkins;
          console.log(this.chart_jira);
        })
        .catch((error) => {
          console.log(error);
          this.$store.commit("saveAuthen", false);
          this.$store.commit("saveToken", null);
          this.$router.push("/login");
        });
    },
    ////////////////////////////////////////////////
    getColors() {
      for (const a of document.querySelectorAll("text")) {
        if (a.textContent.includes("IMPLEMENTACION_code")) {
          a.classList.add("color-class");
          console.log(a);
        }
      }
      var svg = document.querySelector("svg");
      console.log(svg);
      this.svgDiagram = svg;
    },
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
  mounted: function () {
    var elements = this.$el.querySelectorAll("text");
    console.log(elements);
    elements.forEach((element) => {
      element.classList.add("color-class");
      console.log(element);
    });
  },
};
</script>

<style>
.color-class {
  color: white;
}
</style>