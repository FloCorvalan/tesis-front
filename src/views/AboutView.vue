<template>
  <div class="about">
    <h1>This is an about page</h1>
    <img :src="image">
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PruebaImagen",
  components: {},
  data: function () {
    return {
      image: null,
    };
  },
  created() {
    this.displayImage()
  },
  methods: {
    displayImage() {
      axios.get("http://localhost:8081/prueba/image/").then((response) => {
        console.log(response);
        try {
          this.image =
            "data:image/jpeg;base64," +
            btoa(
              new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
        } catch (err) {
          console.log(err);
        }
      });
    },
  },
};
</script>

