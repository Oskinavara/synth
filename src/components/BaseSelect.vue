<template>
  <div>
    <label :for="label">{{ label }}</label>
    <select :id="label" :value="selectedOption" @input="setValue">
      <option v-for="option in options" :key="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "BaseSelect",
  emits: ["input"],
  props: {
    options: {
      type: Array,
      required: true,
    },
    selectedOption: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  methods: {
    setValue(e) {
      this.$emit("input", e.target.value);
    },
  },
};
</script>

<style scoped></style>
