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
                  <div id="canvas"></div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- JENKINS -->
        <v-col lg="4" sm="6" cols="12">
          <v-card class="mx-1 mb-1">
            <v-card-title class="pa-6 pb-3">
              <p>Jenkins</p>
              <v-spacer></v-spacer>
              <v-btn>
                <v-icon>fa-expand</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-6 pt-0">
              <v-row v-if="jenkins_options != null">
                <ApexChart
                  height="100%"
                  width="100%"
                  type="bar"
                  v-if="apexLoading"
                  :options="jenkins_options.options"
                  :series="jenkins_options.series"
                ></ApexChart>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
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
                <DonutChart
                  :options="opt.options"
                  :series="opt.series"
                >
                </DonutChart>
                </div>
              </v-row>
            </v-card-text>
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
// MODELO
import axios from "axios";
import BpmnJS from "bpmn-js";
import minimapModule from "diagram-js-minimap";
import ZoomScrollModule from "diagram-js/lib/navigation/zoomscroll";
import MoveCanvasModule from "diagram-js/lib/navigation/movecanvas";

export default {
  name: "DashboardView",
  components: {
    ApexChart,
    DonutChart,
  },
  data() {
    return {
      mock,
      apexLoading: false,
      value: this.getRandomInt(10, 90),
      value2: this.getRandomInt(10, 90),
      mainApexAreaSelect: "Daily",

      //aqui empieza
      team_name: "PROBANDO",
      jenkins_options: null,
      jira_options: [],
    };
  },
  created() {
    this.getBPMN();
    this.getJenkinsParticipation(
      "6241fad36d714f635bafbc9f",
      "6241fb9a6db9b5f537d59a76"
    );
    this.getJiraParticipation(
      "6241fad36d714f635bafbc9f",
      "6241fb9a6db9b5f537d59a76"
    );
  },
  methods: {
    getBPMN() {
      axios
        .get(
          "http://127.0.0.1:5001/process-model/get-last-bpmn/6241fad36d714f635bafbc9f"
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
    getJenkinsParticipation(t_id, s_id) {
      axios
        .get("http://127.0.0.1:5001/jenkins/team-participation", {
          team_id: t_id,
          source_id: s_id,
        })
        .then((response) => {
          var users = [];
          var percentages = [];
          response.data.forEach((element) => {
            users.push(element.username);
            percentages.push(parseInt(element.total_per, 10));
          });
          //this.jenkins_options.options.xaxis.categories = users;
          //this.jenkins_options.series = [
          //  {
          //    data: percentages,
          //  },
          //];
          console.log(users);
          console.log(percentages);
          console.log(this.jenkins_options);
          var jenkins_options = {
            series: [
              {
                data: percentages,
              },
            ],
            options: {
              chart: {
                type: "bar",
                height: 350,
              },
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  horizontal: true,
                },
              },
              dataLabels: {
                enabled: false,
              },
              xaxis: {
                categories: users,
                max: 100,
              },
            },
          };
          this.jenkins_options = jenkins_options;
        });
    },
    getJiraParticipation(t_id, s_id) {
      axios
        .get("http://127.0.0.1:5001/jira/participation", {
          team_id: t_id,
          source_id: s_id,
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