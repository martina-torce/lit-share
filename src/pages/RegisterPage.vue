<!-- This page allows the user to register -->
<template>
  <div class="page-wrapper">
    <div class="container has-text-centered">
      <div class="column is-4 is-offset-4">
        <h3 class="title has-text-grey">Register</h3>
        <div class="box">
          <form>
            <!-- Field where user can enter Email -->
            <div class="field">
              <div class="control">
                <input
                  v-model="form.email"
                  class="input is-large"
                  type="email"
                  placeholder="Email"
                  autocomplete="email"
                />
                <form-errors :errors="v$.form.email.$errors" />
              </div>
            </div>
            <!-- Field where user can enter Username -->
            <div class="field">
              <div class="control">
                <input
                  v-model="form.username"
                  class="input is-large"
                  type="text"
                  placeholder="Username"
                />
                <form-errors :errors="v$.form.username.$errors" />
              </div>
            </div>
            <!-- Field where user can enter Password -->
            <div class="field">
              <div class="control">
                <input
                  v-model="form.password"
                  class="input is-large"
                  type="password"
                  placeholder="Password"
                  autocomplete="current-password"
                />
                <form-errors :errors="v$.form.password.$errors" />
              </div>
            </div>
            <!-- Field where user can enter Password again -->
            <div class="field">
              <div class="control">
                <input
                  v-model="form.passwordConfirmation"
                  class="input is-large"
                  type="password"
                  placeholder="Repeat the password"
                />
                <form-errors :errors="v$.form.passwordConfirmation.$errors" />
              </div>
            </div>
            <!-- Button to confirm changes and create profile -->
            <button
              @click="register"
              :disabled="isProcessing"
              type="button"
              class="button is-block is-info is-large is-fullwidth"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from "../composition/useAuth";
import useVuelidate from "@vuelidate/core";
import { required, sameAs, helpers, email } from "@vuelidate/validators";
import FormErrors from "../components/FormErrors.vue";

export default {
  components: {
    FormErrors,
  },
  data() {
    return {
      form: {
        email: "",
        username: "",
        password: "",
        passwordConfirmation: "",
      },
    };
  },
  // make sure the information is entered correctly
  validations() {
    return {
      form: {
        email: { required, email },
        username: { required },
        password: { required },
        passwordConfirmation: {
          required,
          sameAs: helpers.withMessage("Must be same as the password", sameAs(this.form.password)),
        },
      },
    };
  },
  // adding the component's auth state and methods to its reactive state
  setup() {
    return {
      ...useAuth(),
      v$: useVuelidate(),
    };
  },
  // if "isAuthenticated" state changes to true, redirects user to homepage
  watch: {
    isAuthenticated(isAuth) {
      if (isAuth) {
        this.$router.push("/");
      }
    },
  },
  // dispatch the user information to the store if validation is successful
  methods: {
    async register() {
      const isValid = await this.v$.$validate();
      if (isValid) {
        this.$store.dispatch("user/register", this.form);
      }
    },
  },
};
</script>

<style scoped>
.box {
  margin-top: 1rem;
}
</style>
