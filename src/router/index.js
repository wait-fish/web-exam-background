import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from '../views/Index.vue';
import Login from '../views/Login.vue';
import Admin from '../components/Index/Admin.vue';
import ImportExecl from '../components/ImportExecl.vue';
import Menu from '../components/Index/Menu.vue';
import Student from '../components/Index/Student/Student.vue';
import StudentEdit from '../components/Index/Student/Edit.vue';
import Score from '../components/Index/Score/Score.vue';
import ScoreEdit from '../components/Index/Score/Edit.vue';
import Charts from '../components/Index/Charts/Charts.vue';
import Fund from '../components/Index/Fund/Fund.vue';
import FundEdit from '../components/Index/Fund/Edit.vue';
import Files from '../components/Index/Files/Files.vue';
import FilesAdd from '../components/Index/Files/Add.vue';
import Expand from '../components/Index/Expand.vue';
import Images from '../components/Index/Images.vue';
import StudentAccount from '../components/Index/StudentAccount/StudentAccount.vue';



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: "login",
    component: Login
  },
  {
    path: "/index",
    name: "index",
    component: Index,
    redirect: "/charts",
    children: [
      { path: "/admin", name: "admin", component: Admin },
      { path: "/student", name: "student", component: Student },
      { path: "/student_edit", name: "student_edit", component: StudentEdit },
      { path: "/importexecl", name: "importexecl", component: ImportExecl },
      { path: "/menu", name: "menu", component: Menu },
      { path: "/score", name: "score", component: Score },
      { path: "/score_edit", name: "score_edit", component: ScoreEdit },
      { path: "/charts", name: "charts", component: Charts },
      { path: "/fund", name: "fund", component: Fund },
      { path: "/fund_edit", name: "fund_edit", component: FundEdit },
      { path: "/files", name: "files", component: Files },
      { path: "/files_add", name: "files_add", component: FilesAdd },
      { path: "/expand", name: "expand", component: Expand },
      { path: "/images", name: "images", component: Images },
      { path: "/student_account", name: "student_account", component: StudentAccount },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
