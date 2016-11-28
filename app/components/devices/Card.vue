<template>
<div class="column is-one-quarter">
<div class="card">
  <div class="card-image">
    <figure class="image is-256x256">

      <slot name="img"></slot>


    </figure>
  </div>
  <div class="card-content">
    <div class="media">
      <div class="media-left">
      </div>
      <div class="media-content">
        <p class="title is-5">
          <slot name="main"></slot>
        </p>
      </div>
    </div>

    <div class="content">
        <slot name="content"></slot>
    </div>
  </div>
</div>
</div>
</template>
<script>
export default{

}
</script>

<style lang="sass">

</style>
