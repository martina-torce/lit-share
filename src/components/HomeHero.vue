<template>
  <!-- Creating the Hero component for the Home page -->
  <div class="hero-section">
    <section class="background">
      <div class="center">
        <h1 class="BigTitle has-text-dark vertical-center">Collaborative Literature Storage</h1>
        <h2 class="subtitle has-text-dark vertical-center">
          Keep track of scientific literature within your collaborating group.
        </h2>
      </div>
    </section>
  </div>
</template>

<script></script>

<style scoped lang="scss">
.background {
  background-image: url("../assets/background.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  height: 100%;
  position: relative;
}
.hero-section {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  position: fixed;
}
</style>
