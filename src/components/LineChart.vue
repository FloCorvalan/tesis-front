<template>
  <ApexChart
    :height="height"
    width="100%"
    type="line"
    v-if="apexLoading"
    :options="options"
    :series="series"
  ></ApexChart>
</template>

<script>
import ApexChart from "vue-apexcharts";
export default {
  name: "LineChart",
  components: {
    ApexChart,
  },
  props: {
    options: [],
    series: [],
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
