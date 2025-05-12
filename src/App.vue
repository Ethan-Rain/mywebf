<template>
  <RouterView />


  <footer class="icp-footer">
      <p>© 2025 MyWebsite. All rights reserved.</p>
      <p>
        <a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">
          蜀ICP备2023021465号-1
        </a>
      </p>
    </footer>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  cursor: url('/cursor/WakabaMutsumi/Normal%20Select.ani'), auto !important;
}

a, button {
  cursor: url('/cursor/WakabaMutsumi/Link.ani'), pointer !important;
}

a:hover {
  cursor: url('/cursor/WakabaMutsumi/Help%20Select.ani'), progress !important;
}

.icp-footer {
  width: 100%;
  padding: 15px 0;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.icp-footer p {
  margin: 5px 0;
}

.icp-footer a {
  color: #779977;
  text-decoration: none;
}

.icp-footer a:hover {
  color: #557755;
}

.icp-footer {
  margin-top: 40px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.icp-footer a {
  color: #666;
  text-decoration: none;
}

.icp-footer a:hover {
  text-decoration: underline;
}
</style>

<script lang="ts">
export default {
  name: 'App',
  setup() {
    return {}
  }
}
</script>
