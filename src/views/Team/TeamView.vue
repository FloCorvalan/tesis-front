<template>
  <div>
    <NavBar></NavBar>
    <div class="card">
    <v-card>
      <v-card-title
        ><div class="card-title">Nombre de equipo: {{ team_name }}</div>
        <v-spacer></v-spacer>
        <div
          v-if="developers.length != 0 && projects.length != 0 && jira != null"
        >
          <v-btn class="dash-btn" v-on:click="getDashboard()"
            >Ver dashboard</v-btn
          >
        </div>
        <div v-else>
          <v-btn class="dash-btn" disabled>Ver dashboard</v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <div>
          <h3 class="disp-left">Desarrolladores/as</h3>
          <ul class="ul" v-for="dev in developers" :key="dev.id">
            <li>
              <div class="item" v-on:click="changeVis(dev)">
                {{ dev.name }}
              </div>
            </li>
          </ul>
          <ul class="ul" v-for="dev in developers" :key="dev.id">
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
            <v-btn v-on:click="showDevModal()">Agregar desarrollador/a</v-btn>
            <v-app v-if="modalDevVis">
              <DeveloperModal v-show="modalDevVis" :team_id="team_id" @close="closeDevModal" />
            </v-app>
            <v-btn v-on:click="showDevNewModal()">Agregar nuevo/a desarrollador/a</v-btn>
            <v-app v-if="modalDevNewVis">
              <DeveloperModalNew v-show="modalDevNewVis" :team_id="team_id" @close="closeDevNewModal" />
            </v-app>
          </div>
        </div>
        <div>
          <h3 class="disp-left">Proyectos</h3>
          <ul class="ul" v-for="project in projects" :key="project.id">
            <li>
              <div class="item" v-on:click="changeVisProject(project)">
                {{ project.name }}
              </div>
            </li>
          </ul>
          <ul class="ul" v-for="project in projects" :key="project.id">
            <li v-if="project.vis == true">
              <div>
                Fuentes de información
                <v-list>
                  <v-list-item class="list-item">Jenkins:</v-list-item>
                  <v-list-item class="list-item">
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
                  <v-list-item class="list-item">GitHub:</v-list-item>
                  <v-list-item class="list-item">
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
                  </v-list-item>
                </v-list>
              </div>
              <div>
                <v-list-item class="list-item">
                  TAG (para asociar con Jira): {{ project.tag }}
                </v-list-item>
              </div>
            </li>
          </ul>
          <div class="add-btn">
            <v-btn v-on:click="showProjectModal()">Agregar projecto</v-btn>
            <v-app v-if="modalProjectVis">
              <ProjectModal v-show="modalProjectVis" :team_id="team_id" @close="closeProjectModal" />
            </v-app>
          </div>
        </div>
        <div>
          <h3 class="disp-left">Fuente de información Jira</h3>
          <div v-if="jira != null">
            <v-list>
              <v-list-item class="list-item"
                >Usuario: {{ jira.user }}</v-list-item
              >
              <v-list-item class="list-item"
                >Key del proyecto: {{ jira.name }}</v-list-item
              >
              <v-list-item class="list-item"
                >URL: {{ jira.ip_port }}</v-list-item
              >
            </v-list>
          </div>
          <div v-else>
            <v-list-item class="list-item">No existe</v-list-item>
          </div>
          <div class="add-btn" v-if="jira == null">
            <v-btn v-on:click="showJiraModal()">Agregar fuente de información Jira</v-btn>
            <v-app v-if="modalJiraVis">
              <JiraSourceModal v-show="modalJiraVis" :team_id="team_id" @close="closeJiraModal" />
            </v-app>
          </div>
        </div>
      </v-card-text>
    </v-card>
    </div>
  </div>
</template>


