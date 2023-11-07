<template>
  <!-- Create the list of papers from the paper database in Firestore  -->
  <section class="list">
    <div class="container">
      <div class="list-type">List of papers</div>
      <div class="row is-multiline">
        <!-- Loops inside the papers from the paper database  -->
        <div
          v-for="paper in myPapers"
          :key="paper.id"
          class="row is-12-mobile is-6-tablet is-4-widescreen is-6-desktop"
        >
          <div class="item post-card bottom-border">
            <!-- Loops inside the tags from papers and display them -->
            <div class="item-tags padder">
              <a v-for="tag in paper.tags" :key="tag" class="button is-rounded" href="#">
                #{{ tag }}
              </a>
            </div>
            <!-- When pressed on the title, change the route-view to the specicific paper detail -->
            <router-link
              :to="{ name: 'PaperDetail', params: { slug: paper.slug } }"
              class="item-link"
            >
              <!-- Display the paper title -->
              <h2 class="title item-title is-size-4 has-text-weight-extra-bold">
                <a class="item-link" href="#">{{ paper.title }}</a>
              </h2>
            </router-link>
            <!-- Display the date the paper was added -->
            <div class="level-left paper-key">Key: {{ paper.citationkey }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    myPapers: {
      type: Array,
      required: false,
    },
  },
};
</script>

<style scoped lang="scss">
.list {
  padding-top: 105px;
}
.list-type {
  font-size: 34px;
  margin-bottom: 30px;
  font-weight: bold;
}

.padder {
  padding: 0;
}
.paper-key {
  padding-bottom: 10px;
}
</style>
