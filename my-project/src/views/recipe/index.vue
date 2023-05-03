<template>
  <div class="recipe-container">
    <div class="recipe-header">
      <div class="recipe-header-left">
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handleEdit">编辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      </div>
      <div class="recipe-header-right">
        <el-input
          placeholder="请输入内容"
          v-model="inputValue"
          clearable
          @keyup.enter.native="handleSearch"
          @clear="handleClear"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>
    </div>
    <div class="recipe-content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="菜谱名称" width="180"></el-table-column>
        <el-table-column prop="type" label="菜谱类型" width="180"></el-table-column>
        <el-table-column prop="time" label="制作时间" width="180"></el-table-column>
        <el-table-column prop="difficulty" label="难度" width="180"></el-table-column>
        <el-table-column prop="taste" label="口味" width="180"></el-table-column>
        <el-table-column prop="people" label="适合人群" width="180"></el-table-column>
        <el-table-column prop="season" label="适合季节" width="180"></el-table-column>
        <el-table-column prop="ingredient" label="主要食材" width="180"></el-table-column>
        <el-table-column prop="step" label="步骤" width="180"></el-table-column>
        <el-table-column prop="tips" label="小贴士" width="180"></el-table-column>
        <el-table-column prop="image" label="图片" width="180"></el-table-column>
        <el-table-column prop="video" label="视频" width="180"></el-table-column>
        <el-table-column prop="description" label="描述" width="180"></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    
  },
  setup() {
    return {}
  },
  mounted() {
    console.log('recipe mounted')
  },
  data() {
    return {
      tableData: [{
        name: '黄焖鸡米饭',
        type: '家常菜',
        time: '30分钟',
        difficulty: '简单',
        taste: '咸鲜',
        people: '老人、孩子',
        season: '四季',
        ingredient: '鸡腿、米饭、黄焖鸡米饭调料',
        step: '1.将鸡腿洗净，切块，用料酒、生抽、老抽、盐、胡椒粉、姜蒜末腌制10分钟。2.将腌制好的鸡块放入锅中，加入黄焖鸡米饭调料，加入适量的水，大火烧开后转小火炖煮10分钟。3.将米饭放入电饭煲中，加入适量的水，加入黄焖鸡米饭调料，按下煮饭键。4.将煮好的米饭盛入碗中，加入炖好的鸡块，撒上葱花即可。',
        tips: '1.鸡腿可以用鸡胸肉代替，口感会更嫩滑。2.煮饭时，可以加入适量的胡萝卜丁，口感会更好。3.煮饭时，可以加入适量的香菇丁，口感会更好。4.煮饭时，可以加入适量的土豆丁，口感会更好。5.煮饭时，可以加入'
      }],
      inputValue: ''
    }
  }, 
  methods: {
    handleAdd() {
      console.log('handleAdd')
    },
    handleEdit() {
      console.log('handleEdit')
    },
    handleDelete() {
      console.log('handleDelete')
    },
    handleSearch() {
      console.log('handleSearch')
    },
    handleClear() {
      console.log('handleClear')
    }
  }
}
</script>

<style>

</style>