<template>
  <div>
    <NavBar></NavBar>
    <v-container fluid class="back-color">
      <div class="dashboard-page">
        <v-row no-gutters class="d-flex justify-space-between mt-10 mb-6">
          <h1 class="page-title">Dashboard</h1>
        </v-row>
        <v-row>
          <!-- AQUI EMPIEZA -->
          <v-col cols="12">
            <v-card class="mx-1 mb-1 card-border">
              <v-card-title class="pa-6 pb-0 title-color">
                <v-row no-gutters>
                  <h3 class="section-title-font-size">Modelos de proceso BPMN equipo {{ team_name }}</h3>
                </v-row>
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col class="overflow-hidden">
                    <!-- BPMN -->
                    <ul v-for="project in projects" :key="project.id">
                      <li>
                        <div
                          class="project-name-2"
                          v-on:click="changeVisibleModel(project)"
                        >
                          <h3>Proyecto: {{ project.name }}</h3>
                        </div>
                      </li>
                    </ul>
                    <ul v-for="(project, index) in projects" :key="index">
                      <li v-if="project.visibleModel == true">
                        <BPMNModel
                          :team_id="team_id"
                          :team_project_id="project.id"
                          :github_id="project.github_id"
                          :jenkins_id="project.jenkins_id"
                          :leader_id="leader_id"
                        >
                        </BPMNModel>
                      </li>
                    </ul>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <v-card-title class="title-color card-border">
                <h3 class="section-title-font-size">
                  Participación de los desarrolladores equipo {{ team_name }}
                </h3>
              </v-card-title>
            </v-card>
          </v-col>
          <!-- JIRA -->
          <v-col lg="4" sm="6" cols="12">
            <v-card class="mx-1 mb-1 card-border">
              <div class="tool-name">
                <h3>Jira</h3>
              </div>
              <v-card-text class="pa-6 pt-0">
                <v-row no-gutters v-if="jira_options != []">
                  <div v-for="(opt, index) in jira_options" :key="index">
                    <div class="jira-title" :title="opt.title">
                      {{ opt.key }}<span class="question-mark">&#63;</span>
                    </div>
                    <div class="total-2">(total: {{ opt.total }} )</div>
                    <DonutChart :options="opt.options" :series="opt.series">
                    </DonutChart>
                  </div>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <!-- JENKINS -->
          <v-col lg="4" sm="6" cols="12">
            <v-card class="card-border">
              <div class="tool-name">
                <h3>Jenkins</h3>
              </div>
              <ul v-for="project in projects" :key="project.id">
                <li>
                  <div
                    class="project-name-3"
                    v-on:click="changeVisibleJenkins(project)"
                  >
                    Proyecto: {{ project.name }}
                  </div>
                </li>
              </ul>
              <ul v-for="(project, index) in projects" :key="index">
                <li>
                  <div v-if="project.visibleJenkins == true">
                    <v-card class="mx-1 mb-1">
                      <v-card-text class="pa-6 pt-0">
                        <v-row
                          no-gutters
                          v-if="project.jenkins_options != null"
                        >
                          <div
                            class="jenkins-title"
                            :title="project.jenkins_options.title"
                          >
                            {{ project.jenkins_options.key
                            }}<span class="question-mark">&#63;</span>
                          </div>
                          <div class="total-2">
                            (total: {{ project.jenkins_options.total }} )
                          </div>
                          <DonutChart
                            :options="project.jenkins_options.options"
                            :series="project.jenkins_options.series"
                          >
                          </DonutChart>
                        </v-row>
                        <v-row
                          no-gutters
                          v-if="project.jenkins_options_bar != null"
                        >
                          <div
                            class="jenkins-title"
                            :title="project.jenkins_options_bar.title"
                          >
                            {{ project.jenkins_options_bar.key
                            }}<span class="question-mark">&#63;</span>
                          </div>
                          <BarChart
                            :options="project.jenkins_options_bar.options"
                            :series="project.jenkins_options_bar.series"
                            :width="'110%'"
                            :height="'150%'"
                            :length="
                              project.jenkins_options_bar.options.xaxis
                                .categories.length
                            "
                            :offset="project.jenkins_options_bar.series.length"
                          >
                          </BarChart>
                        </v-row>
                        <v-row
                          no-gutters
                          v-if="project.jenkins_options_part != null"
                        >
                          <div
                            class="jenkins-title"
                            :title="project.jenkins_options_part.title"
                          >
                            {{ project.jenkins_options_part.key
                            }}<span class="question-mark">&#63;</span>
                          </div>
                          <div class="overflow-scroll-y">
                            <BarChart
                              :options="project.jenkins_options_part.options"
                              :series="project.jenkins_options_part.series"
                              :width="'110%'"
                              :height="'100%'"
                              :length="
                                project.jenkins_options_part.series[0].data
                                  .length
                              "
                              :offset="project.jenkins_options_part.series.length + 0.5"
                            >
                            </BarChart>
                          </div>
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
            <v-card class="card-border">
              <div class="tool-name">
                <h3>GitHub</h3>
              </div>
              <ul v-for="project in projects" :key="project.id">
                <li>
                  <div
                    class="project-name-3"
                    v-on:click="changeVisibleGithub(project)"
                  >
                    Proyecto: {{ project.name }}
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
                            <div class="github-title" :title="opt.title">
                              {{ opt.key }}
                              <span class="question-mark">&#63;</span>
                            </div>
                            <div class="total">(total: {{ opt.total }} )</div>
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
          <!-- PRODUCTIVITY -->
          <v-col cols="12">
            <v-card class="mx-1 mb-1 card-border">
              <v-card-title class="pa-6 pb-0 title-color">
                <v-row no-gutters>
                  <h3 class="section-title-font-size">Productividad equipo {{ team_name }}</h3>
                </v-row>
              </v-card-title>
              <v-card class="mx-1 mb-1">
                <v-card-title class="pa-6 pb-0">
                  <v-row no-gutters>
                    <p class="title-prod">Productividad grupal</p>
                  </v-row>
                </v-card-title>
                <v-card-text class="pa-6">
                  <v-row class="overflow-hidden">
                    <v-col class="overflow-hidden">
                      <div v-if="team.series[0].data != []">
                        <BarChart
                          :options="team.options"
                          :series="team.series"
                          :width="'100%'"
                          :height="'200%'"
                          :length="team.options.xaxis.categories.length"
                          :offset="team.series.length"
                          :type="1"
                        >
                        </BarChart>
                      </div>
                    </v-col>
                    <v-col>
                      <v-card class="card-act-prod">
                        <v-card-title class="card-prod-title"
                          >Desarrolladores con actividad en GitHub</v-card-title
                        >
                        <v-card-text>
                          <ul>
                            <v-list
                              v-for="name in participants"
                              :key="name"
                              class="card-prod-content"
                            >
                              <div>{{ name }}</div>
                            </v-list>
                          </ul>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card class="mx-1 mb-1">
                <v-card-title class="pa-6 pb-0">
                  <v-row no-gutters>
                    <p class="title-prod">Productividad individual</p>
                  </v-row>
                </v-card-title>
                <v-card-text class="pa-6">
                  <v-row>
                    <v-col class="overflow-hidden">
                      <ul v-for="project in projects" :key="project.id">
                        <li>
                          <div
                            class="project-name"
                            v-on:click="changeVisibleProdInd(project)"
                          >
                            <h3>Proyecto: {{ project.name }}</h3>
                          </div>
                        </li>
                      </ul>
                      <ul v-for="(project, index) in projects" :key="index">
                        <li v-if="project.visibleProdInd == true">
                          <ProdChart
                            :team_id="team_id"
                            :team_project_id="project.id"
                          >
                          </ProdChart>
                        </li>
                      </ul>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import DonutChart from "@/components/DonutChart.vue";
