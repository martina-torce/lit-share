<!-- Create the modal for export citation ( For bibtex format and normal citation list ) -->
<template>
  <div>
    <template v-if="$slots.activator">
      <!-- when we press open, call open function to show the modal -->
      <div @click="open">
        <slot name="activator" />
      </div>
    </template>
    <div :class="['modal', { 'is-active': isOpen }]">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ headerText }}</p>
        </header>
        <section class="modal-card-body">
          <slot />
        </section>
        <footer class="modal-card-foot">
          <button @click="close" class="button">Cancel</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    headerText: {
      type: String,
      default: "Export Window",
    },
    onModalSubmit: {
      type: Function,
      required: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    submitModal() {
      this.onModalSubmit({
        onSuccess: this.close,
      });
    },
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
  },
};
</script>
