<template>
  <ApexChart
    :height="height"
    :width="width2"
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
    length: Number,
  },
  data: function () {
    return {
      apexLoading: false,
      width2: null,
    };
  },
  created() {
    if(length != undefined){
      this.width2 = (32 * this.length).toString() + 'px'
    }
  },
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
