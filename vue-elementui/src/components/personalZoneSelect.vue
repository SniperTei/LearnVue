<template>
  <div>
    <!-- Your template code goes here -->
    <el-tooltip :content="tooltipValue" size="small" :placement="placement" :effect="effect">
      <el-select v-model="selectValue" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <!-- <template slot="content">
        <div>
          <span>这是一段内容</span>
          <el-button size="mini" type="text">按钮</el-button>
        </div>
      </template> -->
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'PersonalZoneSelect',
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
        return selectedOption ? selectedOption.label : '';
      }
      return '';
    }
  },
  methods: {
    // Your methods go here
  },
  mounted() {
    // Code to run when the component is mounted goes here
  },
};
</script>

<style scoped>
/* Your component styles go here */
</style>