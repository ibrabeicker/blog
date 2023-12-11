<template>
    Here liest the categories
    <ul>
        <li v-for="category in categories" :key="category">{{ category }}</li>
    </ul>
</template>

<script setup>
const categories = ['category 1', 'category 2', 'category 3']
</script>