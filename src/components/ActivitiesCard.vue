<template>
  <v-col>
    <v-card>
      <v-card-title>
        {{ tool }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="8" class="disp-left"> Actividad </v-col>
          <v-col cols="4" class="disp-left">
            Cantidad de veces realizada
          </v-col>
        </v-row>
        <v-list v-for="(act, index) in activities" :key="index">
          <v-list-item>
            <v-row>
              <v-col cols="8">
                <div class="font-class-2 disp-left">
                  {{ act.activity }}
                </div>
              </v-col>
              <v-col cols="4">
                <div class="font-class-2 disp-left">
                  {{ act.count }}
                </div>
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
export default {
  props: {
    tool: String,
    activities: Array,
  },
  data() {
    return {};
  },
  methods() {},
};
</script>