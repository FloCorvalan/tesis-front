<template>
  <ApexChart
    height="100%"
    width="100%"
    type="bar"
    v-if="apexLoading"
    :options="options"
    :series="series"
  ></ApexChart>
</template>

<script>
import ApexChart from "vue-apexcharts";
export default {
  name: "BarChart",
  components: {
    ApexChart,
  },
  props: {
    options: [],
    series: [],
  },
  data: function () {
    return {
      apexLoading: false,
    };
  },
  created() {},
  mounted() {
    setTimeout(() => {
      this.apexLoading = true;
    });
  },
  methods: {},
};
</script>

<style>
</style>
