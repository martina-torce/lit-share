import { createStore } from "vuex";
import user from "./modules/user";
import toast from "./modules/toast";
import paper from "./modules/paper";
import project from "./modules/project";
import usercomment from "./modules/usercomment";

// Vuex built-in method to create a new store, split into different modules
export default createStore({
  modules: {
    user,
    toast,
    paper,
    project,
    usercomment,
  },
});
