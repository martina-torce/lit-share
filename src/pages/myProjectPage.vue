<!--Displays Project list and Pagination-->
<template>
  <div id="lit-share">
    <project-list :myProjects="userProjects" :memberProjects="exUserProjects" />
    <project-pagination
      :onNextPage="getMoreProjects"
      :isFetching="isFetchingMoreData"
      :page="currentPage"
    />
  </div>
</template>

<script>
import ProjectList from "../components/ProjectList.vue";
import ProjectPagination from "../components/ProjectPagination.vue";

export default {
  components: {
    ProjectList,
    ProjectPagination,
  },
  data() {
    //Filters projects based on Title
    return {
      searchedProjectTitle: "",
    };
  },
  computed: {
    user() {
      return this.$store.state.user.data;
    },
    project() {
      return this.$store.state.project.item;
    },
    exproject() {
      return this.$store.state.exproject.item;
    },
    projectMembers() {
      return this.project.user;
    },
    userProjects() {
      return this.user?.projects || [];
    },
    exUserProjects() {
      return this.user?.exprojects || [];
    },
    isFetchingMoreData() {
      return this.$store.state.project.pagination.isFetchingData;
    },
    currentPage() {
      return this.$store.getters["project/currentPage"];
    },
  },
  created() {
    this.$store.dispatch("project/getProjects");
  },
  methods: {
    getMoreProjects({ page }) {
      this.$store.dispatch("project/getMoreProjects", { page });
    },
    filterProjects(searchValue) {
      this.searchedProjectTitle = searchValue;
    },
  },
};
</script>
