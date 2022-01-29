<template>
  <div>
    <CCard>
      <CCardHeader>
        <h5>
          Usuarios
          <router-link :to="{ name: 'users.create' }">
            <CButton class="float-right py-0 mr-1" color="success">
              <CIcon name="cil-pencil" class="mr-2 cil-energy"></CIcon>
              Nuevo Usuario
            </CButton>
          </router-link>
        </h5>
      </CCardHeader>

      <CCardBody class="py-2" v-if="items">

        <table class="table table-responsive-sm table-striped">
           <thead >
            <tr>
              <th v-for="field in tableFields" :class="{true : field._classes !== undefined }">{{field.label}}</th>
            </tr>
          </thead>
          <paginate name="items" :list="items" :per="10" tag="tbody">
            <tr v-if="items.length == 0">
                <td :colspan="tableFields.length">
                  <center>
                    <h4 style="margin: 0;">
                      Sin  registros
                    </h4>
                  </center>
                </td>
              </tr>
            <tr v-for="item in paginated('items')">
              <td>{{item.name}}</td> 
              <td>{{item.last_name}}</td> 
              <td>{{item.email}}</td> 
              <td slot="actions">
                <router-link :to="{ name: 'users.edit', params: { id: item.id } }">
                  <CButton class="m-2 btn--link" size="sm" color="warning">Editar</CButton>
                </router-link>
              </td>    
            </tr>
          </paginate>
        </table>
         
         <paginate-links for="items" :limit="10" :show-step-links="true" :classes="{'ul': 'pagination', 'li': 'page-item', 'a': 'page-link'}"></paginate-links>

      </CCardBody>
      
    </CCard>
  </div>
</template>

<script>
import axios from "axios";
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import VuePaginate from 'vue-paginate'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2/dist/sweetalert2.js'

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

export default {
  name: "UserPage",
  components: { formGenerator },
  data() {
    return {
      items: [],
      paginate : ['items'],
      tableFields: [
        { key: "name", label: "Nombre" },
        { key: "last_name", label: "Apellido", _classes: "text-center" },
        { key: "email", label: "Email", _classes: "text-center" },
        { key: 'actions',label: 'Acciones',_style: { width: '1%' },sorter: false,filter: false },
      ],
    };
  },
  created() {
    this.getUsers();
  },
  computed: {
     ...mapGetters([
        'getUser'
    ]),
  },
  methods: {
    getUsers() {
      axios
      .get(`/api/users/get`)
      .then(res => {
        this.items = res.data.data;
      })
      .catch(err => console.log(err));
    }
  },
  notifications: {
    showSuccessMsg: {
      type: VueNotifications.types.success,
      title: "Operación completada",
      message: "Usuario añadido con éxito!",
    },
    showErrorMsg: {
      type: VueNotifications.types.error,
      title: "Operación rechazada",
      message: "Algo salió mal",
    },
  },
};
</script>

<style lang="scss" scoped>
.btn--link { color: #FFF }
</style>
