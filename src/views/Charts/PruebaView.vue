<template>
  <div>
    <PruebaChart />
  </div>
</template>

<script>
import PruebaChart from "@/components/PruebaChart.vue";

export default {
  components: {
      PruebaChart
  },
  data: function () {
    return {
      image: null,
      diagram: null,
      viewer: null,
    };
  },
};
</script>
