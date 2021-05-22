<template>
  <div>
    <formGenerator
      :items="itemsForm"
      :entity="entityForm"
      @update="editProduct()">
      Editar Producto
    </formGenerator>
  </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import items from './product-edit-items';
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
  name: "ProductEdit",
  components: { formGenerator },
  data() {
    return {
			itemsForm: items,
      entityForm: {
        customer_id: 0,
        product_type_id: 0,
        identifier: "",
        status: "",
      },
    };
  },
  created() {
    this.getProductTypes();
    this.setSelectedProduct();
	},
  methods: {
    editProduct() {
      const HTTP_OK = 200;

      const data = {
        productId:     this.$route.params.productId,
        productTypeId: this.entityForm.product_type_id,
        identifier:    this.entityForm.identifier,
        status:        this.entityForm.status,
        customerId:    this.$route.params.customerId 
      };
			axios
        .put(`v1/products/${data.productId}`, data)
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
		getProductTypes() {
			
			axios
        .get("product_types")
        .then(res => {
					this.setProductTypes(res.data);
        })
        .catch((err) => console.log(err));
    },
    setSelectedProduct() {
      this.entityForm.product_type_id = this.$route.query.product_type;
      this.entityForm.identifier = this.$route.query.identifier;
      this.entityForm.status = this.$route.query.status;
      this.entityForm = { ...this.entityForm };
    },
		
		
		// setters
    setProductTypes(productTypes) {
			this.itemsForm[0].campos[0].opciones = productTypes;
			this.itemsForm = { ...this.itemsForm };
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
