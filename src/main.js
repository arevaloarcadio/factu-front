import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './plugins/axios'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './plugins/store/index'

import Multiselect from 'vue-multiselect'

import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/es.json';
import es from 'vee-validate/dist/locale/es.json'

// NOTIFICACIONES TOSTR
import VueNotifications from 'vue-notifications';
import miniToastr from 'mini-toastr';
const toastTypes = {
    success: 'success',
    error: 'error',
    info: 'info',
    warn: 'warn'
};

miniToastr.init({types: toastTypes});

function toast ({title, message, type, timeout, cb}) {
    return miniToastr[type](message, title, timeout, cb)
}

const options = {
    success: toast,
    error: toast,
    info: toast,
    warn: toast
};
Vue.use(VueNotifications)
Vue.component('multiselect', Multiselect)

Vue.config.performance = true
Vue.use(CoreuiVue)
Vue.prototype.$log = console.log.bind(console)  

///////////////////// VEE VALIDATE ///////////////////////
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule], // copies rule configuration
    message: messages[rule] // assign message
  });
});
localize({
  es,
});
///////////////////////////////////////////////////////////


new Vue({
  el: '#app',
  router,
  store,
  icons,
  template: '<App/>',
  components: {
    App
  }
})
