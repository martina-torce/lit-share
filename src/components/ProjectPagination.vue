<!-- Creating the Project Pagination to divide list of papers into smaller segements/ pages -->
<template>
  <nav class="pagination is-rounded is-centered" role="navigation" aria-label="pagination">
    <ul class="pagination-list">
      <li>
        <!-- Multiple pages created to display remaining list of papers stored -->
        <button
          @click="() => onNextPage({ page: 'previous' })"
          :disabled="isFetching"
          type="button"
          class="pagination-previous has-text-weight-bold"
        >
          Previous
        </button>
      </li>
      <li>
        <button type="button" class="pagination-link button has-text-weight-bold is-primary">
          Page {{ page }}
        </button>
      </li>
      <li>
        <button
          @click="() => onNextPage({ page: 'next' })"
          :disabled="isFetching"
          type="button"
          class="pagination-next has-text-weight-bold"
        >
          Next
        </button>
      </li>
    </ul>
  </nav>
</template>

<!--Props used in template to ensure ProjectPagination works as intended - Page displays current page number, handling pagination and loading spinner for the next page-->
<script>
export default {
  props: {
    onNextPage: {
      type: Function,
      required: true,
    },
    isFetching: {
      type: Boolean,
      default: false,
    },
    page: {
      type: Number,
      default: 1,
    },
  },
};
</script>
