<!-- This page allows the user to create a new shared database -->
<template>
  <!-- Creates a form containing information about the project -->
  <div class="page-wrapper">
    <div class="container">
      <div class="form-container">
        <h2>Create new project</h2>
        <form>
          <!-- Field where user can input project title -->
          <div class="field">
            <label class="label">Project title</label>
            <div class="control">
              <input
                v-model="form.title"
                class="input"
                type="text"
                placeholder="Title of the project"
              />
              <form-errors :errors="v$.form.title.$errors" />
            </div>
          </div>
          <!-- Field where user can input collaborators -->
          <div class="field">
            <label class="label">Invited users</label>
            <div class="control">
              <input
                v-model="form.invitedUsers"
                @input="handleUsers"
                class="input"
                type="ref"
                placeholder="User emails (separated by spaces)"
              />
              <div v-for="user in form.users" :key="user" class="user is-primary is-medium">
                <form-errors :errors="v$.form.invitedUsers.$errors" />
                {{ user }}
              </div>
            </div>
          </div>
          <!-- Buttons to Submit or Cancel -->
          <div class="field is-grouped">
            <div class="control">
              <button type="button" @click="createProject" class="button is-link">Submit</button>
            </div>
            <div class="control">
              <router-link to="/projects" class="button is-text">Cancel</router-link>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import FormErrors from "../components/FormErrors.vue";

const setupInitialData = () => ({
  title: "",
  users: [],
});

export default {
  components: {
    FormErrors,
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
        title: {
          required: helpers.withMessage("Title cannot by empty!", required),
        },
        invitedUsers: {
          required: false,
        },
      },
    };
  },
  setup() {
    return { v$: useVuelidate() };
  },
  // if the fields are entered correctly it dispatches project information to store and reset fields
  methods: {
    async createProject() {
      const isValid = await this.v$.$validate();

      if (isValid) {
        this.v$.$reset();
        this.$store.dispatch("project/createProject", {
          data: this.form,
          onSuccess: () => {
            this.form = setupInitialData();
          },
        });
      }
    },
    // checks if input is valid and adds the value to the form's users property and reset field
    handleUsers(event) {
      const { value } = event.target;

      if (
        value &&
        value.trim().length > 1 &&
        (value.substr(-1) === "," || value.substr(-1) === " ")
      ) {
        const _value = value.split(",")[0].trim();

        if (!this.form.users.includes(_value)) {
          this.form.users.push(_value);
        }

        event.target.value = "";
      }
    },
  },
};
</script>

<style>
h2 {
  margin-top: 20px;
}
.field {
  margin-top: 20px;
}
</style>
