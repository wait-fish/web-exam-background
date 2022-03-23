import Vue from 'vue';
import 'element-ui/lib/theme-chalk/index.css';
import {
  Button,
  Select,
  Upload,
  Message,
  Col,
  Row,
  Menu,
  MenuItem,
  Aside,
  Breadcrumb,
  BreadcrumbItem,
  Input,
  Table,
  TableColumn,
  Option,
  Dialog,
  Form,
  FormItem,
  Pagination,
  Tag,
  Tabs,
  TabPane,
  Cascader,
  Steps,
  Step,
  DatePicker,
  Collapse,
  CollapseItem,
  MessageBox,
  Image,
  Divider
} from 'element-ui';


Vue.use(Button);
Vue.use(Select);
Vue.use(Upload);
Vue.use(Col);
Vue.use(Row);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Aside);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Input);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Option);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Pagination);
Vue.use(Tag);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Cascader);
Vue.use(Steps);
Vue.use(Step);
Vue.use(DatePicker);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Image);
Vue.use(Divider);


Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox;