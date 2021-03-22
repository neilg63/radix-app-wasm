<template>
<div class="mode-logo" @click="toggleInfo">
      <i :class="radixIconClasses"></i>
      <h4>{{topLabel}}</h4>
      <Info :base="fromBase" :visible="showInfo" />
 </div>
  <section class="console" :class="wrapperClasses">
    
    <h1 class="row">
      <SplitButton :label="fromBaseLabel" icon="pi pi-chevron-left" class="from-selector" :model="fromRadixItems"></SplitButton>
      <Button icon="pi pi-sort-alt" class="p-button-rounded p-button-success toggle-bases" @click="invert" />
      <SplitButton :label="toBaseLabel" icon="pi pi-chevron-right" class="to-selector" :model="toRadixItems"></SplitButton>
    </h1>

    <div class="row input-panel">
      <InputText type="text" v-model="sourceStr" size="60" class="expression-input large" placeholder="enter expression" />
    </div>
    <div v-if="loaded" class="row values">
        
        <h3 class="from-value" :class="fromBaseClasses">
          {{sourceVal}}
        </h3>
        <h3 class="to-value" :class="toBaseClasses">
          {{toVal}}
        </h3>
        <h3 v-if="fromNonDec" class="dec-val">{{decVal}}</h3>
      </div>
       <div v-if="loaded" class="row values">
        <h3 v-if="!isInteger" class="fraction dec-val" :class="fracValClasses">
          <span v-if="fracVal.hasWholeNum" class="whole">{{fracVal.wholeNum}}</span>
          <span class="numerator">{{fracVal.overNum}}</span>
          <span class="denominator">{{fracVal.denominator}}</span>
        </h3>
        <h3 v-if="!isInteger" class="fraction rad-val" :class="fracValClasses">
          <span v-if="radixFracVal.hasWholeNum" class="whole">{{radixFracVal.wholeNum}}</span>
          <span class="numerator">{{radixFracVal.overNum}}</span>
          <span class="denominator">{{radixFracVal.denominator}}</span>
        </h3>
      </div>
      <aside class="help">
        <p v-html="helpText"></p>
      </aside>
  </section>
</template>

<script lang="ts">
import { ref, defineComponent, computed, onMounted, reactive } from 'vue';
import { RadixEngine } from '@/engine/radix';
import { radixOpts, matchRadixLabel, matchHelpText, matchRadixAltLabel, matchIcon } from '@/settings/options';
import { buildBasePatternStr, convertToDozenalNotation, evaluateExpression, randomSourceString, sanitizeRadixSource } from '@/services/funcs';
import Info from "./Info.vue";

