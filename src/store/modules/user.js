import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../../db";

export default {
  namespaced: true,
  state() {
    return {
      data: null,
      auth: {
        isProcessing: false,
        error: "",
      },
    };
  },
  getters: {
    isAuthenticated(state) {
      return !!state.data;
    },
    isPaperOwner: (state) => (paperUserId) =>
      state.data && paperUserId && state.data.id === paperUserId,
    isProjectMember: (state) => (projectUserId) =>
      state.data && projectUserId && state.data.id === projectUserId,
  },
  actions: {
    async uploadImage(_, { bytes, name, onSuccess, onProgress }) {
      const storage = getStorage();
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, bytes);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => {
          console.error(error.message);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          onSuccess(downloadUrl);
        },
      );
    },
    onAuthChange({ dispatch, commit }, callback) {
      commit("setAuthIsProcessing", true);
      onAuthStateChanged(getAuth(), async (user) => {
        if (user) {
          await dispatch("getUserProfile", user);
          commit("setAuthIsProcessing", false);
          callback(user);
        } else {
          console.log("Logged out");
          commit("setAuthIsProcessing", false);
          callback(null);
        }
      });
    },
    async updateProfile({ commit, dispatch }, { data, onSuccess }) {
      const userRef = doc(db, "users", data.id);

      if (data.projects) {
        delete data.projects;
      }

      await updateDoc(userRef, data);
      commit("updateProfile", data);
      dispatch("toast/success", "Profile has been updated!", { root: true });
      onSuccess();
    },
    async getUserProfile({ commit }, user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const userProfile = docSnap.data();

      const projQuery = query(collection(db, "projects"), where("user", "==", docRef));
      const querySnap = await getDocs(projQuery);
      const projects = querySnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const exprojQuery = query(
        collection(db, "projects"),
        where("users", "array-contains", user.uid),
      );
      const exquerySnap = await getDocs(exprojQuery);
      const exprojects = exquerySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(exprojects);

      const papQuery = query(collection(db, "papers"), where("user", "==", docRef));
      const papSnap = await getDocs(papQuery);
      const papers = papSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      const useWithProfile = {
        id: user.uid,
        email: user.email,
        ...userProfile,
        projects: projects,
        papers: papers,
        exprojects: exprojects,
      };
      commit("setUser", useWithProfile);
    },
    async register({ commit, dispatch }, { email, password, username }) {
      commit("setAuthIsProcessing", true);
      commit("setAuthError", "");

      try {
        const { user } = await createUserWithEmailAndPassword(getAuth(), email, password);
        await dispatch("createUserProfile", {
          id: user.uid,
          username,
          avatar: "../../assets/user.png",
          email: email,
          projects: [],
          papers: [],
        });
      } catch (e) {
        commit("setAuthError", e.message);
        dispatch("toast/error", e.message, { root: true });
      } finally {
        commit("setAuthIsProcessing", false);
      }
    },

    async login({ commit, dispatch }, { email, password }) {
      commit("setAuthIsProcessing", true);
      commit("setAuthError", "");

      try {
        await signInWithEmailAndPassword(getAuth(), email, password);
      } catch (e) {
        commit("setAuthError", e.message);
        dispatch("toast/error", e.message, { root: true });
      } finally {
        commit("setAuthIsProcessing", false);
      }
    },
    async logout({ commit }) {
      try {
        await signOut(getAuth());
        commit("setUser", null);
      } catch (e) {
        console.error("Cannot logout!");
      }
    },
    async createUserProfile(_, { id, ...profile }) {
      await setDoc(doc(db, "users", id), { ...profile, id });
    },
  },
  mutations: {
    setAuthIsProcessing(state, isProcessing) {
      state.auth.isProcessing = isProcessing;
    },
    setAuthError(state, error) {
      state.auth.error = error;
    },
    setUser(state, user) {
      state.data = user;
    },
    updateProfile(state, profile) {
      state.data = { ...state.data, ...profile };
    },
    updateCredit(state, credit) {
      state.data.credit += credit;
    },
  },
};
