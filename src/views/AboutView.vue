<template>
  <div class="about">
    <h1>This is an about page</h1>
    <img :src="image">
  </div>
</template>

<script>
import axios from "axios";
import {Buffer} from "buffer"

export default {
  name: "PruebaImagen",
  components: {},
  data: function () {
    return {
      image: null,
    };
  },
  created() {
    this.prueba()
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
    getTeamParticipation(){
      axios.get("http://127.0.0.1:5001/jenkins/team-participation").then((response) => {
        console.log(response.data[0].username);
      });
    }, 
    displayImage2(){
      axios.get("http://127.0.0.1:5001/process-model/get-last-image/6241fad36d714f635bafbc9f", {
      responseType: 'blob',
    }).then((response) => {
        console.log(response);
        //let res1 = response.data
        //let blob = new Blob ([res1], {
        //type: "image/png"
        //});
        console.log(typeof(response.data))
        var x = Buffer.from(response.data, 'binary')
        console.log(x)
        var y = x.toString('base64')
        console.log(y)
        this.image = "data:image/png;base64,".concat(y)
        //console.log(this.image)
      });
    },
    prueba(){
      axios.get("http://127.0.0.1:5001/process-model/get-last-image/6241fad36d714f635bafbc9f", {
      responseType: 'blob',
    }).then((response) => {
        var objectURL = URL.createObjectURL(response.data);
        this.image = objectURL;
      });
    }
  },
};
</script>

