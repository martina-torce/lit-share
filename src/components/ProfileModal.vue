<template>
  <!-- Create the components of the profile modal -->
  <update-modal ref="exchangeModal" :onModalSubmit="updateProfile">
    <form>
      <!-- Username component of the modal -->
      <div class="field">
        <label class="title">Username</label>
        <input v-model="userProfile.username" class="input" />
      </div>
      <!-- Avatar component of the modal -->
      <div class="field">
        <label class="title">Avatar</label>
        <div class="file has-name">
          <label class="file-label">
            <!-- When pressed, will upload image to Firecloud storage instead of Firestore -->
            <input @change="handleUpload" class="file-input" type="file" name="resume" />
            <span class="file-cta">
              <span class="file-icon">
                <font-awesome-icon icon="upload" />
              </span>
              <!-- Can browse file to choose for an image -->
              <span class="file-label"> Choose a file… </span>
            </span>
          </label>
        </div>
        <!-- Show progress bar of uploading the Avatar photo -->
        <progress class="progress" :value="progress" max="100">{{ progress }}%</progress>
        <img v-if="userProfile.avatar" class="image-preview" :src="userProfile.avatar" />
      </div>
      <!-- User info component of the modal -->
      <div class="field">
        <label class="title">Info</label>
        <input v-model="userProfile.info" class="input" />
      </div>
    </form>

    <!-- When pressed update the info about the profile -->
    <template #activator>
      <button class="button is-block is-primary is-light is-fullwidth">Update Profile</button>
    </template>
  </update-modal>
</template>

<script>
// Import he modal component
import UpdateModal from "./ModalComponent.vue";
export default {
  components: {
    UpdateModal,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  // user = user loged in
  data() {
    return {
      userProfile: { ...this.user },
      progress: 0,
    };
  },
  computed: {
    modal() {
      return this.$refs.exchangeModal;
    },
  },
  methods: {
    // Updates the changes to firestore in user collection
    updateProfile() {
      this.$store.dispatch("user/updateProfile", {
        data: this.userProfile,
        onSuccess: () => this.modal.close(),
      });
    },
    // Create the upload method to upload images for profile picture
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
  },
};
</script>

<style scoped>
.image-preview {
  height: 200px;
}

.progress {
  margin-top: 15px;
}
</style>
