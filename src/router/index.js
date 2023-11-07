import { createWebHistory, createRouter } from "vue-router";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import PaperAddPage from "../pages/PaperAdd";
import PaperDetailPage from "../pages/PaperDetail";
import LibraryPage from "../pages/LibraryPage";
import myProjectPage from "../pages/myProjectPage.vue";
import ProjectCreate from "../pages/ProjectCreate.vue";

import { getAuth } from "firebase/auth";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/project/:slug/library/",
    name: "ProjectLibrary",
    component: LibraryPage,
    meta: { onlyAuthUser: true },
  },
  {
    path: "/library/new",
    name: "PaperAdd",
    component: PaperAddPage,
    meta: { onlyAuthUser: true },
  },
  {
    path: "/project/:slug/library/:slug",
    name: "PaperDetail",
    component: PaperDetailPage,
    meta: { onlyAuthUser: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfilePage,
    meta: { onlyAuthUser: true },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { onlyGuestUser: true },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
    meta: { onlyGuestUser: true },
  },
  {
    path: "/projects",
    name: "MyProjects",
    component: myProjectPage,
    meta: { onlyAuthUser: true },
  },
  {
    path: "/projects/new",
    name: "NewProjects",
    component: ProjectCreate,
    meta: { onlyAuthUser: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const isAuth = !!getAuth().currentUser;

  if (to.meta.onlyAuthUser) {
    if (isAuth) {
      next();
    } else {
      next({ name: "Login" });
    }
  } else if (to.meta.onlyGuestUser) {
    if (isAuth) {
      next({ name: "Home" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
