<template>
  <div>
    <p>{{ control }}</p>
    <div
      :id="control"
      :class="['knob', { disabled }]"
      @mousedown="startTracking"
      @mouseup="stopTracking"
      @mouseleave="stopTracking"
    >
      <div
        class="knob__indicator"
        :style="`transform: rotate(${value * coefficient}deg)`"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseKnob",
  props: {
    control: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    coefficient: {
      type: Number,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    startTracking() {
      if (!this.disabled) {
        this.$emit("start-tracking", this.control);
      }
    },
    stopTracking() {
      if (!this.disabled) {
        this.$emit("stop-tracking", this.control);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.knob {
  height: 100px;
  background: transparent;
  width: 100px;
  &__indicator {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    position: relative;
    background: orangered;
    z-index: 0;
    user-select: none;
    pointer-events: none;

    &::after {
      background: white;
      content: "";
      position: absolute;
      height: 10px;
      width: 10px;
      border-radius: 50%;
      left: 50%;
      transform: translateX(-50%);
      bottom: 20%;
    }
  }
  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

</style>
