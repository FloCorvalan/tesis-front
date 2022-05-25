<template>
  <div>
    <v-app-bar class="navbar-color">
      <v-app-bar-nav-icon @click="drawer = true" color="#FFFFFF"></v-app-bar-nav-icon>

      <v-toolbar-title class="title">Toad System</v-toolbar-title>
      <v-spacer></v-spacer>
      <!--v-btn class="mr-2" color="#023047"><v-icon color="#FFFFFF">mdi-account</v-icon></v-btn-->
      <v-btn class="mr-2" color="#1c2e86" @click="logOut()"><p style="color:#FFFFFF;font-family: 'Fira Sans Condensed';font-weight:bold">Log Out</p></v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item @click="goLeader()">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <!--v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-->
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
export default {
  name: "NavBar",
  components: {},
  props: {},
  data: function () {
    return {
      drawer: false,
      group: null,
    };
  },
  created() {},
  mounted() {},
  methods: {
    goLeader(){
      this.$router.push('/leader')
    },
    logOut(){
      this.$store.commit("saveAuthen", false);
      this.$store.commit("saveToken", null);
      this.$router.push("/login");
    }
  },
};
</script>

<style>
.title {
    color: white;
    font-weight: bold;
    font-family: 'Fira Sans Condensed';
}

.navbar-color {
  background: rgb(28,46,134);
  background: linear-gradient(124deg, rgba(28,46,134,1) 29%, rgba(45,144,255,1) 74%, rgba(14,203,255,1) 100%);
}
</style>>
