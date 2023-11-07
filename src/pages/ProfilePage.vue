<!-- This page allows the user to view their profile -->
<template>
  <div class="page-wrapper">
    <div class="columns">
      <div class="container profile">
        <div class="section profile-heading">
          <div class="columns is-mobile is-multiline">
            <div class="column is-2">
              <!-- Display user avatar -->
              <figure class="image header-icon user-profile-image">
                <img class="is-rounded" :src="user?.avatar" />
              </figure>
            </div>
            <!-- Display username -->
            <div class="column is-4-tablet is-10-mobile name">
              <div class="user-info">
                <p>
                  <span class="title is-bold">{{ user?.username }}</span>
                  <br />
                </p>
                <!-- Display user info -->
                <p class="tagline">
                  {{ user?.info }}
                </p>
              </div>
              <!-- Button to open modal to update profile -->
              <profile-modal v-if="user" :user="user" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from "../composition/useAuth";
import ProfileModal from "../components/ProfileModal";

export default {
  components: {
    ProfileModal,
  },
  setup() {
    return useAuth();
  },
  watch: {
    isAuthenticated(isAuth) {
      if (!isAuth) {
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
.user-info {
  margin-bottom: 10px;
}
.section.profile-heading .column {
  border-left: 1px dotted rgba(0, 0, 0, 0.2);
}
.container.profile {
  margin-top: 1%;
}
.container.profile {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f1f1f1;
}
</style>
