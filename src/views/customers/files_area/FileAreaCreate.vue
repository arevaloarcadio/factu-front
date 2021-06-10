<template>
  <div>
    <formGenerator
      :items="itemsForm" 
      :entity="entityForm" 
      @update="createFile()">
      Crear Nota
    </formGenerator>
      <FileAreaAttached v-bind:customerId="customerId" ref="FileAreaAttached"></FileAreaAttached>
  </div>

</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import items from './file-area-create-items';
import FileAreaAttached from "./components/FileAreaAttached.vue";
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
  name: "FileAreaCreate",
  components: { formGenerator,FileAreaAttached },
  data() {
    return {
      itemsForm: items,
      customerId: 0,
      entityForm: {
        description: "",
      },
    };
  },
  created() {
    this.customerId = this.$route.params.customerId;
  },
  methods: {
    createFile() {
      
      var formData = new FormData();

      formData.append('customerId',this.customerId);
      formData.append('description',this.entityForm.description);
      
      for(var i = 0; i < this.$refs.FileAreaAttached.upload_files.length; i++ ){
        formData.append('files[]',this.$refs.FileAreaAttached.upload_files[i])
      }
      
      const HTTP_CREATED = 201;

      axios
        .post(`v1/customers/${this.customerId}/file`, formData,{ 'Content-Type': 'multipart/form-data' })
        .then(res => {
          console.log(res.data);

          if (res.status == HTTP_CREATED) {
            // this.showSuccessMsg();
            Toast.fire({
              icon: 'success',
              title: 'Operación completada',
            })
            this.$router.go(-1);
          }
        })
        .catch(err => console.log(err));

    }
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
  #description{
    margin: 1%;
  }
</style>
