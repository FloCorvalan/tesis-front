<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Agregar nuevo/a desarrollador/a</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Nombre*"
                  v-model="name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Email*"
                  v-model="email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Nombre en Jira*"
                  v-model="jira"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Nombre en Jenkins*"
                  v-model="jenkins"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Nombre en GitHub*"
                  v-model="github"
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
    email: null,
    jira: null,
    jenkins: null,
    github: null,
    token: JSON.parse(localStorage.getItem("token")),
  }),
  props: {
      team_id: String
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      var body = {
        name: this.name,
        email: this.email,
        jira: this.jira,
        jenkins: this.jenkins,
        github: this.github,
        team_id: this.team_id,
      };
      if (
        body != null &&
        body.name != null &&
        body.email != null &&
        body.jira != null &&
        body.jenkins != null &&
        body.github != null
      ) {
        var headers = {
        "Authorization": `Bearer: ${this.token}`
      };
        axios
          .post(process.env.VUE_APP_BASE_URL + "/developer/", body, {headers})
          .then((r) => {
            if(r.status == 200){
                this.$emit("close");
            }
          });
      }
    },
  },
};
</script>