import BarChart from "@/components/BarChart.vue";
import BPMNModel from "@/components/BPMNModel.vue";
import ProdChart from "@/components/ProdChart.vue";
import NavBar from "@/components/NavBar.vue";
import axios from "axios";
import description from "./description.json";

export default {
  name: "DashboardView",
  components: {
    NavBar,
    DonutChart,
    BarChart,
    BPMNModel,
    ProdChart,
  },
  data() {
    return {
      apexLoading: false,

      //aqui empieza
      //team_id: "6241fad36d714f635bafbc9f",
      //team_id: "62702b09e2115db94f9d2d41",
      token: JSON.parse(localStorage.getItem("token")),
      team_id: JSON.parse(localStorage.getItem("teamId")),
      //team_name: "PROBANDO",
      team_name: JSON.parse(localStorage.getItem("teamName")),
      leader_id: JSON.parse(localStorage.getItem("leaderId")),
      team: null,
      projects: [],
      jenkins_options: null,
      jenkins_options_bar: null,
      jira_options: [],
      description: description,
      participants: []
    };
  },
  created() {
    //this.getBPMNs();
    this.getParticipants();
    this.getProjects();
    this.getJiraParticipation(this.team_id);
    this.getJiraProd();
  },
  methods: {
    changeVisibleModel(project) {
      if (project.visibleModel == false) {
        project.visibleModel = true;
      } else {
        project.visibleModel = false;
      }
    },
    changeVisibleProdInd(project) {
      if (project.visibleProdInd == false) {
        project.visibleProdInd = true;
      } else {
        project.visibleProdInd = false;
      }
      console.log(project);
    },
    //funcion para obtener los ids de proyectos de un equipo de desarrollo
    getProjects() {
      if (this.team_id != "") {
        var headers = {
          Authorization: `Bearer: ${this.token}`,
        };
        axios
          .post(
            process.env.VUE_APP_BASE_URL + "/participation/get-projects",
            {
              team_id: this.team_id,
            },
            { headers }
          )
          .then((response) => {
            var p = {
              id: null,
              name: null,
              jenkins_id: null,
              github_id: null,
              jenkins_options: null,
              jenkins_options_bar: null,
              jenkins_options_part: null,
              github_options: [],
              visibleModel: false,
              visibleJenkins: false,
              visibleGithub: false,
              visibleProdInd: false,
              visbleProdTeam: false,
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
          })
          .catch((error) => {
            console.log(error);
            this.$store.commit("saveAuthen", false);
            this.$store.commit("saveToken", null);
            this.$router.push("/login");
          });
      }
    },
    getParticipants() {
      if (this.team_id != "") {
        var headers = {
          Authorization: `Bearer: ${this.token}`,
        };
        axios
          .post(
            process.env.VUE_APP_BASE_URL + "/prod/part-names",
            {
              team_id: this.team_id,
            },
            { headers }
          )
          .then((response) => {
            this.participants = response.data;
          })
          .catch((error) => {
            console.log(error);
            this.$store.commit("saveAuthen", false);
            this.$store.commit("saveToken", null);
            this.$router.push("/login");
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
          this.getJenkinsProjectStages(i);
          i++;
        }
      }
    },
    //funcion para obtener la participacion en Jenkins para un proyecto
    getJenkinsProjectParticipation(index) {
      var headers = {
        Authorization: `Bearer: ${this.token}`,
      };
      axios
        .post(
          process.env.VUE_APP_BASE_URL + "/participation/jenkins",
          {
            team_project_id: this.projects[index].id,
            source_id: this.projects[index].jenkins_id,
          },
          { headers }
        )
        .then((response) => {
          console.log(response.data);
          var users = [];
          var percentages = [];
          var success_per = [];
          var failure_per = [];
          response.data.developers.forEach((element) => {
            users.push(element.username);
            percentages.push(parseInt(element.total_per, 10));
            success_per.push(parseInt(element.success_per, 10));
            failure_per.push(parseInt(element.failure_per, 10));
          });
          var options = {
            total: response.data.total_builds,
            key: "Construcciones del pipeline",
            title: description.jenkins.construcciones,
            series: percentages,
            options: {
              chart: {
                type: "donut",
              },
              dataLabels: {
                  style: {
                    fontSize: "12px",
                    colors: ["#000"],
                  },
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
              //title: {
              //  text: "Construcciones del pipeline",
              //},
            },
          };
          this.projects[index].jenkins_options = options;
          var bar_options = {
            key: "Construcciones exitosas vs fallidas",
            title: description.jenkins.comparacion,
            series: [
              {
                name: "Construcciones exitosas",
                data: success_per,
              },
              {
                name: "Construcciones fallidas",
                data: failure_per,
              },
            ],
            options: {
              chart: {
                type: "bar",
                height: 350,
                stacked: true,
                stackType: "100%",
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                },
              },
              stroke: {
                width: 0,
                colors: ["#fff"],
              },
              //title: {
              //  text: "Construcciones exitosas vs fallidas",
              //},
              xaxis: {
                categories: users,
              },
              tooltip: {
                y: {
                  formatter: function (val) {
                    return val + "%";
                  },
                },
              },
              fill: {
                opacity: 1,
              },
              legend: {
                position: "top",
                horizontalAlign: "left",
                offsetX: 40,
              },
            },
          };
          this.projects[index].jenkins_options_bar = bar_options;
        })
        .catch((error) => {
          console.log(error);
          this.$store.commit("saveAuthen", false);
          this.$store.commit("saveToken", null);
          this.$router.push("/login");
        });
    },
    getJenkinsProjectStages(index) {
      var headers = {
        Authorization: `Bearer: ${this.token}`,
      };
      axios
        .post(
          process.env.VUE_APP_BASE_URL + "/participation/jenkins/stages",
          {
            team_project_id: this.projects[index].id,
            source_id: this.projects[index].jenkins_id,
          },
          { headers }
        )
        .then((response) => {
          console.log(response.data);
          var data = [];
          var data_inner = {};
          for (var key in response.data) {
            data_inner = {
              x: key,
              y: response.data[key].count,
              names: response.data[key].stages_names,
            };
            data.push(data_inner);
            data_inner = {};
          }
          var options = {
            key: "Cantidad de etapas (horizontal) en cada ejecución del pipeline (vertical)",
            title: description.jenkins.participants,
            series: [
              {
                data: data,
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
                },
              },
              dataLabels: {
                enabled: false,
              },
              xaxis: {
                type: "category",
              },
              tooltip: {
                custom: function ({ seriesIndex, dataPointIndex, w }) {
                  var data =
                    w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                  var template = '<div class="my-tooltip"><ul>';
                  template +=
                    '<li style="font-weight:bold">' + data.y + " Etapas: </li>";
                  data.names.forEach((element) => {
                    template += "<li>" + element + "</li>";
                  });
                  template += "</ul></div>";
                  return template;
                },
              },
            },
          };
          this.projects[index].jenkins_options_part = options;
        })
        .catch((error) => {
          console.log(error);
          this.$store.commit("saveAuthen", false);
          this.$store.commit("saveToken", null);
          this.$router.push("/login");
        });
    },
    getJiraParticipation(t_id) {
      var headers = {
        Authorization: `Bearer: ${this.token}`,
      };
      axios
        .post(
          process.env.VUE_APP_BASE_URL + "/participation/jira",
          {
            team_id: t_id,
          },
          { headers }
        )
        .then((response) => {
          var users = [];
          var percentages = [];
          var title = "";
          var key_title = "";
          var total;
          console.log(response.data);
          for (var key in response.data.developers) {
            response.data.developers[key].forEach((e) => {
              users.push(e[0]);
              percentages.push(parseInt(e[1], 10));
            });
            if (key === "Created issues") {
              key_title = "Incidencias creadas";
              title = description.jira.created_issues;
              total = response.data.totals["total_created"];
            } else if (key === "Updated issues") {
              key_title = "Actualizaciones a las incidencias";
              title = description.jira.updated_issues;
              total = response.data.totals["total_updated"];
            } else if (key === "Story point estimate") {
              key_title = "Evento: Estimación de puntos de historia";
              title = description.jira.story_point_estimate;
              total = response.data.totals[key];
            } else if (key === "resolution") {
              key_title = "Evento: Resolución";
              title = description.jira.resolution;
              total = response.data.totals[key];
            } else if (key === "status") {
              key_title = "Evento: Cambio de estado";
              title = description.jira.status;
              total = response.data.totals[key];
            } else if (key === "Sprint") {
              key_title = "Evento: Asignación a Sprint";
              title = description.jira.sprint;
              total = response.data.totals[key];
            } else if (key === "IssueParentAssociation") {
              key_title = "Evento: Asociaciar a una épica";
              title = description.jira.parent;
              total = response.data.totals[key];
            } else if (key === "Rank") {
              key_title = "Evento: Ordenar incidencias";
              title = description.jira.rank;
              total = response.data.totals[key];
            } else if (key === "description") {
              key_title = "Evento: Agregar descripción";
              title = description.jira.description;
              total = response.data.totals[key];
            } else if (key === "Fix Version") {
              key_title = "Evento: Asociar a una versión";
              title = description.jira.version;
              total = response.data.totals[key];
            } else {
              key_title = "No asignado";
              title = "No asignado";
              total = 0;
            }
            var options = {
              total: total,
              key: key_title,
              title: title,
              series: percentages,
              options: {
                chart: {
                  type: "donut",
                },
                dataLabels: {
                  style: {
                    fontSize: "12px",
                    colors: ["#000"],
                  },
                },
                stroke: {
                  show: true,
                  curve: "smooth",
                  lineCap: "butt",
                  colors: ["#FFF"],
                  width: 2,
                  dashArray: 0,
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
                //title: {
                //  text: key,
                //},
              },
            };
            this.jira_options.push(options);
            users = [];
            percentages = [];
          }
          console.log(this.jira_options);
        })
        .catch((error) => {
          console.log(error);
          this.$store.commit("saveAuthen", false);
          this.$store.commit("saveToken", null);
          this.$router.push("/login");
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
      var headers = {
        Authorization: `Bearer: ${this.token}`,
      };
      axios
        .post(
          process.env.VUE_APP_BASE_URL + "/participation/github",
          {
            team_project_id: this.projects[index].id,
            source_id: this.projects[index].github_id,
          },
          { headers }
        )
        .then((response) => {
          console.log(response);
          var users = [];
          var commits_percentages = [];
          var additions_percentages = [];
          var deletions_percentages = [];
          var files_added_percentages = [];
          console.log(response.data);
          response.data.developers.forEach((e) => {
            users.push(e.name);
            commits_percentages.push(parseInt(e.commits_per, 10));
            additions_percentages.push(parseInt(e.additions_per, 10));
            deletions_percentages.push(parseInt(e.deletions_per, 10));
            files_added_percentages.push(parseInt(e.files_added_per, 10));
          });
          var options = {
            total: response.data.totals.total_commits,
            key: "Commits",
            title: description.github.commits,
            series: commits_percentages,
            options: {
              chart: {
                type: "donut",
              },
              dataLabels: {
                  style: {
                    fontSize: "12px",
                    colors: ["#000"],
                  },
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
              //title: {
              //  text: "Commits",
              //},
            },
          };
          this.projects[index].github_options.push(options);
          options = {
            total: response.data.totals.total_additions,
            key: "Líneas de código agregadas o modificadas",
            title: description.github.additions,
            series: additions_percentages,
            options: {
              chart: {
                type: "donut",
              },
              dataLabels: {
                  style: {
                    fontSize: "12px",
                    colors: ["#000"],
                  },
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
              //title: {
              //  text: "Additions",
              //},
            },
          };
          this.projects[index].github_options.push(options);
          options = {
            total: response.data.totals.total_deletions,
            key: "Líneas de código eliminadas",
            title: description.github.deletions,
            series: deletions_percentages,
            options: {
              chart: {
                type: "donut",
              },
              dataLabels: {
                  style: {
                    fontSize: "12px",
                    colors: ["#000"],
                  },
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
              //title: {
              //  text: "Deletions",
              //},
            },
          };
          this.projects[index].github_options.push(options);
          options = {
            total: response.data.totals.total_files_added,
            key: "Archivos agregados",
            title: description.github.files_added,
            series: files_added_percentages,
            options: {
              chart: {
                type: "donut",
              },
              dataLabels: {
                  style: {
                    fontSize: "12px",
                    colors: ["#000"],
                  },
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
              //title: {
              //  text: "Files added",
              //},
            },
          };
          this.projects[index].github_options.push(options);
        })
        .catch((error) => {
          console.log(error);
          this.$store.commit("saveAuthen", false);
          this.$store.commit("saveToken", null);
          this.$router.push("/login");
        });
    },
    getJiraProd() {
      var headers = {
        Authorization: `Bearer: ${this.token}`,
      };
      axios
        .post(
          process.env.VUE_APP_BASE_URL + "/prod/jira",
          {
            team_id: this.team_id,
            //team_project_id: this.team_project_id,
          },
          { headers }
        )
        .then((response) => {
          var names = [];
          var estimated = [];
          var completed = [];
          for (var key in response.data) {
            names.push(response.data[key].name);
            estimated.push(response.data[key].estimated);
            completed.push(response.data[key].completed);
          }
          var bar_options = {
            series: [
              {
                name: "Puntos de historia estimados antes del Sprint",
                data: estimated,
              },
              {
                name: "Puntos de historia completados al terminar el Sprint",
                data: completed,
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
                  colors: ["#000"],
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
                categories: names,
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
              /*title: {
                text: "Team productivity",
                align: "left",
                offsetX: 0,
                offsetY: 0,
                floating: false,
                style: {
                  fontSize: "14px",
                  fontWeight: "bold",
                  fontFamily: undefined,
                  color: "#263238",
                },
              },*/
            },
          };
          this.team = bar_options;
        })
        .catch((error) => {
          console.log(error);
          this.$store.commit("saveAuthen", false);
          this.$store.commit("saveToken", null);
          this.$router.push("/login");
        });
    },
    ///////////////////
  },
  mounted() {
  },
};
</script>

<style src="./Dashboard.scss" lang="scss"/>