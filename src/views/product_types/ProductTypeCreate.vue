<template>
  <div>
    <formGenerator
      :items="itemsForm"
      :entity="entityForm"
      @update="createProductType()"
      >
     Crear Tipo de Producto
    </formGenerator>

  </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import { mapGetters } from "vuex";
import items from './product-type-create-items';
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

let tomorrow = new Date();
tomorrow.setDate(new Date().getDate()+1)

export default {
  name: "ProductTypeCreate",
  components: { formGenerator },
  data() {
    return {
      next_day: tomorrow,
      entity: "Tipo de Producto",
      newEntity: "Nuevo Tipo de Producto",
      itemsForm: items,
      entityForm: {
        description:  '',
        name:  '',
      },
    };
  },
  created() {
  },
  methods: {
 
   createProductType()
    {
      const HTTP_CREATED = 201;
      
      const data = { ...this.entityForm}
    
      axios
      .post('product_types', data)
      .then(res => {
        if (res.status == HTTP_CREATED) {
            Toast.fire({
              icon: 'success',
              title: 'CREACION DE TIPO PRODUCTO COMPLETADA',
            })
          this.$router.go(-1)
        }
      })
      .catch(err => console.log(err));
    },
  },
  
  notifications: {
    showSuccessMsg: {
      type: VueNotifications.types.success,
      title: "Operación completada",
      message: "Registro añadido con éxito!",
    },
    showErrorMsg: {
      type: VueNotifications.types.error,
      title: "Operación rechazada",
      message: "Algo salió mal",
    },
  }
};
</script>

<style type="text/css">
  #subject{
    margin: 1%;
  }
  #description{
     margin: 1%;
  }
  #date{
    margin-top: 2%;
  }
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
