import Vue from "vue";
import App from "./App";

import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);
// 全局方法挂载
new Vue({
  el: "#app",
  render: (h) => h(App),
});
