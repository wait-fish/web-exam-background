<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
:root {
  --bg: rgb(64, 158, 255);
  --color: rgb(73, 168, 247);
  --clickh: rgb(113, 183, 253,0.6);
  background-color: rgb(245, 249, 250);
  user-select: none;
  scroll-behavior: smooth;
  height: auto;
  transition: 0.5s;
  font-family: "微软雅黑", "黑体";
}
h1,h2,h3,h4,h5,h6,p,div,li,ul,li,body{
  margin: 0;
  padding: 0;
}
ul {
  list-style: none;
}
.my_container {
  background-color: #fff;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, .05);
  margin-bottom: 20px;
  height: auto;
  overflow: hidden;
}
.my_page_pd {
  padding: 15px 15px 0;
}
.my_top {
  margin-top: 30px;
}
.my_flex {
  display: flex;
  justify-content: space-between;
}
</style>
