---
categories:
  - name: 'Category 1'
  - name: 'Category 2'
  - name: 'Category 3'

pages:
  - link: 'big-selects'
  - link: 'regex'
  - link: 'six-steps-to-fail-db'
---

P {{ $frontmatter.categories }} {{ $frontmatter.pages }}


[An1]({{ './' + $frontmatter.pages[0].link }})
[An2](./big-selects)
[An3]({{ './big-selects' }}){{ '[An4](./big-selects)' }}

<script setup>
import CreatedLink from './components/CreatedLink.vue'
</script>

<CreatedLink />