<script>
import NavBar from "@/components/NavBar.vue";
import DeveloperModal from "@/components/Modal/DeveloperModal.vue";
import DeveloperModalNew from "@/components/Modal/DeveloperModalNew.vue";
import ProjectModal from "@/components/Modal/ProjectModal.vue";
import JiraSourceModal from "@/components/Modal/JiraSourceModal.vue";
import axios from "axios";

export default {
  name: "TeamView",
  components: {
    NavBar,
    DeveloperModal,
    DeveloperModalNew,
    ProjectModal,
    JiraSourceModal, 
  },
  data() {
    return {
      token: JSON.parse(localStorage.getItem("token")),
      team_id: JSON.parse(localStorage.getItem("teamId")),
      team_name: JSON.parse(localStorage.getItem("teamName")),
      developers: [],
      jira: null,
      projects: [],
      modalDevNewVis: false,
      modalDevVis: false,
      modalProjectVis: false, 
      modalJiraVis: false,
    };
  },
  created() {
    this.getDevelopers();
    this.getProjects();
    this.getJira();
  },
  methods: {
    showDevNewModal() {
      this.modalDevNewVis = true;
    },
    closeDevNewModal() {
      this.modalDevNewVis = false;
      this.getDevelopers();
    },
    showDevModal() {
      this.modalDevVis = true;
    },
    closeDevModal() {
      this.modalDevVis = false;
      this.getDevelopers();
    },
    showProjectModal() {
      this.modalProjectVis = true;
    },
    closeProjectModal() {
      this.modalProjectVis = false;
      this.getProjects();
    },
    showJiraModal() {
      this.modalJiraVis = true;
    },
    closeJiraModal() {
      this.modalJiraVis = false;
      this.getJira();
    },
    changeVis(obj) {
      if (obj.vis == false) {
        obj.vis = true;
      } else {
        obj.vis = false;
      }
    },
    changeVisProject(project) {
      if (project.vis == false) {
        var headers = {
        "Authorization": `Bearer: ${this.token}`
      };
        axios
          .get(
            process.env.VUE_APP_BASE_URL +
              "/source/by-team-project/" +
              project._id.$oid, {headers}
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
          }).catch((error) => {
          console.log(error)
          this.$store.commit("saveAuthen", false);
          this.$store.commit("saveToken", null);
          this.$router.push("/login");
        }
        );
      } else {
        project.vis = false;
      }
    },
    getDevelopers() {
      var headers = {
        "Authorization": `Bearer: ${this.token}`
      };
      axios
        .get(
          process.env.VUE_APP_BASE_URL + "/developer/by-team/" + this.team_id, {headers}
        )
        .then((response) => {
          //this.developers = response.data;
          this.developers = [];
          response.data.forEach((element) => {
            element.vis = false;
            var e = element;
            this.developers.push(e);
          });
          console.log(this.developers);
        }).catch((error) => {
          console.log(error)
          this.$store.commit("saveAuthen", false);
          this.$store.commit("saveToken", null);
          this.$router.push("/login");
        }
        );
    },
    getProjects() {
      var headers = {
        "Authorization": `Bearer: ${this.token}`
      };
      axios
        .get(
          process.env.VUE_APP_BASE_URL + "/team-project/by-team/" + this.team_id, {headers}
        )
        .then((response) => {
          response.data.forEach((element) => {
            element.vis = false;
            element.jenkins = null;
            element.github = null;
            var e = element;
            this.projects.push(e);
          });
        }).catch((error) => {
          console.log(error)
          this.$store.commit("saveAuthen", false);
          this.$store.commit("saveToken", null);
          this.$router.push("/login");
        }
        );
    },
    getJira() {
      var headers = {
        "Authorization": `Bearer: ${this.token}`
      };
      axios
        .get(process.env.VUE_APP_BASE_URL + "/source/get-jira/" + this.team_id, {headers})
        .then((response) => {
          this.jira = response.data;
        }).catch((error) => {
          console.log(error)
          this.$store.commit("saveAuthen", false);
          this.$store.commit("saveToken", null);
          this.$router.push("/login");
        }
        );
    },
    getDashboard() {
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