<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="auto"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        v-bind="props"
        :value="displayValue"
        :placeholder="placeholder"
        readonly
        variant="outlined"
        density="comfortable"
        color="primary"
        prepend-inner-icon="mdi-calendar"
        class="rounded-lg"
      ></v-text-field>
    </template>
    
    <v-card>
      <v-card-text class="pa-4">
        <div class="d-flex justify-space-between align-center mb-3">
          <v-btn
            icon
            size="small"
            variant="text"
            @click="previousYear"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <h3 class="text-h6 font-weight-medium">{{ currentYear }}</h3>
          <v-btn
            icon
            size="small" 
            variant="text"
            @click="nextYear"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>

        <v-container class="pa-0">
          <v-row no-gutters>
            <v-col
              v-for="(month, index) in months"
              :key="index"
              cols="4"
              class="pa-1"
            >
              <v-btn
                :color="isSelectedMonth(index) ? 'primary' : ''"
                :variant="isSelectedMonth(index) ? 'flat' : 'text'"
                class="w-100"
                size="small"
                @click="selectMonth(index)"
              >
                {{ month }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'AppDatePicker',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Seleccionar fecha'
    },
    minimumView: {
      type: String,
      default: 'month'
    },
    maximumView: {
      type: String,
      default: 'month'
    }
  },
  emits: ['update:modelValue', 'changed-month'],
  data() {
    return {
      menu: false,
      currentYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth(),
      months: [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
      ]
    }
  },
  computed: {
    displayValue() {
      if (this.modelValue) {
        const [year, month] = this.modelValue.split('-');
        const monthIndex = parseInt(month) - 1;
        return `${this.months[monthIndex]} ${year}`;
      }
      return '';
    }
  },
  watch: {
    modelValue: {
      handler(newValue) {
        if (newValue) {
          const [year, month] = newValue.split('-');
          this.currentYear = parseInt(year);
          this.selectedMonth = parseInt(month) - 1;
        }
      },
      immediate: true
    }
  },
  methods: {
    previousYear() {
      this.currentYear--;
    },
    nextYear() {
      this.currentYear++;
    },
    isSelectedMonth(monthIndex) {
      return this.selectedMonth === monthIndex && 
             this.currentYear === parseInt(this.modelValue?.split('-')[0]);
    },
    selectMonth(monthIndex) {
      this.selectedMonth = monthIndex;
      const formattedMonth = (monthIndex + 1).toString().padStart(2, '0');
      const formattedValue = `${this.currentYear}-${formattedMonth}`;
      
      // Emitir eventos
      this.$emit('update:modelValue', formattedValue);
      this.$emit('changed-month', {
        year: this.currentYear,
        month: monthIndex + 1,
        formatted: formattedValue,
        display: `${this.months[monthIndex]} ${this.currentYear}`
      });
      
      // Cerrar el picker automáticamente
      this.menu = false;
    }
  }
}
</script>