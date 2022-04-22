<template>
<div>
  <v-card class="mx-1 mb-1">
    <v-card-title class="pa-6 pb-0">
      <v-row no-gutters>
        <p>Productividad individual</p>
      </v-row>
    </v-card-title>
    <v-card-text class="pa-6">
      <v-row class="overflow-hidden">
        <v-col class="overflow-hidden">
          <ul v-for="(developer, index) in developers" :key="index">
            <li>
              <div
                class="project-name"
                v-on:click="changeVisibleDev(developer)"
              >
                <h3>Productividad desarrollador/a {{ developer.name }}</h3>
              </div>
            </li>
          </ul>
          <ul v-for="(developer, index) in developers" :key="index">
            <li
              v-if="
                developer.visibleProd == true &&
                developer.bar_options.options.xaxis.categories != []
              "
            >
              <BarChart
                :options="developer.bar_options.options"
                :series="developer.bar_options.series"
              >
              </BarChart>
              <BarChart
                :options="developer.bar_options_loc.options"
                :series="developer.bar_options_loc.series"
              >
              </BarChart>
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card class="mx-1 mb-1">
    <v-card-title class="pa-6 pb-0">
      <v-row no-gutters>
        <p>Productividad grupal</p>
      </v-row>
    </v-card-title>
    <v-card-text class="pa-6">
      <v-row class="overflow-hidden">
        <v-col class="overflow-hidden">
            <div
              v-if="
                team.series[0].data != []
              "
            >
              <BarChart
                :options="team.options"
                :series="team.series"
              >
              </BarChart>
            </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</div>
</template>

<script>
import axios from "axios";
import BarChart from "@/components/BarChart.vue";

export default {
  name: "ProdChart",
  components: {
    BarChart,
  },
  props: {
    team_id: String,
    team_project_id: String,
  },
  data() {
    return {
      apexLoading: false,
      developers: [],
      team: null, 
    };
  },
  created() {
    this.getGithubProd();
    this.getJenkinsTeamProd();
  },
  methods: {
    changeVisibleDev(dev) {
      if (dev.visibleProd == false) {
        dev.visibleProd = true;
      } else {
        dev.visibleProd = false;
      }
    },
    getGithubProd() {
      axios
        .get(process.env.VUE_APP_GITHUB_BASE_URL + "/github/prod", {
          team_id: this.team_id,
          team_project_id: this.team_project_id,
        })
        .then((response) => {
          var developer = {
            name: null,
            visibleProd: false,
            bar_options: {
              series: [
                {
                  name: "Number of commits",
                  data: [],
                },
                {
                  name: "Successful builds",
                  data: [],
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
                  categories: [],
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
                  text: 'Number of commits and Successful builds / 2 weeks',
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
            },
            bar_options_loc: {
              series: [
                {
                  name: "Lines of code",
                  data: [],
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
                  categories: [],
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
                  text: 'Number of Lines of code / 2 weeks',
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
            },
          };
          var devList = [];
          response.data.forEach((element) => {
            developer.name = element.name;
            developer.bar_options.series[0].data = element.commits;
            developer.bar_options_loc.series[0].data = element.additions;
            developer.bar_options_loc.options.xaxis.categories = element.dates;
            developer.bar_options.options.xaxis.categories = element.dates;
            devList.push(developer);
          });
          this.developers = devList;
          this.getJenkinsIndProd();
        });
    },
    getDevIndex(developers, name) {
      var i = 0;
      while (i < developers.length) {
        if (developers[i].name == name) {
          return i;
        }
        i++;
      }
    },
    getJenkinsIndProd() {
      axios
        .get(
          process.env.VUE_APP_JENKINS_BASE_URL + "/jenkins/individual-prod",
          {
            team_id: this.team_id,
            team_project_id: this.team_project_id,
          }
        )
        .then((response) => {
          response.data.forEach((element) => {
            var index = this.getDevIndex(this.developers, element.name);
            this.developers[index].bar_options.series[1].data = element.success;
          });
        });
    },
    getJenkinsTeamProd() {
      axios
        .get(
          process.env.VUE_APP_JENKINS_BASE_URL + "/jenkins/team-prod",
          {
            team_id: this.team_id,
            team_project_id: this.team_project_id,
          }
        )
        .then((response) => {
            var bar_options =  {
              series: [
                {
                  name: "Story points completed",
                  data: [],
                },
                {
                  name: "Successful builds",
                  data: response.data.success,
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
                  categories: response.data.dates,
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
                  text: 'Story points and Successful builds / 2 weeks',
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
            this.team = bar_options
            this.getJiraProd();
            console.log(this.team)
        });
    },
    getJiraProd(){
        axios
        .get(
          process.env.VUE_APP_JIRA_BASE_URL + "/jira/prod",
          {
            team_id: this.team_id,
            team_project_id: this.team_project_id,
          }
        )
        .then((response) => {
            this.team.series[0].data = response.data.story_points
        });       
    },
  },
  mounted() {},
};
</script>