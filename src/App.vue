<template>
  <RouterView />
  <div />
  <VanButton
    type="primary"
    @click="showToast('toast')"
  >
    button
  </VanButton>
</template>

<script setup lang="ts">
import { showToast } from 'vant';
</script>

<style scoped></style>