export default defineComponent({
  components: {
    Info,
  },
  name: 'Console',
  setup() {
    const sourceStr = ref(randomSourceString());
    const fromBase = ref(10);
    const toBase = ref(12);
    const loaded = ref(false);
    let engine = reactive(new RadixEngine());

    const singleDecVal = computed(() => {
      const val = fromBase.value === 10 ? parseFloat(sourceStr.value) : engine.toDec(sourceStr.value, fromBase.value);
      return isNaN(val) ? 0 : val;
    })

    const decVal = computed(() => {
      const sanitizedSource = sanitizeRadixSource(sourceStr.value, fromBase.value);
      return loaded.value? evaluateExpression(sanitizedSource, fromBase.value, engine) : singleDecVal.value;
    })

    const decValFormatted = computed(() => {
      const parts = decVal.value.toString().split(".");
      if (parts.length > 1) {
        if (parts[1].length > 10) {
          parts[1] = parts[1].substring(0, 10);
        }
      }
      return parts.join("·");
    })

    const radixVal = computed(() => {
      return engine.toRadix(decVal.value, toBase.value).split(".").join("·");
    })

    const sourceVal = computed(() => {
      return fromBase.value === 10 ? decValFormatted.value : engine.toRadix(decVal.value, fromBase.value, sourceStr.value).split(".").join("ׁׁׂ·");
    })

    const toVal = computed(() => {
      return toBase.value === 10 ? decValFormatted.value : radixVal.value;
    })

    const fracVal = computed(() => {
      return engine.toFrac(decVal.value);
    })

    const radixFracVal = computed(() => {
      const base = toBase.value === 10? fromBase.value : toBase.value;
      return engine.toRadixFrac(decVal.value, base);
    })

    const isInteger = computed(() => {
      return decVal.value % 1 === 0;
    })

    const toBaseClasses = computed(() => {
      const radixClass = toBase.value === 10? 'dec-val' : 'rad-val';
      return [['radix', toBase.value].join('-'), radixClass];
    })

    const fromBaseClasses = computed(() => {
      const radixClass = fromBase.value === 10? 'dec-val' : 'rad-val';
      const cls = [['radix', fromBase.value].join('-'), radixClass];
      return cls;
    })

    const fromNonDec = computed(() => {
      return fromBase.value !== 10 && toBase.value !== 10;
    })

    const buildRadixItems = (mode = "from") => {
      return radixOpts.map(row => {
        const {label, value, icon } = row;
        return { 
          label,
          icon,
          command: () => {
            if (mode === "to") {
              toBase.value = value
            } else {
              fromBase.value = value
            }
          }
        }
      });
    }

    const toRadixItems = computed(() => {
      return buildRadixItems("to");
    });

    const fromRadixItems = computed(() => {
      return buildRadixItems("from");
    });

    const fracValClasses = computed(() => {
      const mainClass = fracVal.value.hasWholeNum? 'has-whole' : 'simple';
      return [mainClass];
    });

    const inputPattern = computed(() => {
      const numPattern = buildBasePatternStr(fromBase.value);
      return "(" +[numPattern,"[/*+-)( ]"].join("|") + ")+";
    });

    const fromBaseLabel = computed(() => {
      return matchRadixLabel(fromBase.value);
    })

    const toBaseLabel = computed(() => {
      return matchRadixLabel(toBase.value);
    })

    onMounted(() => {
      import("../wasm/radix/radix.js").then((exports) => {
        engine = new RadixEngine(exports);
        engine.applyDozenalNotation = true;
        loaded.value = engine.loaded;
      });
    });
    const helpText = computed(() => matchHelpText(fromBase.value) );
    const topLabel = computed(() =>matchRadixAltLabel(fromBase.value));
    return { engine, fromBase, toBase, toRadixItems, fromRadixItems, sourceStr, decVal, decValFormatted, radixVal, loaded, fromNonDec, toVal, sourceVal, fromBaseClasses, toBaseClasses, isInteger, fracVal, fracValClasses, inputPattern, radixFracVal, fromBaseLabel, toBaseLabel, helpText, topLabel }
  },
  data() {
    return {
      showInfo: false
    }
  },
  created() {
    window.addEventListener('keydown', (e) => {
      switch(e.which) {
        case 27:
          this.showInfo = false;
          break;
        case 38:
          this.decreaseToBase();
          break;
        case 40:
          this.increaseToBase();
          break;
      }
    });
  },
  methods: {
    invert() {
      const toBase = this.toBase;
      const toVal = this.toVal;
      this.sourceStr = toVal;
      this.toBase = this.fromBase;
      this.fromBase = toBase;
    },
    cleanInput() {
      switch (this.fromBase) {
        case 12:
          this.sourceStr = convertToDozenalNotation(this.sourceStr);       
          break;
      }
      this.sourceStr = this.sourceStr.split("·").join(".");
    },
    toggleInfo() {
      this.showInfo = !this.showInfo;
    },
    increaseToBase(up = true) {
      const currIndex = radixOpts.findIndex(ro => ro.value === this.toBase);
      const nextIndex = up? currIndex + 1 : currIndex - 1;
      if (nextIndex >= 0 && nextIndex < radixOpts.length) {
        this.toBase = radixOpts[nextIndex].value;
      }
    },
    decreaseToBase() {
      this.increaseToBase(false);
    },
  }, 
  computed: {
    wrapperClasses(): string[] {
      const radModeClass = this.fromBase === 10? 'dec-mode' : 'radix-mode';
      return [['radix', this.fromBase, 'mode'].join('-'), radModeClass];
    },
    radixIconClasses(): string {
      return matchIcon(this.fromBase);
    }
  },
  watch: {
    sourceStr() {
      this.cleanInput();
    }
  }
});
</script>

