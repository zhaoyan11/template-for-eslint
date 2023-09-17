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

let x: any;
x = '9999';
console.log(x);
</script>

<style scoped></style>
