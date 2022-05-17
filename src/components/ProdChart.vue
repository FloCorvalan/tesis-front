<template>
  <div>
    <v-card class="mx-1 mb-1">
      <v-card-text class="pa-6">
        <v-row class="overflow-hidden">
          <v-col class="overflow-hidden">
            <LineChart
              :height="'200%'"
              :options="developers.line_options.options"
              :series="developers.line_options.series"
            >
            </LineChart>
            <LineChart
              :height="'100%'"
              :options="developers.line_options_loc.options"
              :series="developers.line_options_loc.series"
            >
            </LineChart>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import LineChart from "@/components/LineChart.vue";

export default {
  name: "ProdChart",
  components: {
    LineChart,
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
      token: JSON.parse(localStorage.getItem("token")),
    };
  },
  created() {
    this.getGithubProd();
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
      var headers = {
        "Authorization": `Bearer: ${this.token}`
      };
      axios
        .post(process.env.VUE_APP_BASE_URL + "/prod/github", {
          team_id: this.team_id,
          team_project_id: this.team_project_id,
        }, {headers})
        .then((response) => {
          var developers = {
            line_options: {
              series: [],
              options: {
                chart: {
                  height: 350,
                  type: "line",
                  zoom: {
                    enabled: false,
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  curve: "straight",
                },
                title: {
                  text: "Commits / 2 weeks",
                  align: "left",
                },
                grid: {
                  row: {
                    colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                    opacity: 0.5,
                  },
                },
                xaxis: {
                  categories: response.data[0].dates,
                },
              },
            },
            line_options_loc: {
              series: [],
              options: {
                chart: {
                  height: 350,
                  type: "line",
                  zoom: {
                    enabled: false,
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  curve: "straight",
                },
                title: {
                  text: "Lines of code / 2 weeks",
                  align: "left",
                },
                grid: {
                  row: {
                    colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                    opacity: 0.5,
                  },
                },
                xaxis: {
                  categories: response.data[0].dates,
                },
              },
            },
          };
          var series = {
            name: null,
            data: null,
          };
          response.data.forEach((element) => {
            series.name = element.name;
            series.data = element.commits;
            developers.line_options.series.push(series);
            series = {
              name: null,
              data: null,
            };
          });
          response.data.forEach((element) => {
            series.name = element.name;
            series.data = element.additions;
            developers.line_options_loc.series.push(series);
            series = {
              name: null,
              data: null,
            };
          });
          this.developers = developers;
        }).catch((error) => {
          console.log(error)
          this.$store.commit("saveAuthen", false);
          this.$store.commit("saveToken", null);
          this.$router.push("/login");
        }
        );
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
    getJiraProd() {
      var headers = {
        "Authorization": `Bearer: ${this.token}`
      };
      axios
        .get(process.env.VUE_APP_JIRA_BASE_URL + "/jira/prod", {
          team_id: this.team_id,
          team_project_id: this.team_project_id,
        }, {headers})
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
  mounted() {},
};
</script>