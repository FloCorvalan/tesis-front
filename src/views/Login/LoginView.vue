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
                  <v-tab :href="`#tab-login`"> LOGIN </v-tab>
                  <v-tab :href="`#tab-newUser`"> CREAR CUENTA </v-tab>

                  <v-tab-item :value="'tab-login'">
                    <v-form>
                      <v-container>
                        <v-row>
                          <v-form>
                            <v-col class="padding-top">
                              <v-text-field
                                v-model="email"
                                :rules="emailRules"
                                value=""
                                label="Email Address"
                                required
                              ></v-text-field>
                              <v-text-field
                                v-model="password"
                                :rules="passRules"
                                type="password"
                                label="Password"
                                required
                              ></v-text-field>
                            </v-col>
                            <v-col class="d-flex justify-space-between">
                              <v-btn
                                class="text-capitalize"
                                large
                                :disabled="
                                  password.length === 0 || email.length === 0
                                "
                                color="primary"
                                @click="login"
                              >
                                Login</v-btn
                              >
                            </v-col>
                          </v-form>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-tab-item>

                  <v-tab-item :value="'tab-newUser'">
                    <v-form>
                      <v-container>
                        <v-row>
                          <v-form>
                            <v-col class="padding-top">
                              <v-text-field
                                v-model="createFullName"
                                label="Full Name"
                                required
                              ></v-text-field>
                              <v-text-field
                                v-model="createEmail"
                                :rules="emailRules"
                                label="Email Address"
                                required
                              ></v-text-field>
                              <v-text-field
                                v-model="createPassword"
                                :rules="passRules"
                                type="password"
                                label="Password"
                                hint="At least 6 characters"
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
                                @click="login"
                              >
                                Create your account</v-btn
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
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
      createFullName: "John Smith",
      createEmail: "john@flatlogic.com",
      createPassword: "123456",
      password: "",
      passRules: [
        (v) => !!v || "Password is required",
        (v) => v.length >= 6 || "Min 6 characters",
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
