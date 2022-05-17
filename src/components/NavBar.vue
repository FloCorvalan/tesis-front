<template>
  <div>
    <v-app-bar color="#023047">
      <v-app-bar-nav-icon @click="drawer = true" color="#FFFFFF"></v-app-bar-nav-icon>

      <v-toolbar-title class="title">Toad System</v-toolbar-title>
      <v-spacer></v-spacer>
      <!--v-btn class="mr-2" color="#023047"><v-icon color="#FFFFFF">mdi-account</v-icon></v-btn-->
      <v-btn class="mr-2" color="#023047" @click="logOut()"><p style="color:#FFFFFF">Log Out</p></v-btn>
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

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
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
}
</style>>
