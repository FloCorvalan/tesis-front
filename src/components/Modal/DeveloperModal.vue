<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Agregar desarrollador/a</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-select
                  :items="developers"
                  label="Desarrollador/a*"
                  v-model="devSelected"
                  :item-text="'name'"
                  :item-value="'_id'"
                  required
                ></v-select>
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
  name: "DeveloperModal",
  data: () => ({
    dialog: true,
    developers: [],
    devSelected: null,
    token: JSON.parse(localStorage.getItem("token")),
  }),
  props: {
    team_id: String,
  },
  created(){
    this.getDevelopers();
  },
  methods: {
    getDevelopers() {
      var headers = {
        "Authorization": `Bearer: ${this.token}`
      };
      axios.get(process.env.VUE_APP_BASE_URL + "/developer/", {}, {headers}).then((r) => {
        this.developers = r.data
      });
    },
    close() {
      this.$emit("close");
    },
    save() {
      console.log(this.devSelected)
      var body = {
        dev_id: this.devSelected.$oid,
        team_id: this.team_id,
      };
      if (body != null && body.dev_id != null) {
        var headers = {
        "Authorization": `Bearer: ${this.token}`
      };
        axios
          .post(process.env.VUE_APP_BASE_URL + "/team/add-dev", body, {headers})
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