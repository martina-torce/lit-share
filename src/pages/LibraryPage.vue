<!--Displays Library Page for inputted papers-->
<template>
  <div id="lit-share">
    <library-hero :onSearch="filterPapers" />
    <library-list :myPapers="userPapers" />
    <library-pagination
      :onNextPage="getMorePapers"
      :isFetching="isFetchingMoreData"
      :page="currentPage"
    />
  </div>
</template>

<script>
import LibraryList from "../components/LibraryList.vue";
import LibraryPagination from "../components/LibraryPagination.vue";
import LibraryHero from "../components/LibraryHero.vue";

export default {
  components: {
    LibraryList,
    LibraryPagination,
    LibraryHero,
  },
  data() {
    return {
      searchedPaperTitle: "",
    };
  },
  computed: {
    /* papers() {
        console.log();
        return this.$store.getters["paper/filterPapers"](this.searchedPaperTitle);
      }, */
    user() {
      return this.$store.state.user.data;
    },
    paper() {
      return this.$store.state.project.item;
    },
    isFetchingMoreData() {
      return this.$store.state.paper.pagination.isFetchingData;
    },
    currentPage() {
      return this.$store.getters["paper/currentPage"];
    },
    userPapers() {
      return this.user?.papers || [];
    },
  },
  created() {
    this.$store.dispatch("paper/getPapers");
  },
  // Method created responsible for retrieving more papers from the database and filtering papers based on inputed search value
  methods: {
    getMorePapers({ page }) {
      this.$store.dispatch("paper/getMorePapers", { page });
    },
    filterPapers(searchValue) {
      this.searchedPaperTitle = searchValue;
    },
  },
};
</script>
