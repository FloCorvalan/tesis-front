<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Agregar proyecto</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Nombre del proyecto*"
                  v-model="name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="TAG (para asociar con Jira)*"
                  v-model="tag"
                  required
                ></v-text-field>
              </v-col>
              <v-col>
                <h3>Fuente de información Jenkins</h3>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Nombre de usuario*"
                  v-model="jenkins_user"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Token*"
                  v-model="jenkins_token"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Nombre del pipeline*"
                  v-model="jenkins_name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="IP : puerto*"
                  v-model="jenkins_ip_port"
                  required
                ></v-text-field>
              </v-col>
              <v-col>
                <h3>Fuente de información GitHub</h3>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Nombre del repositorio*"
                  v-model="github_name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Nombre de usuario del dueño del repositorio*"
                  v-model="github_user"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Token*"
                  v-model="github_token"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close()"> Close </v-btn>
          <v-btn color="blue darken-1" text @click="save()"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  name: "DeveloperModalNew",
  data: () => ({
    dialog: true,
    name: null,
    tag: null,
    jenkins_user: null,
    jenkins_name: null,
    jenkins_token: null,
    jenkins_ip_port: null,
    github_name: null,
    github_user: null,
    github_token: null,
    token: JSON.parse(localStorage.getItem("token")),
  }),
  props: {
    team_id: String,
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      var body = {
        name: this.name,
        tag: this.tag,
        jenkins_user: this.jenkins_user,
        jenkins_name: this.jenkins_name,
        jenkins_token: this.jenkins_token,
        jenkins_ip_port: this.jenkins_ip_port,
        github_name: this.github_name,
        github_user: this.github_user,
        github_token: this.github_token,
        team_id: this.team_id,
      };
      if (
        body != null &&
        body.name != null &&
        body.tag != null &&
        body.jenkins_user != null &&
        body.jenkins_name != null &&
        body.jenkins_token != null &&
        body.jenkins_ip_port != null &&
        body.github_name != null &&
        body.github_user != null &&
        body.github_token != null
      ) {
        var headers = {
        "Authorization": `Bearer: ${this.authtoken}`
      };
        axios
          .post(process.env.VUE_APP_BASE_URL + "/team-project/add", body, {headers})
          .then((r) => {
            if (r.status == 200) {
              this.$emit("close");
            }
          });
      }
    },
  },
};
</script>