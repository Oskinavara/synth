<template>
  <ul class="wave-picker">
    <li v-for="item in items" :key="item">
      <button
        :class="{ active: item === activeType }"
        @click="$emit('set-wave-type', item)"
      >
        <img :src="`/${item}.svg`" alt="" />
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  name: "WavePicker",
  props: {
    activeType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      items: ["sine", "square", "triangle", "sawtooth"],
    };
  },
};
</script>

<style lang="scss" scoped>
.wave-picker {
  list-style: none;
  display: flex;

  button {
    max-width: 60px;
    padding: 0 8px;
    &:focus,
    &:focus-within {
      outline: none;
    }

    &.active {
      background: #ccc;
    }

    img {
      &:focus,
      &:focus-within {
        outline: none;
      }
      pointer-events: none;
      margin-top: 16px;
      transform: scale(2);
    }
  }
}
</style>
