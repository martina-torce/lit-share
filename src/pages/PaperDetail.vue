<!-- This page allows the user to view details about a paper -->
<template>
  <div v-if="paper && paper.slug" class="page-wrapper">
    <!-- Display title and type of paper -->
    <section class="hero is-black">
      <div class="hero-body">
        <div class="hero-img"></div>
        <div class="container">
          <div style="padding-top: 30px" class="columns">
            <div class="column is-100">
              <h1 class="title">
                {{ paper.title }}
              </h1>
              <!-- Display user who added paper -->
              <div v-if="!!paperUser" class="user-tile">
                <div class="user-tile-image">
                  <figure class="image is-64x64" style="padding-bottom: 30px">
                    <img class="is-rounded" :src="paperUser.avatar" />
                  </figure>
                </div>
                <div class="user-tile-author left">
                  <h3 class="user-tile-author-name" style="margin: 0">
                    by {{ paperUser.username }}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Display the reference attributes of a paper -->
    <div class="container">
      <div class="columns">
        <div class="column is-9">
          <div class="section">
            <div class="more-details">
              <div class="more-details-title">Paper details</div>
              <div class="more-details-item">Title: {{ paper.title }}</div>
              <div class="more-details-item">Auhtor: {{ paper.author }}</div>
              <div class="more-details-item">Year: {{ paper.year }}</div>
              <div class="more-details-item">CitationKey: {{ paper.citationkey }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Display the comments of a paper -->
    <div class="container">
      <div class="title">Comments</div>
      <div v-for="comment in commentsForPaper" :key="comment.id" class="comment">
        {{ comment.NewComment }}
        <div class="level-right">By {{ comment.userUsername.id }}</div>
      </div>
    </div>
    <div class="page-wrapper" style="padding: 0">
      <div class="container">
        <div class="form-container">
          <form>
            <div class="field">
              <label class="label">Add comment</label>
              <div class="control">
                <input
                  v-model="form.NewComment"
                  class="input"
                  type="text"
                  placeholder="Your comment..."
                />
                <form-errors :errors="v$.form.NewComment.$errors" />
              </div>
            </div>
            <div class="field is-grouped">
              <div class="control">
                <button type="button" @click="createComment" class="button is-link">Submit</button>
              </div>
              <div class="control">
                <router-link to="/projects" class="button is-text">Cancel</router-link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import FormErrors from "../components/FormErrors.vue";

const setupInitialData = () => ({
  NewComment: "",
});

export default {
  components: {
    FormErrors,
  },

  created() {
    const { slug } = this.$route.params;
    this.$store.dispatch("paper/getPapersBySlug", slug);
    this.form.paper = slug;
    this.$store.dispatch("usercomment/getComments", slug);
  },

  computed: {
    user() {
      return this.$store.state.user.data;
    },
    isAuth() {
      return this.$store.getters["user/isAuthenticated"];
    },
    paper() {
      return this.$store.state.paper.item;
    },
    paperUser() {
      return this.paper.user;
    },
    userPapers() {
      return this.user?.papers || [];
    },
    canCreatePaper() {
      return this.isAuth && !this.isPaperOwner;
    },
    commentsForPaper() {
      return this.$store.state.usercomment.items;
    },
  },

  data() {
    return {
      form: setupInitialData(),
    };
  },

  // helps ensure the fields are entered correctly
  validations() {
    return {
      form: {
        NewComment: {
          required: helpers.withMessage("cannot upload empty comment!", required),
        },
      },
    };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  // if the fields are entered correctly it dispatches project information to store and reset fields
  methods: {
    async createComment() {
      const isValid = await this.v$.$validate();

      if (isValid) {
        this.v$.$reset();
        this.$store.dispatch("usercomment/createComment", {
          data: this.form,
          onSuccess: () => {
            this.form = setupInitialData();
          },
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.title {
  color: gray;
}
.hero-body {
  position: relative;
}
.hero-img {
  opacity: 0.8;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  filter: sepia(0.1) grayscale(0.1) saturate(0.8);
}
.is-black {
  background-color: black;
  background: linear-gradient(#29303b, #29303b, #29303b);
}
.title {
  font-weight: normals;
  font-size: 25px;
}
.more-details {
  background-color: #f9f9f9;
  border: 1px solid #dedfe0;
  padding: 10px 15px;
  &-title {
    font-size: 26px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  &-items {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  &-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 19px;
    width: 100%;
  }
}
.user-tile {
  display: flex;
  &-author {
    align-self: center;
    margin-left: 10px;
    &-name {
      font-size: 17px;
    }
  }
}
.comment {
  margin: 1em 0 2em;
  border-bottom: 1px solid #ccc;
}
</style>
