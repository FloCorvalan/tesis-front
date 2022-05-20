<template>
  <ApexChart
    :height="height"
    :width="width"
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
    width: String,
    height: String,
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
