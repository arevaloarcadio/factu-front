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
      entityFormInformation: {
        name : '',
        last_name : '',
        email : '',
        password : '',
        password_confirmation : '',
        cif : '',
        tax_data_name : '',
        business_name : '',
        code_postal : '',
        description : '',
      },
      entityFormSecurity: {
        password : '',
        password_confirmation : ''
      }
    };
  },
  created() {
    this.userId = this.$route.params.id;
    this.getUser();
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
    updateUser() {
      const HTTP_OK = 200;

      let data = {
        user : {
          name : this.entityFormInformation.name,
          last_name : this.entityFormInformation.last_name,
          email : this.entityFormInformation.email,
          user_name : this.entityFormInformation.user_name,
          password : this.entityFormInformation.password,
          password_confirmation : this.entityFormInformation.password_confirmation
        },
        tax_data : {
          cif : this.entityFormInformation.cif,
          name : this.entityFormInformation.tax_data_name,
          business_name : this.entityFormInformation.business_name,
          code_postal : this.entityFormInformation.code_postal,
          description : this.entityFormInformation.description
        }
      }
      
      axios
      .put(`api/users/edit/${this.userId}`,data)
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
      this.entityFormInformation = { ...user,...user.tax_data, tax_data_name : user.tax_data.name};
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