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
          <li class="item" v-on:click="getTeamView(team)">
            {{ team.name }}
          </li>
        </ul>
      </v-card-text>
      <div class="add-btn">
        <v-btn v-on:click="showTeamModal()">Agregar equipo de desarrollo</v-btn>
        <v-app v-if="modalTeamVis">
          <TeamModal
            v-show="modalTeamVis"
            :leader_id="leader_id"
            @close="closeTeamModal"
          />
        </v-app>
      </div>
    </v-card>
  </div>
</template>


<script>
import NavBar from "@/components/NavBar.vue";
import TeamModal from "@/components/Modal/TeamModal.vue";
import axios from "axios";

export default {
  name: "LeaderView",
  components: {
    NavBar,
    TeamModal,
  },
  data() {
    return {
      leader_id: "62423e9a47d19f4bd43b9c21",
      teams: [],
      modalTeamVis: false,
      //
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
    showTeamModal() {
      this.modalTeamVis = true;
    },
    closeTeamModal() {
      this.modalTeamVis = false;
      this.getTeams();
    },
    getTeams() {
      var data = { leader_id: this.leader_id };
      var headers = {
        "Content-Type": "application/json",
      };
      axios
        .post(process.env.VUE_APP_BASE_URL + "/team/by-leader", data, headers)
        .then((response) => {
          this.teams = response.data;
          console.log(this.teams);
        });
    },
    getTeamView(team) {
      var id = team._id.$oid.toString();
      this.$store.commit("saveTeamId", id);
      var name = team.name.toString();
      this.$store.commit("saveTeamName", name);
      console.log(id);
      console.log(name);
      this.$router.push("/team");
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