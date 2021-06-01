<template>
  <div>
    <formGenerator
      :items="itemsForm"
      :entity="entityForm"
      @update="createTask()">
      Crear Tarea
    </formGenerator>
    
  <CCol class="col-md-12 col-xs-12"> 
    <CCard class="col-md-12">
      <CCardHeader class="text-success py-1">
        <strong>Equipo</strong>
      </CCardHeader>
      <CCardBody>
           <CRow>
          <CCol class="col-md-3">
            <label for="user" class="strong"><strong>Usuarios:</strong></label>
          </CCol>
          <CCol class="col-md-6">
            <multiselect v-model="selectedUsers" placeholder="Introduzca Nombre"  :options="users.map(type => type.id)"
                :custom-label="opt => users.find(x => x.id == opt).firstname + ' '+ users.find(x => x.id == opt).lastname" :show-labels="false" :option-height="30" 
                id="user" name="user" :multiple="true" :hide-selected="true">
            </multiselect>
          </CCol>
        </CRow>

      </CCardBody>
    </CCard>
  </CCol>
  </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import { mapGetters } from "vuex";
import items from './task-create-items';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import TheHeaderDropdownAccnt from "@/containers/TheHeaderDropdownAccnt.vue";

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
  name: "TaskCreate",
  components: { formGenerator,TheHeaderDropdownAccnt },
  data() {
    return {
      next_day: tomorrow,
      current_endpoint: 'v1/tasks',
      entity: "Tarea",
      newEntity: "Nueva Tarea",
      customer_id : null,
      product_types: [],
      customers: [],
      customer : null,
      users: [],
      selectedUsers:[],
      identifier: "",
			itemsForm: items,
      entityForm: {
        subject:  '',
        description:  '',
        date: '',
      },
    };
  },
  created() {
    this.getUsers();
    //this.getCustomers();
    this.customer_id = this.$route.params.customerId !== undefined ? this.$route.params.customerId : null

  },
  computed: {
    ...mapGetters(["getUser"]),
  },
  methods: {

    getUsers() {      
      axios
         .get(`users`)
        .then(res => {
          this.users = res.data;
          for(var i in this.users){
            if(this.users[i].id == this.getUser.id){
                this.users.splice(i,1);
                break;
            }
          }
        })
        .catch(err => console.log(err));
    },
    getCustomer($event){
      console.log($event)
    },
    createTask()
    {
			const HTTP_CREATED = 201;
			
			const data = { 
        ...this.entityForm,
        customer_id : this.customer_id,
        user_ids : this.selectedUsers
      }
    
    	axios
			.post(this.current_endpoint, data)
			.then(res => {
				if (res.status == HTTP_CREATED) {
					  Toast.fire({
              icon: 'success',
              title: 'Operación completada',
            })
          this.$router.push({ name: 'tasks.edit', params: { id: res.data.task.id } })
				}
			})
			.catch(err => console.log(err));
    },

		getCustomers() {
			
			axios
        .get("v1/customers")
        .then(res => {
					this.customers = res.data;
					this.setCustomers(this.customers);
        })
        .catch((err) => console.log(err));
		},

		// getProductTypes()
    // {	
		// 	axios
    //     .get("product_types")
    //     .then(res => {
		// 			this.product_types = res.data;
		// 			this.setProductTypes(this.product_types);
    //     })
    //     .catch((err) => console.log(err));
		// },
		
		
		// setters
    setCustomers(customers) {
			const options = this.customers.map(c => {
				return { id: c.id, name: `${c.firstname} ${c.lastname}` };
			});

      this.itemsForm[0].campos[0].opciones = options;
			this.itemsForm = { ...this.itemsForm };
    },
    // setProductTypes(productTypes) {
		// 	this.itemsForm[0].campos[0].opciones = productTypes;
		// 	this.itemsForm = { ...this.itemsForm };
    // }
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
