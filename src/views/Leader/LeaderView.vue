<template>
  <div>
    <NavBar></NavBar>
    <v-card class="card">
      <v-card-title
        ><div class="card-title">
          Equipos de desarrollo a cargo
        </div></v-card-title
      >
      <v-card-text>
        <ul v-for="team in teams" :key="team">
          <li class="item" v-on:click="getDashboard(team._id)">
            {{ team.name }}
          </li>
        </ul>
      </v-card-text>
      <div class="add-btn">
        <v-btn>Agregar equipo de desarrollo</v-btn>
      </div>
    </v-card>
    <v-card class="card">
      <v-card-text>
        <div>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="name"
              :counter="10"
              :rules="nameRules"
              label="Name"
              required
            ></v-text-field>

            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>

            <v-select
              v-model="select"
              :items="items"
              :rules="[(v) => !!v || 'Item is required']"
              label="Item"
              required
            ></v-select>

            <v-checkbox
              v-model="checkbox"
              :rules="[(v) => !!v || 'You must agree to continue!']"
              label="Do you agree?"
              required
            ></v-checkbox>

            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="validate"
            >
              Validate
            </v-btn>

            <v-btn color="error" class="mr-4" @click="reset">
              Reset Form
            </v-btn>

            <v-btn color="warning" @click="resetValidation">
              Reset Validation
            </v-btn>
          </v-form>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>


<script>
import NavBar from "@/components/NavBar.vue";
import axios from "axios";

export default {
  name: "LeaderView",
  components: {
    NavBar,
  },
  data() {
    return {
      leader_id: "62423e9a47d19f4bd43b9c21",
      teams: [],
      valid: true,
      name: "",
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v && v.length <= 10) || "Name must be less than 10 characters",
      ],
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      select: null,
      items: ["Item 1", "Item 2", "Item 3", "Item 4"],
      checkbox: false,
    };
  },
  created() {
    this.getTeams();
  },
  methods: {
    getTeams() {
      var data = { leader_id: this.leader_id };
      var headers = {
        "Content-Type": "application/json",
      };
      axios
        .post(process.env.VUE_APP_BASE_URL + "/team/by-leader", data, headers)
        .then((response) => {
          this.teams = response.data;
        });
    },
    getDashboard(oid) {
      var id = oid.$oid.toString();
      console.log(id);
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


<style src="./Leader.scss" lang="scss"/>