<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Agregar fuente de información Jira</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Email del dueño del proyecto*"
                  v-model="user"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Token*"
                  v-model="token"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Key del proyecto*"
                  v-model="name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="URL del dueño del proyecto*"
                  v-model="ip_port"
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
  name: "JiraSourceModal",
  data: () => ({
    dialog: true,
    name: null,
    user: null, 
    token: null, 
    ip_port: null, 
    authtoken: JSON.parse(localStorage.getItem("token")),
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
        user: this.user,
        token: this.token,
        ip_port: this.ip_port,
        type: 'jira',
        team_id: this.team_id
      };
      if (
        body != null &&
        body.name != null &&
        body.user != null &&
        body.token != null &&
        body.ip_port != null
      ) {
        var headers = {
        "Authorization": `Bearer: ${this.authtoken}`
      };
        axios
          .post(process.env.VUE_APP_BASE_URL + "/source/", body, {headers})
          .then((r) => {
            if(r.status == 200){
                this.$emit("close");
            }
          }).catch((error) => {
          console.log(error)
          this.$store.commit("saveAuthen", false);
          this.$store.commit("saveToken", null);
          this.$router.push("/login");
        }
        );
      }
    },
  },
};
</script>