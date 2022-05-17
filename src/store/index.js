import Vue from 'vue'
import Vuex from 'vuex'
import VueApexCharts from 'vue-apexcharts'

Vue.use(Vuex)
Vue.use(VueApexCharts)
Vue.component('vue-apexchart', VueApexCharts)

export default new Vuex.Store({
  state: {
    leaderId: null, 
    teamId: null, 
    teamName: null, 
    token: null, 
  },
  getters: {
  },
  mutations: {
    saveLeaderId (state, leaderId) {
      state.leaderId = leaderId;
      localStorage.setItem('leaderId', JSON.stringify(leaderId));
    },
    saveTeamId (state, teamId) {
      state.teamId = teamId;
      localStorage.setItem('teamId', JSON.stringify(teamId));
    },
    saveTeamName (state, teamName) {
      state.teamName = teamName;
      localStorage.setItem('teamName', JSON.stringify(teamName));
    },
    saveToken(state, token) {
      state.token = token;
      localStorage.setItem('token', JSON.stringify(token));
    },
  },
  actions: {
  },
  modules: {
  }
})
