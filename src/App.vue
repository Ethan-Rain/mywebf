<template>
  <RouterView />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

#app {
  flex-grow: 1; /* 新增flex扩展属性 */
  min-height: calc(100vh - env(safe-area-inset-top));
}
</style>
