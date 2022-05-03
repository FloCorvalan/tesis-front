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
                <h3>Modelos de proceso BPMN equipo {{ team_name }}</h3>
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
                        <h3>Proyecto {{ project.name }}</h3>
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
                      >
                      </BPMNModel>
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
              <h3>Jira</h3>
              <v-spacer></v-spacer>
              <v-menu>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon color="textColor">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title></v-list-item-title>
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
                      </v-row>
                      <v-row v-if="project.jenkins_options_bar != null">
                        <BarChart
                          :options="project.jenkins_options_bar.options"
                          :series="project.jenkins_options_bar.series"
                        >
                        </BarChart>
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
        <!-- PRODUCTIVITY -->
        <v-col cols="12">
          <v-card class="mx-1 mb-1">
            <v-card-title class="pa-6 pb-0">
              <v-row no-gutters>
                <h3>Productividad equipo {{ team_name }}</h3>
              </v-row>
            </v-card-title>
            <v-card class="mx-1 mb-1">
              <v-card-title class="pa-6 pb-0">
                <v-row no-gutters>
                  <p>Productividad grupal</p>
                </v-row>
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row class="overflow-hidden">
                  <v-col class="overflow-hidden">
                    <div v-if="team.series[0].data != []">
                      <BarChart :options="team.options" :series="team.series">
                      </BarChart>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-card class="mx-1 mb-1">
              <v-card-title class="pa-6 pb-0">
                <v-row no-gutters>
                  <p>Productividad individual</p>
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
                          <h3>Proyecto {{ project.name }}</h3>
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
</template>

<script>
import DonutChart from "@/components/DonutChart.vue";
import BarChart from "@/components/BarChart.vue";
import BPMNModel from "@/components/BPMNModel.vue";
import ProdChart from "@/components/ProdChart.vue";
import axios from "axios";

export default {
  name: "DashboardView",
  components: {
    DonutChart,
    BarChart,
    BPMNModel,
    ProdChart,
  },
  data() {
    return {
      apexLoading: false,
      value: this.getRandomInt(10, 90),
      value2: this.getRandomInt(10, 90),
      mainApexAreaSelect: "Daily",

      //aqui empieza
      //team_id: "6241fad36d714f635bafbc9f",
      team_id: "62702b09e2115db94f9d2d41",
      team_name: "PROBANDO",
      team: null,
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
    },
    //funcion para obtener los ids de proyectos de un equipo de desarrollo
    getProjects() {
      if (this.team_id != "") {
        axios
          .post(process.env.VUE_APP_BASE_URL + "/participation/get-projects", {
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
        .post(process.env.VUE_APP_JENKINS_BASE_URL + "/jenkins/participation", {
          team_project_id: this.projects[index].id,
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
        .post(process.env.VUE_APP_JIRA_BASE_URL + "/jira/participation", {
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
        .post(process.env.VUE_APP_GITHUB_BASE_URL + "/github/participation", {
          team_project_id: this.projects[index].id,
          source_id: this.projects[index].github_id,
        })
        .then((response) => {
          var users = [];
          var commits_percentages = [];
          var additions_percentages = [];
          var deletions_percentages = [];
          var files_added_percentages = [];
          console.log(response.data);
          response.data.forEach((e) => {
            users.push(e.name);
            commits_percentages.push(parseInt(e.commits_per, 10));
            additions_percentages.push(parseInt(e.additions_per, 10));
            deletions_percentages.push(parseInt(e.deletions_per, 10));
            files_added_percentages.push(parseInt(e.files_added_per, 10));
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
          options = {
            series: files_added_percentages,
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
                text: "Files added",
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
    getJiraProd() {
      axios
        .post(process.env.VUE_APP_JIRA_BASE_URL + "/jira/prod", {
          team_id: this.team_id,
          //team_project_id: this.team_project_id,
        })
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
                name: "Estimated story points",
                data: estimated,
              },
              {
                name: "Story points completed",
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
                  horizontal: false,
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
              title: {
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
              },
            },
          };
          this.team = bar_options;
        });
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