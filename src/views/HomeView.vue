<template>
  <div class="home">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
// ...existing code...
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  background: #f9f9f9;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  margin: 0;
}

h1 {
  color: #779977;
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
}

p {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  line-height: 1.6;
  text-align: center;
}
</style>