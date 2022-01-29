<template>
  <CHeader fixed with-subheader light>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      @click="$store.commit('toggleSidebarMobile')"
    />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="$store.commit('toggleSidebarDesktop')"
    />
    <CHeaderBrand class="mx-auto d-lg-none" to="/">
      <!-- SELECT UNIT !-->
    </CHeaderBrand>
    <CHeaderNav class="d-md-down-none mr-auto">
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard">
          Escritorio
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/users" exact>
          Usuarios
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem>
        <select v-if="units.length" class="select form-control" @change="sendUnit($event.target.value)">
          <option v-for="u in units" :value="u.unit_id" :selected="getUser.unit == u.unit_id">{{ u.unit.name }}</option>
        </select>
      </CHeaderNavItem>

    </CHeaderNav>
    <CHeaderNav class="mr-4">
      <CHeaderNavItem class="d-md-down-none mx-2">
       <CDropdown inNav class="c-header-nav-items" placement="bottom-end" add-menu-classes="pt-0">
          <template #toggler>
            <CHeaderNavLink>
            <CIcon name="cil-bell"/>
            <CBadge color="danger" class="ml-auto">{{total}}</CBadge>
            </CHeaderNavLink>
          </template>
          <template v-if="total == 0">
            <CDropdownItem >
             No hay notificaciones nuevas
            </CDropdownItem>
          </template>
          <template v-for="(notification,key) in notifications">
            <CDropdownDivider v-if="key!=0"></CDropdownDivider>
            <CDropdownItem @click="readAt(notification)" >
              <CIcon name="cil-task" />
                <router-link class="a_href"
                  :to="'/'+notification.link"
                  >{{notification.data}}
                </router-link>
             
            </CDropdownItem>
          </template>
        </CDropdown>  
      </CHeaderNavItem>
      <!--<CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-list"/>
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-envelope-open"/>
        </CHeaderNavLink>
      </CHeaderNavItem>-->
      <TheHeaderDropdownAccnt/>
    </CHeaderNav>
    <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0 mb-0"/>
    </CSubheader>

   <CToaster :autohide="20000">
      <template v-for="not in notification">
        <CToast
          :key="'toast' + not.id"
          :show="true"
          header="Nueva notificación"
          
        >
          {{not.data}}
        </CToast>
      </template>
    </CToaster>
    
  </CHeader>


</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'
//import axios from 'axios'
import Pusher from 'pusher-js'
import { mapGetters, mapActions } from 'vuex'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import PushJs from 'push.js'

const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

var TheHeader;

function getNotification(data) {
  TheHeader.addNotification(data);
  TheHeader.getMyNotifications();
}

export default {
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt
  },
  data () {
    return {
      units: [],
      notifications :[],
      notification :[],
      total : 0
    }
  },
  created(){
    this.getMyNotifications();
  },
  mounted(){
    TheHeader = this
    
    //Pusher.logToConsole = true;
   
    var pusher = new Pusher('91ab7afa0f283ea405d5', {
      cluster: 'eu'
    });
    
    var channel = pusher.subscribe('my-notification-'+this.getUser.id);

    channel.bind(`my-notification-event`, function(data) {
      getNotification(data);
      
      PushJs.create("Hexcrm: Nueva Notificación",{
        body: data.data,
        icon: '/public/apple-icon-152x152.png',
        //timeout: 2000,
        onClick: function () {
          window.focus();
          TheHeader.$router.push({ path : data.link})
        }
      });
    });
  },
  computed: {
    ...mapGetters([
      'getUser'
    ]),
  },
  methods:{
    ...mapActions([
      'setUnit'
    ]),
    addNotification(data){
      this.notification = [];
      this.notification.push(data);
    },
    getMyNotifications(){
      this.$http({url: 'v1/users/notifications',  method: 'GET' })
        .then(resp => {
          const t = this
          t.notifications = resp.data.data
          t.total = resp.data.total
          resolve(resp)
        })
        .catch(err => {
          //commit('auth_error', err)
          //reject(err)
        });
    },
    readAt(notification){
      this.$http({url: 'v1/users/read_at',  method: 'POST' , data :{ ...notification} })
        .then(resp => {
          this.getMyNotifications();
        })
        .catch(err => {
          //commit('auth_error', err)
          //reject(err)
        });
    },
    sendUnit(valor){
      this.setUnit(valor)
      this.$router.go(0)
    }
  },
  computed: {
    ...mapGetters([
                'getUser'
            ]),
  }
}
</script>

<style type="text/css">
  .a_href{
    color: inherit;
    text-decoration: none;
  }
</style>
