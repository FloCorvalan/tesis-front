<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Agregar equipo de desarrollo</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Nombre del equipo*"
                  v-model="name"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close()"> Cancelar </v-btn>
          <v-btn color="blue darken-1" text @click="save()"> Guardar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  name: "TeamModal",
  data: () => ({
    dialog: true,
    name: null,
    token: JSON.parse(localStorage.getItem("token")),
  }),
  props: {
      leader_id: String
  },
  methods: {
    close() {
      this.$emit("close");
    },
    save() {
      var body = {
        name: this.name,
        leader: this.leader_id
      };
      if (
        body != null &&
        body.name != null
      ) {
        var headers = {
        "Authorization": `Bearer: ${this.token}`
      };
        axios
          .post(process.env.VUE_APP_BASE_URL + "/team/", body, {headers})
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