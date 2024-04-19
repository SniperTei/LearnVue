<template>
  <div>
    <!-- Your template code goes here -->
    <el-tooltip :content="tooltipValue" size="small" :placement="placement" :effect="effect">
      <el-select v-model="selectValue" placeholder="请选择" @change="selectValueChanged">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'ZNSelect',
  props: {
    // Your component props go here
    options: {
      type: Array,
      required: true,
    },
    placement: {
      type: String,
      default: 'top',
    },
    effect: {
      type: String,
      default: 'light',
    },
    value: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      selectValue: this.value,
    };
  },
  computed: {
    tooltipValue() {
      // 如果selectValue有值
      if (this.selectValue) {
        // 获取当前选中的option
        const selectedOption = this.options.find(option => option.value === this.selectValue);
        // 返回选中的option的label
        return selectedOption ? selectedOption.label + '(' + selectedOption.name + ')' : '';
      }
      return '';
    },
    // currentValue: {
    //   get() {
    //     return this.selectValue;
    //   },
    //   set(val) {
    //     this.selectValue = val;
    //     this.$emit('input', val);
    //   },
    // },
  },
  methods: {
    selectValueChanged() {
      this.$emit('input', this.selectValue);
    },
  },
  mounted() {
    // Code to run when the component is mounted goes here
  },
};
</script>

<style scoped>
/* Your component styles go here */
</style>