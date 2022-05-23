<template>
  <ApexChart
    :height="height2"
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
    length: Number,
    offset: Number,
    type: Number,
  },
  data: function () {
    return {
      apexLoading: false,
      height2: null,
    };
  },
  created() {
    if(this.length == undefined){
      this.height2 = this.height
    }
    else if(this.type == 1){
      this.height2 = (140 * this.length + 20 * this.offset).toString() + 'px'
    }
    else if(this.offset != undefined){
      this.height2 = (65 * this.length + 50 * this.offset).toString() + 'px'
    }
    else{
      console.log(this.length)
      this.height2= (40 * this.length).toString() + 'px'
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
