import { db } from "../../db";
import {
  getDocs,
  getDoc,
  doc,
  addDoc,
  query,
  where,
  limit,
  startAfter,
  startAt,
  collection,
  Timestamp,
} from "firebase/firestore";
import slugify from "slugify";

const initPagination = () => ({
  itemCount: 15,
  lastItem: null,
  paginationHistory: [],
  isFetchingData: false,
});

export default {
  namespaced: true,
  state() {
    return {
      items: [],
      item: {},
      pagination: initPagination(),
    };
  },
  getters: {
    currentPage(state) {
      if (!state.pagination.paginationHistory) {
        return 1;
      }

      return state.pagination.paginationHistory.length;
    },
    filterPapers: (state) => (searchedTitle) => {
      const { items } = state;

      if (!searchedTitle) {
        return items;
      }

      const filteredPapers = items.filter((item) => {
        return item.title && item.title.toLowerCase().includes(searchedTitle.toLowerCase());
      });

      return filteredPapers;
    },
  },
  actions: {
    // context -> state, commit
    async getPapersBySlug({ commit }, slug) {
      commit("setPaper", {});
      const docQuery = query(collection(db, "papers"), where("slug", "==", slug));

      const querySnap = await getDocs(docQuery);
      const paper = querySnap.docs[0].data();
      paper.id = querySnap.docs[0].id;

      const userSnap = await getDoc(paper.user);
      paper.user = userSnap.data();
      paper.user.id = userSnap.id;
      commit("setPaper", paper);
    },

    async getMorePapers({ commit, state }, { page }) {
      let queryData;

      if (state.pagination.isFetchingData) {
        return;
      }
      commit("setIsFetchingData", true);

      if (page === "next") {
        queryData = query(
          collection(db, "papers"),
          startAfter(state.pagination.lastItem),
          limit(state.pagination.itemCount),
        );
      } else {
        const lastItemIndex = state.pagination.paginationHistory.length - 1;
        const previousItem = state.pagination.paginationHistory[lastItemIndex - 1];

        if (!previousItem) {
          commit("setIsFetchingData", false);
          return;
        }

        state.pagination.paginationHistory.splice(lastItemIndex, 1);
        queryData = query(
          collection(db, "papers"),
          startAt(previousItem),
          limit(state.pagination.itemCount),
        );
      }

      const snapshot = await getDocs(queryData);
      commit("setIsFetchingData", false);
      if (snapshot.docs.length === 0) {
        return;
      }

      const papers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      commit("setPapers", papers);
      commit("setLastItem", snapshot.docs[snapshot.docs.length - 1]);

      if (page === "next") {
        commit("setPaginationHistory", snapshot.docs[0]);
      }
    },
    async getPapers({ commit, state }) {
      commit("resetPagination");

      const paperQuery = query(collection(db, "papers"), limit(state.pagination.itemCount));
      const snapshot = await getDocs(paperQuery);
      const papers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      commit("setPapers", papers);
      commit("setLastItem", snapshot.docs[snapshot.docs.length - 1]);
      commit("setPaginationHistory", snapshot.docs[0]);
    },

    async createPaper({ rootState, dispatch }, { data, onSuccess }) {
      const userRef = doc(db, "users", rootState.user.data.id);
      data.user = userRef;
      data.slug = slugify(`${data.title} ${Date.now()}`, {
        lower: true,
        strict: true,
      });
      data.createdAt = Timestamp.fromDate(new Date());

      await addDoc(collection(db, "papers"), data);

      dispatch("toast/success", "Paper was created succesfully!", { root: true });
      onSuccess();
    },
  },
  mutations: {
    setPapers(state, papers) {
      state.items = papers;
    },
    setPaper(state, paper) {
      state.item = paper;
    },
    setLastItem(state, item) {
      state.pagination.lastItem = item;
    },
    setPaginationHistory(state, item) {
      state.pagination.paginationHistory.push(item);
    },
    setIsFetchingData(state, isFetching) {
      state.pagination.isFetchingData = isFetching;
    },
    resetPagination(state) {
      state.pagination = initPagination();
    },
  },
};
