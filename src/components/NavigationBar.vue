<template>
  <!-- The Navigation bar at the top of the screen -->
  <header class="header">
    <!-- Define navigation path  -->
    <nav class="navbar" :class="$route.path === '/' ? '' : 'with-background'">
      <div class="container">
        <!-- Create the title on the left  -->
        <div class="navbar-brand">
          <router-link
            class="navbar-item is-size-2 has-text-weight-bold"
            :style="{ color: 'white' }"
            to="/"
          >
            {{ title }}
          </router-link>
          <span
            @click="isMenuOpen = !isMenuOpen"
            :class="{ 'is-active': isMenuOpen }"
            role="button"
            tabindex="0"
            class="navbar-burger burger has-text-dark"
            data-target="navbar-menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
        <div id="navbar-menu" :class="{ 'is-active': isMenuOpen }" class="navbar-menu">
          <!-- Show email adress if the user is logged in  -->
          <div class="navbar-end">
            <div
              :style="{ color: navbarColors[$route.path] }"
              v-if="isAuthenticated"
              class="navbar-item"
            >
              {{ user.email }}
            </div>
            <!-- Create Home component and redirect to homepage if pressed  -->
            <router-link
              :style="{ color: navbarColors[$route.path] }"
              v-for="item in items"
              :key="item.text"
              :to="item.link"
              class="navbar-item nav-web"
            >
              {{ item.text }}
            </router-link>

            <template v-if="isAuthenticated">
              <!-- Show My Project component if user is logged in and redirect to My project Page page if pressed -->
              <router-link
                :style="{ color: navbarColors[$route.path] }"
                to="/projects"
                class="navbar-item"
              >
                Projects
              </router-link>
              <!-- Show Profile component if user is logged in and redirect to Profile Page page if pressed -->
              <router-link
                :style="{ color: navbarColors[$route.path] }"
                to="/profile"
                class="navbar-item"
              >
                Profile
              </router-link>
              <!-- Show Logout component if user is logged in and logout + redirect to home page if it is pressed -->
              <router-link
                :style="{ color: navbarColors[$route.path] }"
                to="/"
                @click="() => $store.dispatch('user/logout')"
                class="navbar-item clickable"
              >
                Logout
              </router-link>
            </template>
            <!-- Show Login component and redirect to login page if it is pressed -->
            <template v-else>
              <router-link
                :style="{ color: navbarColors[$route.path] }"
                to="/login"
                class="navbar-item"
              >
                Login
              </router-link>
              <!-- Show Register component and redirect to Register page if it is pressed -->
              <router-link
                :style="{ color: navbarColors[$route.path] }"
                to="/register"
                class="navbar-item"
              >
                Register
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import useAuth from "../composition/useAuth";
export default {
  props: {
    title: {
      type: String,
      default: "LitShare",
    },
    items: {
      type: Array,
      required: true,
    },
  },
  // Make the color of the component change depending on what page we are
  data() {
    return {
      isMenuOpen: false,
      navbarColors: {
        "/": "black",
        "/profile": "white",
        "/library": "white",
        "/library/new": "white",
        "/login": "white",
        "/register": "white",
        "/library/:slug": "white",
        "/project": "white",
      },
    };
  },
  setup() {
    return useAuth();
  },
  created() {
    window.addEventListener("resize", this.handleWindowResizing);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleWindowResizing);
  },
  // method when the size of the window decreases, reduce the nav bar to a menu that can be pressed
  methods: {
    handleWindowResizing(e) {
      if (this.isMenuOpen && e.target.innerWidth > 1020) {
        this.isMenuOpen = false;
      }
    },
  },
};
</script>
