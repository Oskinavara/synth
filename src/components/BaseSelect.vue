<template>
  <div>
    <label :for="label">{{ label }}</label>
    <select :id="label" :value="value" @input="setValue">
      <option v-for="option in options" :key="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "BaseSelect",
  props: {
    options: {
      type: Array,
      required: true,
    },
    value: {
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
