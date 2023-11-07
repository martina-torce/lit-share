<!-- First Citation Modal for Bibtex format -->
<template>
  <citation-modal ref="citationModal">
    <div class="container">
      <div class="posts-type">Citation List (BibTeX)</div>
      <div class="row is-multiline">
        <div
          v-for="paper in userPapers"
          :key="paper.id"
          class="row is-12-mobile is-6-tablet is-4-widescreen is-6-desktop"
        >
          <!-- Outputs the list of paper in bibtex format -->
          <pre>
@{{ paper.type }}{ {{ paper.citationkey }},
    author    = "{{ paper.author }}",
    title     = "{{ paper.title }}",
    journal   = "{{ paper.journal }}",
    year      =  {{ paper.year }},
    DOI       = {{ paper.doi }},
    url       = {{ paper.url }},
}</pre
          >
        </div>
      </div>
    </div>
    <template #activator>
      <button class="round-button export-button" style="color: white">Export BibTeX</button>
    </template>
  </citation-modal>
</template>

<script>
import CitationModal from "./CitationModalComponent.vue";
export default {
  components: {
    CitationModal,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      userProfile: { ...this.user },
      progress: 0,
      searchedPaperTitle: "",
    };
  },
  computed: {
    modal() {
      return this.$refs.citationModal;
    },
    papers() {
      console.log();
      return this.$store.getters["paper/filterPapers"](this.searchedPaperTitle);
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
  methods: {
    handleUpload(e) {
      const self = this;
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = function () {
        self.$store.dispatch("user/uploadImage", {
          bytes: reader.result,
          name: file.name,
          onSuccess: (url) => {
            self.userProfile.avatar = url;
          },
          onProgress: (progress) => {
            self.progress = progress;
          },
        });
      };
    },
    getMorePapers({ page }) {
      this.$store.dispatch("paper/getMorePapers", { page });
    },
    filterPapers(searchValue) {
      this.searchedPaperTitle = searchValue;
    },
  },
};
</script>

<style scoped>
.export-button {
  right: 210px;
  top: 100px;
  position: absolute;
  z-index: 2;
  background-color: hsl(0deg, 0%, 29%);
  border: none;
  padding: 10px 22px;
  border-radius: 12px;
  text-align: center;
  display: inline-block;
  font-size: 16px;
}

.posts-type {
  font-size: 34px;
  margin-bottom: 10px;
  font-weight: bold;
}
</style>
