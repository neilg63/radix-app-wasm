<template>
  <nav id="nav">
    <router-link to="/">Radix Console</router-link>
    <div class="info-logo"><Button icon="pi pi-github" label="GitHub" class="p-button-rounded p-button-secondary" @click="gotoGithub" /></div>
  </nav>
  <router-view/>
  <footer id="footer">
    <p v-html="copyright" class="attribution"></p>
  </footer>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { defaultCopyrightMarkup } from './settings/options';

export default defineComponent({
  data() {
    return { 
      copyright: defaultCopyrightMarkup
    }
  },
  methods: {
    gotoGithub() {
      window.open("https://github.com/neilg63/radix-app-wasm", "_blank");
    }
  }
})
</script>

<style lang="scss">
@import "./styles/main.scss";
</style>
