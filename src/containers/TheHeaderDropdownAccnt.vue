<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar">
          <img
            :src="baseURL+'/img/profiles/'+user.image"
            class="c-avatar-img "
          />
        </div>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>{{user.firstname+' '+user.lastname }}</strong>
    </CDropdownHeader>
    <!--<CDropdownItem>
      <CIcon name="cil-envelope-open" /> Mensajes
      <CBadge color="success" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>-->
    <CDropdownItem>
      <CIcon name="cil-task" /> Tareas
      <CBadge color="danger" class="ml-auto">{{ task_items }}</CBadge>
    </CDropdownItem>
    <CDropdownHeader
      tag="div"
      class="text-center"
      color="light"
    >
      <strong>Configuración</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-user" /> Perfil
    </CDropdownItem>
    <CDropdownDivider/>
    <CDropdownItem>
      <CIcon name="cil-lock-locked"  />
        <a class="nav-link"  @click="logout">Cerrar Sesión</a>
    </CDropdownItem>
  </CDropdown>
</template>

<script>

import axios from 'axios';
import {mapGetters,mapState} from 'vuex';
import jwtToken from '../plugins/jwt/jwt-token';
import user from '../plugins/jwt/user' ; 
import router from '@/router'

export default {
  name: 'TheHeaderDropdownAccnt',
  
  data () {
    return { 
      itemsCount: 42,
      baseURL : null,
      task_items : 0,
      user : JSON.parse(user.getUser())
    }
  },
  created() {
    this.baseURL = axios.defaults.baseURL;
    this.getItemsTasks();
  },
  methods: {
    logout() {
      jwtToken.removeToken();
      this.$store.dispatch('unsetAuthUser')
      .then(() => {
        router.push({path: '/pages/login'});
      });
    },
    getItemsTasks() {
      
      axios
        .get('v1/tasks')
        .then(resp => {
          this.task_items = resp.data.length;
        })
        .catch(err => console.log(err));
    },
  },
  computed: {
    ...mapGetters([
                'getUser'
            ]),
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>