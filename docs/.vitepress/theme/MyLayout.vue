<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { useData } from "vitepress";

const { frontmatter } = useData();
</script>

<template>
  <DefaultTheme.Layout>
    <template #home-hero-image>
      <div class="hero-brand">
        <img
          :src="frontmatter.hero.image.src.light || frontmatter.hero.image.src"
          :alt="frontmatter.hero.image.alt"
          class="hero-logo"
        />
        <div class="hero-badges">
          <a href="https://github.com/sshpod/sshpod" target="_blank" rel="noreferrer">
            <img src="https://img.shields.io/badge/github-sshpod%2Fsshpod-111827?logo=github" alt="GitHub repository" />
          </a>
          <a href="https://github.com/sshpod/sshpod/issues" target="_blank" rel="noreferrer">
            <img src="https://img.shields.io/badge/issues-open-0B6FD1?logo=github" alt="Open issues" />
          </a>
          <a href="https://github.com/sshpod/sshpod/blob/main/LICENSE" target="_blank" rel="noreferrer">
            <img src="https://img.shields.io/badge/license-BSD--3--Clause-DBAA6E" alt="BSD 3-Clause license" />
          </a>
        </div>
      </div>
    </template>
  </DefaultTheme.Layout>
</template>
