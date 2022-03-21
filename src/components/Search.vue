<template>
  <el-col :style="'width:' + width + 'px;'">
    <div class="search">
      <el-input
        :placeholder="placeholder"
        v-model="input"
        @input="change"
      >
      </el-input>
      <span
        @click="search"
        class="iconfont icon-sousuo"
      ></span>
    </div>
  </el-col>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      input: ""
    };
  },
  mounted() {
    window.addEventListener("keyup", this.keySearch)
  },
  unmounted() {
    window.removeEventListener(this.keySearch);
  },
  props: {
    width: {
      type: String,
      default: "350",
    },
    placeholder: {
      type: String,
      default: "请输入内容",
    },
    searchTo: {
      type: Function,
      default(e) {
        console.log("搜索内容是：" + e);
      },
    },
  },
  methods: {
    search() {
      if (this.input.trim() === "") return;
      this.searchTo(this.input);
    },
    change() {
      if (this.input.trim() === "") this.searchTo(this.input);
    },
    keySearch(e) {
     if (e.key !== "Enter") return;
     this.search();
    }
  },
};
</script>

<style scoped lang="scss">
.search {
  display: flex;
  background-color: #fff;

  span {
    box-sizing: border-box;
    width: 50px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    color: #999;
    cursor: pointer;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-left: 5px;
    transition: 0.1s;

    &:active {
      background-color: var(--clickh);
      color: #fff;
    }
  }
}
</style>
