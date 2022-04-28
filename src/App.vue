<template>
  <div id="app">
    <WavePicker @set-wave-type="waveType = $event" :activeType="waveType" />
    <BaseSelect
      label="Octave"
      :options="['1', '2', '3', '4', '5', '6', '7']"
      v-model="octave"
    />
    <BaseSelect
      label="Voices"
      :options="['1', '2', '3', '4', '5', '6', '7']"
      v-model="voices"
    />
    <BaseKnob
      @start-tracking="startTracking"
      @stop-tracking="stopTracking"
      control="Volume"
      :coefficient="3.6"
      :value="volume"
    />
    <BaseKnob
      @start-tracking="startTracking"
      @stop-tracking="stopTracking"
      control="Filter"
      :coefficient="1 / 6"
      :value="filterFreq"
    />
    <BaseKnob
      @start-tracking="startTracking"
      @stop-tracking="stopTracking"
      control="Detune"
      :disabled="voices === '1'"
      :coefficient="3.6 * 15"
      :value="detune"
    />
  </div>
</template>

<script>
import { notes, bindings } from "./helpers/notes";
import BaseSelect from "./components/BaseSelect.vue";
import BaseKnob from "./components/BaseKnob.vue";
import WavePicker from "./components/WavePicker.vue";
export default {
  data() {
    return {
      octave: "4",
      voices: "1",
      ctx: null,
      lfo: null,
      gainNode: null,
      filter: null,
      filterFreq: 1200,
      volume: 100,
      detune: 2,
      waveType: "sine",
      oscillators: [],
    };
  },
  components: {
    BaseKnob,
    BaseSelect,
    WavePicker,
  },
  mounted() {
    const body = document.getElementById("app");
    body.addEventListener("mousedown", this.setup);
    document.addEventListener("keydown", this.handleKeypress);
    document.addEventListener("keyup", this.stopNote);
  },
  methods: {
    startTracking(control) {
      const knob = document.getElementById(control);
      knob.addEventListener("mousemove", this[`change${control}Value`]);
    },
    stopTracking(control) {
      const knob = document.getElementById(control);
      knob.removeEventListener("mousemove", this[`change${control}Value`]);
    },
    changeVolumeValue(e) {
      this.volume = -e.offsetY + 100;
      this.gainNode.gain.value = this.volume / 100;
    },
    changeFilterValue(e) {
      this.filterFreq = 200 + (-e.offsetY + 100) * 15;
      this.filter.frequency.value = this.filterFreq;
    },
    changeDetuneValue(e) {
      this.detune = (-e.offsetY + 100) / 15;
    },
    handleKeypress(e) {
      if (e.repeat) {
        return;
      }
      if (Object.keys(bindings).includes(e.key)) {
        this.playNote(e.key);
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
      this.gainNode.gain.value = this.volume / 100;
      this.filter.connect(this.gainNode);
      this.lfo = this.ctx.createOscillator();
      this.lfo.frequency.value = 100;
      this.lfo.connect(this.filter.frequency);
    },
    playNote(key) {
      for (let i = 0; i < this.voices; i++) {
        const osc = this.ctx.createOscillator();
        osc.connect(this.filter);
        osc.type = this.waveType;
        osc.frequency.value =
          this.getFrequency(bindings[key]) + i * this.detune * Math.pow(-1, i);
        osc.start();
        this.oscillators = [...this.oscillators, { osc, key }];
      }
    },
    stopNote(e) {
      const oscillatorsToStop = this.oscillators.filter(
        (osc) => osc.key === e.key
      );
      oscillatorsToStop.forEach((osc) => {
        osc.osc.stop();
      });
      this.oscillators = this.oscillators.filter((osc) => osc.key !== e.key);
    },
  },
};
</script>
<style>
@import "@/styles/reset.scss";
body {
  margin: 0;
}
#app {
  background: #eee;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
</style>
