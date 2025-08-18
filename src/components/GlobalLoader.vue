<template>
  <v-overlay
    :model-value="show"
    class="d-flex flex-column justify-center align-center"
    persistent
  >
    <v-progress-circular
      color="primary"
      indeterminate
      size="64"
    />
    <span class="mt-3 text-white font-weight-bold">{{ text }}</span>
  </v-overlay>
</template>

<script setup>
defineProps({
  show: Boolean,
  text: {
    type: String,
    default: "Cargando, por favor espere..."
  }
})
</script>

<style scoped>
.v-overlay {
  z-index: 9999;
}
</style>

