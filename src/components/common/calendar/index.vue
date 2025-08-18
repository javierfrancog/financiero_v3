<template>
  <div>
    <v-sheet height="50">
      <v-toolbar flat>
        <v-btn
          depressed
          class="white--text px-12"
          color="indigo darken-2"
          @click="setToday"
        >
          Hoy
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="prev">
          <v-icon small> mdi-chevron-left </v-icon>
        </v-btn>
        <v-btn fab text small color="grey darken-2" @click="next">
          <v-icon small> mdi-chevron-right </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              class="white--text px-12"
              color="indigo darken-2"
              v-bind="attrs"
              v-on="on"
            >
              <span>{{ typeToLabel[type] }}</span>
              <v-icon right> mdi-menu-down </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              @click="
                setView();
                type = 'day';
              "
            >
              <v-list-item-title>Dia</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="
                setView();
                type = 'week';
              "
            >
              <v-list-item-title>Semana</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="
                setView();
                type = 'month';
              "
            >
              <v-list-item-title>Mes</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-sheet>

    <v-calendar
      ref="calendar"
      v-model="focus"
      color="primary"
      :events="events"
      :event-color="getEventColor"
      :type="type"
      :event-ripple="false"
      :interval-height="intervalheight"
      :interval-width="60"
      :short-intervals="false"
      :first-interval="firstInterval"
      @click:event="showEvent"
      @click:more="viewDay"
      @click:date="viewDay"
      @change="updateRange"
      @mouseleave.native="cancelDrag"
      @mousedown:event="startDrag"
      @mouseup:time="endDrag"
    ></v-calendar>
  </div>
</template>

<script>
export default {
  props: {
    dataEvents: Array,
  },
  data: () => ({
    events: [],
    focus: null,
    type: "day",
    typeToLabel: {
      month: "Dia",
      week: "Semana",
      day: "Dia",
      "4dia": "4 Dias",
    },
    dragEvent: null,
    dragTime: null,
    createStart: null,
    createEvent: null,
    extendOriginal: null,
  }),
  mounted() {
    this.$refs.calendar.checkChange();
  },
  computed: {
    firstInterval() {
      if (!this.events || !this.events.length) return 0;
      return this.events[0].hora_inicio - 1;
    },
    intervalheight() {
      if (!this.events || !this.events.length) return 0;
      return this.events[0].intervalo;
    },
  },
  watch: {
    dataEvents(val) {
      this.events = JSON.parse(JSON.stringify(val));
    },

    // dataEvents: {
    //   handler(val) {
    //     console.log("data calendar: ", val);
    //     // this.events = JSON.parse(JSON.stringify(val));
    //   },
    //   deep: true,
    // },
  },
  methods: {
    setView() {
      // console.log("setView");
      // this.$emit("cargarAgendamiento", this.focus);
    },
    getEventColor(event) {
      return event.color;
    },
    showEvent(data) {
      const { event } = data;
      // console.log("show event", data);
      this.$emit("openDialog", data);
    },
    viewDay(data) {
      // console.log("data: ", data)
      this.focus = data.date;
      this.type = "day";
    },
    setToday() {
      this.focus = "";
    },
    updateRange(data) {
      // console.log("data update: ", data);
      this.$emit("cargarAgendamiento", data);
    },
    buscar_agenda() {},

    addEvent(tms) {
      // console.log("addEvent ", tms);
     this.$emit("openDialog", tms);
    },

    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },

    cancelDrag() {
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal;
        } else {
          const i = this.events.indexOf(this.createEvent);
          if (i !== -1) {
            this.events.splice(i, 1);
          }
        }
      }

      this.createEvent = null;
      this.createStart = null;
      this.dragTime = null;
      this.dragEvent = null;
    },
    startDrag({ event, timed }) {
      if (event && timed) {
        this.dragEvent = event;
        this.dragTime = null;
        this.extendOriginal = null;
      }
    },
    endDrag() {
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
    },
  },
};
</script>
