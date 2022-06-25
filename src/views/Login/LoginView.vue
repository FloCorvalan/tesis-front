<template>
  <v-app>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="7" class="main-part d-none d-md-none d-lg-flex">
          <div class="d-flex">
            <!--v-img src="@/assets/logo.svg" contain></v-img-->
            <h1>Toad System</h1>
            <h5>
              Sistema de monitoreo para procesos de desarrollo de software donde
              se usan prácticas de despliegue continuo
            </h5>
          </div>
        </v-col>
        <v-col
          cols="12"
          lg="5"
          class="login-part d-flex align-center justify-center"
        >
          <v-row no-gutters class="align-start">
            <v-col
              cols="12"
              class="login-part d-flex align-center justify-center flex-column"
            >
              <div class="login-wrapper pt-md-4 pt-0">
                <v-tabs grow>
                  <v-tabs-slider></v-tabs-slider>
                  <v-tab href="#tab-login"> LOGIN </v-tab>
                  <v-tab href="#tab-newUser"> CREAR CUENTA </v-tab>

                  <v-tab-item value="tab-login">
                    <v-form>
                      <v-container>
                        <v-row>
                          <v-form>
                            <v-col class="padding-top">
                              <v-text-field
                                v-model="email"
                                :rules="emailRules"
                                value=""
                                label="Email"
                                required
                              ></v-text-field>
                              <v-text-field
                                v-model="password"
                                :rules="passRulesLogin"
                                type="password"
                                label="Contraseña"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col class="d-flex justify-space-between">
                              <v-btn
                                large
                                :disabled="
                                  password.length === 0 || email.length === 0
                                "
                                color="primary"
                                @click="login"
                              >
                                Iniciar sesión</v-btn
                              >
                            </v-col>
                          </v-form>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-tab-item>

                  <v-tab-item value="tab-newUser">
                    <v-form>
                      <v-container>
                        <v-row>
                          <v-form>
                            <v-col class="padding-top">
                              <v-text-field
                                v-model="createFullName"
                                :rules="usernameRules"
                                label="Nombre de usuario"
                                required
                              ></v-text-field>
                              <v-text-field
                                v-model="createEmail"
                                :rules="emailRules"
                                label="Email"
                                required
                              ></v-text-field>
                              <v-text-field
                                v-model="createPassword"
                                :rules="passRules"
                                type="password"
                                label="Contraseña"
                                hint="Al menos 6 caracteres"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col class="d-flex justify-space-between">
                              <v-btn
                                large
                                block
                                :disabled="
                                  createFullName.length === 0 ||
                                  createEmail.length === 0 ||
                                  createPassword === 0
                                "
                                color="primary"
                                @click="signup"
                              >
                                Crea tu cuenta</v-btn
                              >
                            </v-col>
                          </v-form>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-tab-item>
                </v-tabs>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      emailRules: [
        (v) => !!v || "Se requiere un email",
        (v) => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "El email debe ser válido",
      ],
      createFullName: "",
      createEmail: "",
      createPassword: "",
      password: "",
      passRules: [
        (v) => !!v || "Se requiere una contraseña",
        (v) => v.length >= 6 || "Mínimo 6 caracteres",
      ],
      passRulesLogin: [
        (v) => !!v || "Se requiere contraseña"
      ],
      usernameRules: [
        (v) => !!v || "Se requiere un nombre de usuario"
      ],
    };
  },
  methods: {
    login() {
      var user = {
        email: this.email,
        password: this.password,
      };
      axios
        .post(process.env.VUE_APP_BASE_URL + "/login", user)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.$store.commit("saveToken", response.data.token);
            this.$store.commit("saveLeaderId", response.data._id);
            this.$store.commit("saveAuthen", true);
            this.$router.push("/leader");
          }
        });
    },
    signup(){
      var user = {
        username: this.createFullName,
        type: 'leader',
        password: this.createPassword,
        email: this.createEmail
      }
      if(user.username != "" && user.password != "" && user.email != ""){
        axios
        .post(process.env.VUE_APP_BASE_URL + "/signup", user)
        .then((response) => {
          console.log(response);
          if (response.status == 200) {
            this.$store.commit("saveToken", response.data.token);
            this.$store.commit("saveLeaderId", response.data._id);
            this.$store.commit("saveAuthen", true);
            this.$router.push("/leader");
          }
        });
      }
    }
  },
  created() {
    console.log(JSON.parse(localStorage.getItem("authenticated")));
    if (
      JSON.parse(localStorage.getItem("authenticated")) == true
    ) {
      this.$router.push("/leader");
    }
    //if (window.localStorage.getItem('authenticated') === 'true') {
    //  this.$router.push('/dashboard');
    //}
  },
};
</script>

<style src="./Login.scss" lang="scss"/>
