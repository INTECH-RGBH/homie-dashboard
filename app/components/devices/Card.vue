<template>
<div class="column is-6-mobile is-3-tablet is-2-desktop">
<div class="card">
  <div class="card-image">
    <figure class="image is-256x256">
      <slot name="img"></slot>
    </figure>
  </div>

  <div class="card-content">
    <div class="content">
      <slot name="main"></slot>
    </div>
  </div>

  <footer v-if="hasActions" class="card-footer">
    <slot name="footer"></slot>
  </footer>
</div>
</div>
</template>

<script>
export default {
  props: ['hasActions']
}
</script>

<style lang="sass" scoped>
  .card
    height: 100%
  
</style>
