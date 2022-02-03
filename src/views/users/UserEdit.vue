<template>
  <div>
    <CRow>
      <CCard  class="col-sm-12 col-md-12">
        <CCardHeader>
          <center>
            <h5>
              {{entityFormInformation.name+' '+entityFormInformation.last_name}} 
            </h5>
          </center>
      </CCardHeader>
      
      </CCard>
      <formGenerator
        class="col-sm-12 col-md-12"
        :items="itemsFormInformation" 
        :entity="entityFormInformation" 
        @update="updateUser()">
        Editar Usuario
      </formGenerator>

      <formGenerator
        class="col-sm-12 col-md-12"
        :items="itemsFormSecurity" 
        :entity="entityFormSecurity" 
        @update="updatePassword()">
        Seguridad
      </formGenerator>
    </CRow>
  
    <CCard>
      <CCardHeader>
        <h5>
          Empresas
          <router-link :to="{ name: 'users.create' }">
            <CButton class="float-right py-0 mr-1" color="success">
              <CIcon name="cil-pencil" class="mr-2 cil-energy"></CIcon>
              Nuevo Empresa
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
              <td>{{item.business_name}}</td> 
              <td>
                <CIcon
                  name="cil-check"
                  style="color:green;"
                  height="25"
                  v-show="item.pivot.is_principal"/>
              </td> 
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
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import items from './user-edit-items';
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
  name: "UserEdit",
  components: { 
    formGenerator
  },
  data() {
    return {
      userId: null,
      itemsFormInformation: items.information,
      itemsFormSecurity: items.security,
      items : [],
      paginate : ['items'],
      entityFormInformation: {
        name : '',
        last_name : '',
        email : '',
        password : '',
        password_confirmation : ''
      },
      entityFormSecurity: {
        password : '',
        password_confirmation : ''
      },
      tableFields: [
        { key: "name", label: "Nombre" },
        { key: "business_name", label: "Razon Social", _classes: "text-center" },
        { key: "is_principal", label: "Prinicipal", _classes: "text-center" },
        { key: 'actions',label: 'Acciones',_style: { width: '1%' },sorter: false,filter: false },
      ],
    };
  },
  created() {
    this.userId = this.$route.params.id;
    this.getUser();
    this.getCompanies();
  },
  methods: {
    getUser() {
      axios
      .get(`/api/users/get/${this.userId}`)
      .then(res => {
        this.setUserInformation(res.data.data);
      })
      .catch(err => console.log(err));
    },
     getCompanies() {
      axios
      .get(`/api/companies/get/${this.userId}/user`)
      .then(res => {
        this.items = res.data.data
      })
      .catch(err => console.log(err));
    },
    updateUser() {
      const HTTP_OK = 200;

      axios
      .put(`api/users/edit/${this.userId}`,this.entityFormInformation)
      .then(res => {
        console.log(res.data.data);

        if (res.status == HTTP_OK) {
           Toast.fire({
            icon: 'success',
            title: 'MODIFICACION DE USUARIO COMPLETADA',
          })
          this.$router.go(-1);
        }
      })
      .catch(err => console.log(err));
    }, 
    updatePassword() {
      const HTTP_OK = 200;
      
      axios
      .put(`api/users/edit/${this.userId}/password`, this.entityFormSecurity)
      .then(res => {
        console.log(res.data);

        if (res.status == HTTP_OK) {
          Toast.fire({
            icon: 'success',
            title: 'CAMBIO DE CONTRASEÑA COMPLETADA',
          })
          this.$router.go(-1);
        }
      })
      .catch(err => console.log(err));
    },
    setUserInformation(user) {
      this.entityFormInformation = { ...user};
    }
  }
};

</script>

<style type="text/css">

canvas{
  vertical-align: middle;
  max-width: 100%;
  height: 300px
}
  .croppr-container * {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.croppr-container img {
  vertical-align: middle;
  max-width: 100%;
  height: 300px
}

.croppr {
  position: relative;
  display: inline-block;
}

.croppr-overlay {
  background: rgba(0,0,0,0.5);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  cursor: crosshair;
}

.croppr-region {
  border: 1px dashed rgba(0, 0, 0, 0.5);
  position: absolute;
  z-index: 3;
  cursor: move;
  top: 0;
}

.croppr-imageClipped {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;
}

.croppr-handle {
  border: 1px solid black;
  background-color: white;
  width: 10px;
  height: 10px;
  position: absolute;
  z-index: 4;
  top: 0;
}
</style>