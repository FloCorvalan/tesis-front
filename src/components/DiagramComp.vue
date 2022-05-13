<template>
    <div v-html="temp"></div>
</template>
<script>
export default {
  name: "DiagramComp",
  props: {
    temp: String,
  },
  data() {
    return {};
  },
  created() {
    //this.getColors();
  },
  methods: {
    getColors() {
      var elements = this.$el.querySelectorAll("text");
      console.log(elements);
      elements.forEach((element) => {
        element.classList.add("color-class");
        console.log(element);
      });
    },
  },
}
</script>

<style>
svg {
  height: 100%;
  width: 100%;
}

.color-class {
  color: white;
}
</style>