<template>
  <div>
    <NavBar></NavBar>
    <v-card class="card">
      <v-card-title
        ><div class="card-title">Equipo {{ team_name }}</div></v-card-title
      >
      <v-card-text>
        <div>
          <h3 class="disp-left">Desarrolladores/as</h3>
          <ul v-for="dev in developers" :key="dev.id">
            <li>
              <div class="item" v-on:click="changeVis(dev)">
                {{ dev.name }}
              </div>
            </li>
          </ul>
          <ul v-for="dev in developers" :key="dev.id">
            <li v-if="dev.vis == true">
              <div>
                <v-list>
                  <v-list-item class="list-item"
                    >Email: {{ dev.email }}</v-list-item
                  >
                  <v-list-item class="list-item"
                    >Nombre en Jira: {{ dev.jira }}</v-list-item
                  >
                  <v-list-item class="list-item"
                    >Nombre en Jenkins: {{ dev.jenkins }}</v-list-item
                  >
                  <v-list-item class="list-item"
                    >Nombre en GitHub: {{ dev.github }}</v-list-item
                  >
                </v-list>
              </div>
            </li>
          </ul>
          <div class="add-btn">
            <v-btn>Agregar desarrollador/a</v-btn>
          </div>
        </div>
        <div>
          <h3 class="disp-left">Proyectos</h3>
          <ul v-for="project in projects" :key="project.id">
            <li>
              <div class="item" v-on:click="changeVisProject(project)">
                {{ project.name }}
              </div>
            </li>
          </ul>
          <ul v-for="project in projects" :key="project.id">
            <li v-if="project.vis == true">
              <div>
                Fuentes de información
                <v-list>
                    <v-list-item class="list-item"
                    >Jenkins:</v-list-item>
                  <v-list-item class="list-item"
                    >
                    <div v-if="project.jenkins != undefined">
                      <v-list>
                        <v-list-item class="list-item">
                          Usuario: {{ project.jenkins.user }}
                        </v-list-item>
                        <v-list-item class="list-item">
                          Nombre del pipeline: {{ project.jenkins.name }}
                        </v-list-item>
                        <v-list-item class="list-item">
                          IP:puerto: {{ project.jenkins.ip_port }}
                        </v-list-item>
                      </v-list>
                    </div>
                    <div v-else>No existe</div>
                  </v-list-item>
                  <v-list-item class="list-item"
                    >GitHub:</v-list-item>
                  <v-list-item class="list-item"
                    >
                    <div v-if="project.github != undefined">
                      <v-list>
                        <v-list-item class="list-item">
                          Usuario: {{ project.github.user }}
                        </v-list-item>
                        <v-list-item class="list-item">
                          Nombre del repositorio: {{ project.github.name }}
                        </v-list-item>
                      </v-list>
                    </div>
                    <div v-else>No existe</div>
                    </v-list-item
                  >
                </v-list>
              </div>
              <div class="add-btn" v-if="project.jenkins == undefined || project.github == undefined">
            <v-btn>Agregar fuente de información</v-btn>
          </div>
            </li>
          </ul>
          <div class="add-btn">
            <v-btn>Agregar projecto</v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>


<script>
import NavBar from "@/components/NavBar.vue";
import axios from "axios";

export default {
  name: "TeamView",
  components: {
    NavBar,
  },
  data() {
    return {
      team_id: JSON.parse(localStorage.getItem("teamId")),
      team_name: JSON.parse(localStorage.getItem("teamName")),
      developers: [],
      sources: [],
      projects: [],
    };
  },
  created() {
    this.getDevelopers();
    this.getProjects();
  },
  methods: {
    changeVis(obj) {
      if (obj.vis == false) {
        obj.vis = true;
      } else {
        obj.vis = false;
      }
    },
    changeVisProject(project) {
      if (project.vis == false) {
        axios
          .get(
            process.env.VUE_APP_BASE_URL +
              "/source/by-team-project/" +
              project._id.$oid
          )
          .then((response) => {
            var jenkins = response.data.jenkins;
            if (jenkins != undefined) {
              jenkins.vis = false;
            }
            var github = response.data.github;
            if (github != undefined) {
              github.vis = false;
            }
            project.jenkins = jenkins;
            project.github = github;
            project.vis = true;
          });
      } else {
        project.vis = false;
      }
    },
    getDevelopers() {
      axios
        .get(
          process.env.VUE_APP_BASE_URL + "/developer/by-team/" + this.team_id
        )
        .then((response) => {
          //this.developers = response.data;
          response.data.forEach((element) => {
            element.vis = false;
            var e = element;
            this.developers.push(e);
          });
          console.log(this.developers);
        });
    },
    getProjects() {
      axios
        .get(
          process.env.VUE_APP_BASE_URL + "/team-project/by-team/" + this.team_id
        )
        .then((response) => {
          response.data.forEach((element) => {
            element.vis = false;
            element.jenkins = null;
            element.github = null;
            var e = element;
            this.projects.push(e);
          });
          console.log(this.projects);
        });
    },
    getDashboard(team) {
      var id = team._id.$oid.toString();
      this.$store.commit("saveTeamId", id);
      var name = team.name.toString();
      this.$store.commit("saveTeamName", name);
      console.log(id);
      console.log(name);
      this.$router.push("/dashboard");
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>


<style src="./Team.scss" lang="scss"/>