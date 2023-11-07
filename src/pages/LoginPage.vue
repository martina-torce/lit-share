<!--Login form displayed to allow access for aunthorized users-->
<template>
  <div class="page-wrapper">
    <div class="container has-text-centered">
      <div class="column is-4 is-offset-4">
        <h3 class="title has-text-grey">Login</h3>
        <p class="subtitle has-text-grey">Please login to proceed.</p>
        <div class="box">
          <form>
            <div class="field">
              <div class="control">
                <input
                  v-model="form.email"
                  class="input is-large"
                  type="email"
                  placeholder="Your Email"
                  autofocus=""
                  autocomplete="email"
                />
                <form-errors :errors="v$.form.email.$errors" />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input
                  v-model="form.password"
                  class="input is-large"
                  type="password"
                  placeholder="Your Password"
                  autocomplete="current-password"
                />
                <form-errors :errors="v$.form.password.$errors" />
              </div>
            </div>
            <button
              @click="login"
              :disabled="isProcessing"
              type="button"
              class="button is-block is-info is-large is-fullwidth"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<!--Defines behaviour of login form-->
<script>
import useAuth from "../composition/useAuth";
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import FormErrors from "../components/FormErrors.vue";

export default {
  components: {
    FormErrors, //Error message displayed if login is unsuccessful
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
    };
  },
  // Ensures valid email address is used
  validations() {
    return {
      form: {
        email: { required, email },
        password: { required },
      },
    };
  },
  //Provides authentication and validation methods
  setup() {
    return {
      ...useAuth(),
      v$: useVuelidate(),
    };
  },
  watch: {
    isAuthenticated(isAuth) {
      if (isAuth) {
        this.$router.push("/");
      }
    },
  },
  // Method validates form fields inputted and redirects user to homepage if login is successful
  methods: {
    async login() {
      const isValid = await this.v$.$validate();
      if (isValid) {
        this.$store.dispatch("user/login", this.form);
      }
    },
  },
};
</script>
