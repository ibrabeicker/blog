<template>
  <Layout>
    <template #home-features-before>
      <div class="posts-container">My custom sidebar top content</div>
      <li v-for="post of posts2">
        <a :href="post.url">{{ post.frontmatter.title }}</a>
        <span>by {{ post }}</span>
        <a :href="post.url">Linky</a>
      </li>
    </template>
  </Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme'
import { data as posts } from '../posts.data.ts'

const { Layout } = DefaultTheme
const posts2 = posts
</script>

<style>

.posts-container {
  padding: 0 180px;
}

</style>