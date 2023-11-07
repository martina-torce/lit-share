<template>
  <!-- Creates the Library pagination -->
  <nav class="pagination is-rounded is-centered" role="navigation" aria-label="pagination">
    <ul class="pagination-list">
      <li>
        <!-- when pressed, goes to previous page -->
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
        <!-- Displaying the current page the user is in -->
        <button type="button" class="pagination-link button has-text-weight-bold is-primary">
          Page 1
        </button>
      </li>
      <li>
        <!-- when pressed, goes to next page -->
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
      default: 0,
    },
  },
};
</script>

<style>
.pagination {
  position: absolute;
  bottom: 20px;
  left: 40%;
}
</style>
