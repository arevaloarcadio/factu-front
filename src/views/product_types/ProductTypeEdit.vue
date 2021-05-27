<template>
  <div>
    <CRow>
      <CCol class="col-md-12 col-xs-12">
        <formGenerator
          :items="itemsForm"
          :entity="entityForm"
          @update="editProductType()">
          Editar Tipo de Producto
        </formGenerator>

      </CCol>
    </CRow>
 </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import items from './product-type-edit-items';
import NoteTable from "@/views/tasks/notes/components/NoteTable.vue";
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
  name: "ProductTypeEdit",
  components: { formGenerator, NoteTable },
  data() {
    return {
			itemsForm: items,
      product_type_id: null,
       entityForm: {
        description:  '',
        name:  '',
      },
    };
  },

  created()
  {
    this.product_type_id = this.$route.params.id;
    this.getProductTypeById()
  },

  methods: {
    getProductTypeById()
    {
      axios.get('product_types/'+this.product_type_id)
      .then(res => {
        this.setProductTypeInformation(res.data);
      }).catch(err => console.log(err));
    },
    setProductTypeInformation(data)
    {
      this.entityForm = {
        name:      data.name,
        description:  data.description,
      };
      this.entityForm = { ...this.entityForm };
    },
     editProductType()
    {
      const HTTP_OK = 200;

      axios
        .put('product_types/'+this.product_type_id, this.entityForm)
        .then(res => {
          if (res.status == HTTP_OK) {
            console.log(res.data);
            Toast.fire({
              icon: 'success',
              title: 'Operación completada',
            })
            // this.showSuccessMsg();
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
  },
  computed: {
    groups: {
      get () { 
        return this.selectedUsers.map(value => this.users.find(option => option.key === value))
      },
      set (v) {
        this.selectedUsers = v.map(value => value.key)
      }
    }
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style type="text/css">
   #description{
     margin: 1%;
  }
</style>

