<template>
  <div id="app">
    <BaseSelect
      label="Octave"
      :selectedOption="octave"
      :options="['1', '2', '3', '4', '5', '6', '7']"
      @input="octave = $event"
    />
    <div
      id="volume"
      class="knob"
      @mousedown="trackMouse('volume')"
      @mouseup="removeTracking('volume')"
      @mouseleave="removeTracking('volume')"
    >
      <div
        class="knob__indicator"
        :style="`transform: rotate(${volume * 3.6}deg)`"
      ></div>
    </div>
    <div
      id="filter"
      class="knob"
      @mousedown="trackMouse('filter')"
      @mouseup="removeTracking('filter')"
      @mouseleave="removeTracking('filter')"
    >
      <div
        class="knob__indicator"
        :style="`transform: rotate(${filterFreq / 7}deg)`"
      ></div>
    </div>
  </div>
</template>

<script>
import { notes, bindings } from "./helpers/notes";
import BaseSelect from "./components/BaseSelect.vue";
import BaseKnob from "./components/BaseKnob.vue";
export default {
  data() {
    return {
      ctx: null,
      osc: null,
      osc2: null,
      osc3: null,
      lfo: null,
      octave: "4",
      gainNode: null,
      filter: null,
      filterFreq: 1200,
      volume: 100,
    };
  },
  components: {
    BaseKnob,
    BaseSelect,
  },
  mounted() {
    const body = document.getElementById("app");
    body.addEventListener("mousedown", this.setup);
    document.addEventListener("keydown", this.logKey);
    document.addEventListener("keyup", this.stopNote);
  },
  methods: {
    trackMouse(control) {
      const knob = document.getElementById(control);
      knob.addEventListener("mousemove", this[`change${control}Value`]);
    },
    removeTracking(control) {
      const knob = document.getElementById(control);
      knob.removeEventListener("mousemove", this[`change${control}Value`]);
    },
    changevolumeValue(e) {
      this.volume = -e.offsetY + 100;
      this.gainNode.gain.setValueAtTime(
        this.volume / 100,
        this.ctx.currentTime
      );
    },
    changefilterValue(e) {
      this.filterFreq = 400 + (-e.offsetY + 100) * 15;
      this.filter.frequency.value = this.filterFreq;
      // this.filter.frequency.value = (-e.offsetY + 100) * 900;
      // this.filter.gain.setValueAtTime(this.volume / 100, this.ctx.currentTime);
    },
    logKey(e) {
      if (Object.keys(bindings).includes(e.key)) {
        this.playNote(this.getFrequency(bindings[e.key]));
      }
    },
    getFrequency(key) {
      return notes[`${key}${this.octave}`];
    },
    setup() {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.ctx.createGain();
      this.filter = new BiquadFilterNode(this.ctx, {
        type: "lowpass",
        frequency: this.filterFreq,
      });
      this.gainNode.connect(this.ctx.destination);
      this.gainNode.gain.setValueAtTime(
        this.volume / 100,
        this.ctx.currentTime
      );
      this.filter.connect(this.gainNode);
      this.lfo = this.ctx.createOscillator();
      this.lfo.gain.value = 100;
      this.lfo.frequency.setValueAtTime(100, this.ctx.currentTime);
      this.lfo.connect(this.filter.frequency);
    },
    playNote(freq) {
      // const detune = 2;
      this.osc = this.ctx.createOscillator();
      this.osc.connect(this.filter);
      this.osc.type = "sawtooth";
      this.osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // this.osc2 = this.ctx.createOscillator();
      // this.osc2.connect(this.gainNode);
      // this.osc2.type = "sawtooth";
      // this.osc2.frequency.setValueAtTime(freq - detune, this.ctx.currentTime);

      // this.osc3 = this.ctx.createOscillator();
      // this.osc3.connect(this.gainNode);
      // this.osc3.type = "sawtooth";
      // this.osc3.frequency.setValueAtTime(freq + detune, this.ctx.currentTime);

      this.osc.start();
      // this.osc2.start();
      // this.osc3.start();
    },
    stopNote() {
      this.osc.stop();
      // this.osc2.stop();
      // this.osc3.stop();
    },
  },
};
</script>
<style>
#app {
  background: #eee;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.knob {
  height: 100px;
  background: transparent;
  width: 100px;
}

.knob__indicator {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  position: relative;
  background: orangered;
  z-index: 0;
  user-select: none;
  pointer-events: none;
}

.knob__indicator::after {
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
</style>
