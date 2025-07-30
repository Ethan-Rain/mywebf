<!-- src/components/MarkdownViewer.vue -->
<template>
  <vue3-markdown-it :source="content" class="markdown-content" />
</template>

<script setup lang="ts">
import Vue3MarkdownIt from 'vue3-markdown-it'

// 接收外部传进来的 Markdown 内容
defineProps<{ content: string }>()
</script>

<style scoped>
.markdown-content {
  line-height: 1.6;
  padding: 1rem;
  font-family: system-ui, sans-serif;
}

.markdown-content pre {
  background: #f6f8fa;
  padding: 1em;
  border-radius: 5px;
  overflow-x: auto;
}

.markdown-content code {
  background: #f0f0f0;
  padding: 0.2em 0.4em;
  border-radius: 4px;
}
</style>
