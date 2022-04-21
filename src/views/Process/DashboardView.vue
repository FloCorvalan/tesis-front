<template>
  <v-container fluid>
    <div class="dashboard-page">
      <v-row no-gutters class="d-flex justify-space-between mt-10 mb-6">
        <h1 class="page-title">Dashboard</h1>
      </v-row>
      <v-row>
        <!-- AQUI EMPIEZA -->
        <v-col cols="12">
          <v-card class="mx-1 mb-1">
            <v-card-title class="pa-6 pb-0">
              <v-row no-gutters>
                <v-col
                  cols="7"
                  sm="4"
                  md="4"
                  lg="5"
                  class="d-flex align-center"
                >
                  <p>Modelo de proceso BPMN equipo {{ team_name }}</p>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text class="pa-6">
              <v-row>
                <v-col class="overflow-hidden">
                  <!-- BPMN -->
                  <ul v-for="project in projects" :key="project.id">
                    <li>
                      <div
                        class="project-name"
                        v-on:click="changeVisibleModel(project)"
                      >
                        Proyecto {{ project.name }}
                      </div>
                    </li>
                  </ul>
                  <ul v-for="(project, index) in projects" :key="index">
                    <li v-if="project.visibleModel == true">
                      <BPMNModel :team_project_id="project.id"> </BPMNModel>
                    </li>
                  </ul>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- JIRA -->
        <v-col lg="4" sm="6" cols="12">
          <v-card class="mx-1 mb-1">
            <v-card-title class="pa-6 pb-3">
              <p>Jira</p>
              <v-spacer></v-spacer>
              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon color="textColor">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, i) in mock.menu"
                    :key="i"
                    @click="() => {}"
                  >
                    <v-list-item-title>{{ item }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <v-row no-gutters v-if="jira_options != []">
                <div v-for="(opt, index) in jira_options" :key="index">
                  <DonutChart :options="opt.options" :series="opt.series">
                  </DonutChart>
                </div>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- JENKINS -->
        <v-col lg="4" sm="6" cols="12">
          <v-card class="padding-card">
            <div class="tool-name">
              <h3>Jenkins</h3>
            </div>
            <ul v-for="project in projects" :key="project.id">
              <li>
                <div
                  class="project-name"
                  v-on:click="changeVisibleJenkins(project)"
                >
                  Proyecto {{ project.name }}
                </div>
              </li>
            </ul>
            <ul v-for="(project, index) in projects" :key="index">
              <li>
                <div v-if="project.visibleJenkins == true">
                  <v-card class="mx-1 mb-1">
                    <v-card-text class="pa-6 pt-0">
                      <v-row v-if="project.jenkins_options != null">
                        <DonutChart
                          :options="project.jenkins_options.options"
                          :series="project.jenkins_options.series"
                        >
                        </DonutChart>
                        <!--ApexChart
                  height="100%"
                  width="100%"
                  type="bar"
                  v-if="apexLoading"
                  :options="jenkins_options.options"
                  :series="jenkins_options.series"
                ></ApexChart-->
                      </v-row>
                      <v-row v-if="project.jenkins_options_bar != null">
                        <BarChart
                          :options="project.jenkins_options_bar.options"
                          :series="project.jenkins_options_bar.series"
                        >
                        </BarChart>
                        <!--ApexChart
                  height="100%"
                  width="100%"
                  type="bar"
                  v-if="apexLoading"
                  :options="jenkins_options.options"
                  :series="jenkins_options.series"
                ></ApexChart-->
                      </v-row>
                    </v-card-text>
                  </v-card>
                </div>
              </li>
            </ul>
          </v-card>
        </v-col>
        <!-- GITHUB -->
        <v-col lg="4" sm="6" cols="12">
          <v-card class="padding-card">
            <div class="tool-name">
              <h3>GitHub</h3>
            </div>
            <ul v-for="project in projects" :key="project.id">
              <li>
                <div
                  class="project-name"
                  v-on:click="changeVisibleGithub(project)"
                >
                  Proyecto {{ project.name }}
                </div>
              </li>
            </ul>
            <ul v-for="(project, index) in projects" :key="index">
              <li>
                <div v-if="project.visibleGithub == true">
                  <v-card class="mx-1 mb-1">
                    <v-card-text class="pa-6 pt-0">
                      <v-row v-if="project.github_options != null">
                        <div
                          v-for="(opt, index) in project.github_options"
                          :key="index"
                        >
                          <DonutChart
                            :options="opt.options"
                            :series="opt.series"
                          >
                          </DonutChart>
                        </div>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </div>
              </li>
            </ul>
          </v-card>
        </v-col>
        <v-col lg="4" sm="6" cols="12">
          <v-card class="mx-1 mb-1">
            <v-card-title class="pa-6 pb-3">
              <p>RNS</p>
              <v-spacer></v-spacer>
              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon color="textColor">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, i) in mock.menu"
                    :key="i"
                    @click="() => {}"
                  >
                    <v-list-item-title>{{ item }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <v-row no-gutters>
                <v-col cols="7" class="my-auto">
                  <span class="" style="font-size: 42px"
                    >175 <span class="error--text caption">-3.1%</span>
                  </span>
                </v-col>
                <v-col cols="5">
                  <ApexChart
                    height="100"
                    type="bar"
                    v-if="apexLoading"
                    :options="mock.apexBar3.options"
                    :series="mock.apexBar3.series"
                  ></ApexChart>
                </v-col>
              </v-row>
              <v-row no-gutters class="justify-space-between">
                <div>
                  <div class="subtext">
                    31 <v-icon color="error"> mdi-arrow-bottom-right</v-icon>
                  </div>
                  <div class="subtext-index">Registrations</div>
                </div>
                <div>
                  <div class="subtext">
                    3.23%<v-icon color="success"> mdi-arrow-top-right</v-icon>
                  </div>
                  <div class="subtext-index">Bounce Rate</div>
                </div>
                <div>
                  <div class="subtext">
                    301<v-icon color="success"> mdi-arrow-top-right</v-icon>
                  </div>
                  <div class="subtext-index">Views</div>
                </div>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card class="support-requests mx-1 mb-1">
            <v-card-title class="pa-6 pb-0">
              <p>Support Requests</p>
              <v-spacer></v-spacer>
              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon color="textColor">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, i) in mock.menu"
                    :key="i"
                    @click="() => {}"
                  >
                    <v-list-item-title>{{ item }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-title>
            <v-card-text class="pa-0">
              <v-simple-table>
                <template v-slot:default>
                  <thead class="pl-2">
                    <tr>
                      <th class="text-left pa-6">NAME</th>
                      <th class="text-left">EMAIL</th>
                      <th class="text-left">PRODUCT</th>
                      <th class="text-left">PRICE</th>
                      <th class="text-left">DATE</th>
                      <th class="text-left">CITY</th>
                      <th class="text-left">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in mock.table" :key="item.name">
                      <td class="pa-6">{{ item.name }}</td>
                      <td>{{ item.email }}</td>
                      <td>{{ item.product }}</td>
                      <td>{{ item.price }}</td>
                      <td>{{ item.date }}</td>
                      <td>{{ item.city }}</td>
                      <td v-if="item.status === 'Sent'">
                        <v-chip link color="success" class="ma-2 ml-0">
                          Sent
                        </v-chip>
                      </td>
                      <td v-else-if="item.status === 'Pending'">
                        <v-chip link color="warning" class="ma-2 ml-0">
                          Pending
                        </v-chip>
                      </td>
                      <td v-else-if="item.status === 'Declined'">
                        <v-chip link color="secondary" class="ma-2 ml-0">
                          Declined
                        </v-chip>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import mock from "./mock";
import ApexChart from "vue-apexcharts";
import DonutChart from "@/components/DonutChart.vue";
import BarChart from "@/components/BarChart.vue";
import BPMNModel from "@/components/BPMNModel.vue";
import axios from "axios";
// MODELO
/*import BpmnJS from "bpmn-js";
import minimapModule from "diagram-js-minimap";
import ZoomScrollModule from "diagram-js/lib/navigation/zoomscroll";
import MoveCanvasModule from "diagram-js/lib/navigation/movecanvas";*/

export default {
  name: "DashboardView",
  components: {
    ApexChart,
    DonutChart,
    BarChart,
    BPMNModel,
  },
  data() {
    return {
      mock,
      apexLoading: false,
      value: this.getRandomInt(10, 90),
      value2: this.getRandomInt(10, 90),
      mainApexAreaSelect: "Daily",

      //aqui empieza
      team_id: "6241fad36d714f635bafbc9f",
      team_name: "PROBANDO",
      projects: [],
      jenkins_options: null,
      jenkins_options_bar: null,
      jira_options: [],
    };
  },
  created() {
    //this.getBPMNs();
    this.getProjects();
    this.getJiraParticipation(this.team_id);
  },
  methods: {
    changeVisibleModel(project) {
      if (project.visibleModel == false) {
        project.visibleModel = true;
      } else {
        project.visibleModel = false;
      }
    },
    /*getBPMNs() {
      if (this.projects != []) {
        var i = 0;
        while (i < this.projects.length) {
          this.getProjectBPMN(this.projects[i].id);
          i++;
        }
      }
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
            var el = doc.getElementById(x[0].id);
            el.addEventListener("click", this.modifyText(), true);

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
              });  //*
            });
          } catch (err) {
            console.log("error rendering", err);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },*/
    //funcion para obtener los ids de proyectos de un equipo de desarrollo
    getProjects() {
      if (this.team_id != "") {
        axios
          .get(process.env.VUE_APP_BASE_URL + "/participation/get-projects", {
            team_id: this.team_id,
          })
          .then((response) => {
            var p = {
              id: null,
              name: null,
              jenkins_id: null,
              github_id: null,
              jenkins_options: null,
              jenkins_options_bar: null,
              github_options: [],
              visibleModel: false,
              visibleJenkins: false,
              visibleGithub: false,
            };
            var pList = [];
            response.data.forEach((element) => {
              p.id = element.id;
              p.name = element.name;
              p.jenkins_id = element.jenkins;
              p.github_id = element.github;
              pList.push(p);
            });
            this.projects = pList;
            this.getJenkinsParticipation();
            this.getGithubParticipation();
          });
      }
    },
    /////// funcion para cambiar la visibilidad de un projecto de jenkins
    changeVisibleJenkins(project) {
      if (project.visibleJenkins == false) {
        project.visibleJenkins = true;
      } else {
        project.visibleJenkins = false;
      }
    },
    getJenkinsParticipation() {
      if (this.projects != []) {
        var i = 0;
        while (i < this.projects.length) {
          this.getJenkinsProjectParticipation(i);
          i++;
        }
      }
    },
    //funcion para obtener la participacion en Jenkins para un proyecto
    getJenkinsProjectParticipation(index) {
      axios
        .get(process.env.VUE_APP_JENKINS_BASE_URL + "/jenkins/participation", {
          team_id: this.projects[index].id,
          source_id: this.projects[index].jenkins_id,
        })
        .then((response) => {
          console.log(response.data);
          var users = [];
          var percentages = [];
          var success_per = [];
          var failure_per = [];
          response.data.forEach((element) => {
            users.push(element.username);
            percentages.push(parseInt(element.total_per, 10));
            success_per.push(parseInt(element.success_per, 10));
            failure_per.push(parseInt(element.failure_per, 10));
          });
          var options = {
            series: percentages,
            options: {
              chart: {
                type: "donut",
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 200,
                    },
                    legend: {
                      position: "bottom",
                    },
                  },
                },
              ],
              labels: users,
              title: {
                text: "Builds",
              },
            },
          };
          this.projects[index].jenkins_options = options;
          var bar_options = {
            series: [
              {
                name: "Successful build percentage",
                data: success_per,
              },
              {
                name: "Failed build percentage",
                data: failure_per,
              },
            ],
            options: {
              chart: {
                type: "bar",
                height: 430,
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
                  colors: ["#fff"],
                },
              },
              stroke: {
                show: true,
                width: 1,
                colors: ["#fff"],
              },
              tooltip: {
                shared: true,
                intersect: false,
              },
              xaxis: {
                categories: users,
              },
            },
          };
          this.projects[index].jenkins_options_bar = bar_options;
        });
    },
    getJiraParticipation(t_id) {
      axios
        .get(process.env.VUE_APP_JIRA_BASE_URL + "/jira/participation", {
          team_id: t_id,
        })
        .then((response) => {
          var users = [];
          var percentages = [];
          console.log(response.data);
          for (var key in response.data) {
            response.data[key].forEach((e) => {
              users.push(e[0]);
              percentages.push(parseInt(e[1], 10));
            });
            var options = {
              series: percentages,
              options: {
                chart: {
                  type: "donut",
                },
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 200,
                      },
                      legend: {
                        position: "bottom",
                      },
                    },
                  },
                ],
                labels: users,
                title: {
                  text: key,
                },
              },
            };
            this.jira_options.push(options);
            users = [];
            percentages = [];
          }
          console.log(this.jira_options);
        });
    },
    /////// funcion para cambiar la visibilidad de un projecto de github
    changeVisibleGithub(project) {
      if (project.visibleGithub == false) {
        project.visibleGithub = true;
      } else {
        project.visibleGithub = false;
      }
    },
    getGithubParticipation() {
      if (this.projects != []) {
        var i = 0;
        while (i < this.projects.length) {
          this.getGithubProjectParticipation(i);
          i++;
        }
      }
    },
    //funcion para obtener la participacion en GitHub para un proyecto
    getGithubProjectParticipation(index) {
      axios
        .get(process.env.VUE_APP_GITHUB_BASE_URL + "/github/participation", {
          team_id: this.projects[index].id,
          source_id: this.projects[index].github_id,
        })
        .then((response) => {
          var users = [];
          var commits_percentages = [];
          var additions_percentages = [];
          var deletions_percentages = [];
          console.log(response.data);
          response.data.forEach((e) => {
            users.push(e.name);
            commits_percentages.push(parseInt(e.commits_per, 10));
            additions_percentages.push(parseInt(e.additions_per, 10));
            deletions_percentages.push(parseInt(e.deletions_per, 10));
          });
          var options = {
            series: commits_percentages,
            options: {
              chart: {
                type: "donut",
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 200,
                    },
                    legend: {
                      position: "bottom",
                    },
                  },
                },
              ],
              labels: users,
              title: {
                text: "Commits",
              },
            },
          };
          this.projects[index].github_options.push(options);
          options = {
            series: additions_percentages,
            options: {
              chart: {
                type: "donut",
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 200,
                    },
                    legend: {
                      position: "bottom",
                    },
                  },
                },
              ],
              labels: users,
              title: {
                text: "Additions",
              },
            },
          };
          this.projects[index].github_options.push(options);
          options = {
            series: deletions_percentages,
            options: {
              chart: {
                type: "donut",
              },
              responsive: [
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: 200,
                    },
                    legend: {
                      position: "bottom",
                    },
                  },
                },
              ],
              labels: users,
              title: {
                text: "Deletions",
              },
            },
          };
          this.projects[index].github_options.push(options);
        });
    },
    ///////////////////
    modifyText() {
      console.log("HOLAAAAAAAAAAAAA");
    },
    generatePieSeries() {
      let series = [];

      for (let i = 0; i < 4; i++) {
        let y = Math.floor(Math.random() * (500 - 100 + 100)) + 100;
        series.push(y);
      }
      return series;
    },
    getRandomInt(min, max) {
      let rand = min - 0.5 + Math.random() * (max - min + 1);
      return Math.round(rand);
    },
  },
  mounted() {
    setTimeout(() => {
      this.apexLoading = true;
    });
  },
};
</script>

<style src="./Dashboard.scss" lang="scss"/>