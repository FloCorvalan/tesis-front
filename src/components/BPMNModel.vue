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
    <div v-if="listo" class="add-btn-2">
      <v-btn class="add-btn-inner" v-on:click="selectIdealModel()"
        >Seleccionar como modelo ideal</v-btn
      >
    </div>
    <div
      class="disp-center"
      v-if="chart_jira != null && chart_jenkins != null && chart_github != null"
    >
      <v-row no-gutters>
        <h3 class="section-title-font-size-2">
          Cantidad de veces que fueron realizadas las actividades
        </h3>
      </v-row>
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
      <div v-if="chart_fitness != null">
        <v-row no-gutters>
          <h3 class="section-title-font-size-2">
            Nivel de cumplimiento de las instancias del proceso respecto al
            modelo ideal
          </h3>
        </v-row>
        <v-row no-gutters>
          <h3
            class="section-title-font-size-3"
            title="Porcentaje promedio del comportamiento observado en las instancias del proceso que se puede reproducir con el modelo de proceso ideal"
          >
            Promedio de nivel de cumplimiento: {{ chart_fitness.avg }}%<span
              class="question-mark"
              >&#63;</span
            >
          </h3>
        </v-row>
        <div class="jenkins-title" :title="chart_fitness.title">
          {{ chart_fitness.key }}<span class="question-mark">&#63;</span>
        </div>
        <BarChart
          :options="chart_fitness.options"
          :series="chart_fitness.series"
          :width="'50%'"
          :height="'100%'"
          :length="chart_fitness.options.xaxis.categories.length"
        >
        </BarChart>
      </div>
      <div v-if="chart_fitness != null">
        <div
          class="jenkins-title"
          title="Modelo de proceso generado mediante el sistema que fue seleccionado como el modelo ideal por el líder del proyecto"
        >
          Modelo de proceso ideal registrado<span class="question-mark"
            >&#63;</span
          >
        </div>
        <div >
          <panZoom>
            <p v-html="svgDiagramIdeal"></p>
          </panZoom>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// MODELO
import axios from "axios";
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
    leader_id: String,
  },
  data() {
    return {
      apexLoading: false,
      listo: false,
      svgDiagram: null,
      svgDiagramIdeal: null,
      chart_jira: null,
      chart_github: null,
      chart_jenkins: null,
      chart_fitness: null,
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
          this.getFitness();
          console.log(this.chart_jira);
        })
        .catch((error) => {
          console.log(error);
          this.$store.commit("saveAuthen", false);
          this.$store.commit("saveToken", null);
          this.$router.push("/login");
        });
    },
    getFitness() {
      var headers = {
        Authorization: `Bearer: ${this.token}`,
      };
      axios
        .post(
          process.env.VUE_APP_BASE_URL + "/process-model/get-fitness",
          {
            team_project_id: this.team_project_id,
            leader_id: this.leader_id,
          },
          { headers }
        )
        .then((r) => {
          console.log(r.data);
          if (r.data.status == true) {
            var traces = [];
            var values = [];
            for (var key in r.data.result) {
              traces.push(key);
              values.push(r.data.result[key]);
              console.log(r.data.result[key]);
            }
            var bar_options = {
              avg: r.data.avg,
              title:
                "Porcentaje del comportamiento observado en la instancia del proceso que se puede reproducir a través del modelo de proceso ideal",
              key: "Nivel de cumplimiento de cada instancia del proceso respecto al modelo de proceso ideal",
              series: [
                {
                  data: values,
                },
              ],
              options: {
                chart: {
                  type: "bar",
                  height: 350,
                  stackType: "100%",
                },
                plotOptions: {
                  bar: {
                    horizontal: true,
                    dataLabels: {
                      position: "top",
                    },
                    columnWidth: "35%",
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
                xaxis: {
                  categories: traces,
                  forceNiceScale: false,
                  max: 100,
                  labels: {
                    formatter: (value) => value.toFixed(0) + "%",
                  },
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
            this.chart_fitness = bar_options;
            this.getIdealModel();
          }
        })
        .catch((error) => {
          console.log(error);
          this.$store.commit("saveAuthen", false);
          this.$store.commit("saveToken", null);
          this.$router.push("/login");
        });
    },
    getIdealModel() {
      var headers = {
        Authorization: `Bearer: ${this.token}`,
      };
      axios
        .post(
          process.env.VUE_APP_BASE_URL + "/process-model/get-ideal-model",
          {
            leader_id: this.leader_id,
          },
          { headers }
        )
        .then((r) => {
          //console.log(r)
          this.svgDiagramIdeal = r.data;
        })
        .catch((error) => {
          console.log(error);
          this.$store.commit("saveAuthen", false);
          this.$store.commit("saveToken", null);
          this.$router.push("/login");
        });
    },
    selectIdealModel() {
      var message =
        "¿Está seguro de seleccionar este modelo de proceso como su modelo de proceso ideal?";
      if (window.confirm(message)) {
        var headers = {
          Authorization: `Bearer: ${this.token}`,
        };
        axios
          .post(
            process.env.VUE_APP_BASE_URL + "/process-model/save-ideal-model",
            {
              team_project_id: this.team_project_id,
              leader_id: this.leader_id,
            },
            { headers }
          )
          .then(() => {
            this.getFitness();
          })
          .catch((error) => {
            console.log(error);
            this.$store.commit("saveAuthen", false);
            this.$store.commit("saveToken", null);
            this.$router.push("/login");
          });
      }
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