<template>
  <div>
    <formGenerator
      :items="itemsForm"
      :entity="entityForm"
      @blur="blur($event)"
      @update="createReminder()"
      >
      Crear Recordatorio
    </formGenerator>

    <CCard class="col-md-12" id="periodicity" >
      <CCardHeader class="text-success py-1">
        <strong>Definir Periodicidad</strong>
      </CCardHeader>
      <CCardFooter>
        <CRow v-if="entityForm.date_when !== '' && entityForm.date_reminder !== ''">
          <CCardHeader class="text-primary py-1">
            <strong  v-html="see_periodicity()"></strong>
          </CCardHeader>
        </CRow >
        <CRow  v-if="entityForm.date_when === '' || entityForm.date_reminder === ''">
          
        </CRow >
      </CCardFooter>
    </CCard>

   <CCard class="col-md-12">
      <CCardHeader class="text-success py-1">
        <strong>Agregar Cliente</strong> <small>(Opcional)</small>
      </CCardHeader>
      <CCardFooter>
        <CRow>
          <CCol class="col-md-3">
            <label for="user" class="strong"><strong>Clientes:</strong></label>
          </CCol>
          <CCol class="col-md-6">
            <multiselect v-model="customer"  placeholder="Introduzca el cliente"  :options="customers.map(type => type.id)"
                :custom-label="opt => customers.find(x => x.id == opt).firstname+' '+customers.find(x => x.id == opt).lastname" :show-labels="false" :option-height="30" 
                id="customer" name="customer" :multiple="false" :hide-selected="true">
            </multiselect>
          </CCol>
        </CRow>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import { mapGetters } from "vuex";
import items from './reminder-create-items';
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
  name: "ReminderCreate",
  components: { formGenerator },
  data() {
    return {
      next_day: tomorrow,
      entity: "Recordatorio",
      newEntity: "Nuevo Recordatorio",
      customer_id : null,
      product_types: [],
      customers: [],
      customer : null,
      identifier: "",
			itemsForm: items,
      entityForm: {
        description:  '',
        periodicity : '',
        date_when : '',
        date_reminder : ''
      },
    };
  },
  created() {
    this.getCustomers();
    this.entityForm.periodicity = 'Anual'
  },
  computed: {
    ...mapGetters(["getUser"]),
  },
  methods: {
    see_periodicity(){
      let day = parseInt(new Date(this.entityForm.date_reminder).toLocaleString().split('/')[0]) + 1;
      let month = parseInt(new Date(this.entityForm.date_reminder).toLocaleString().split('/')[1]);

       if ( this.entityForm.periodicity == 'Anual') {
          return 'Se le notificará el día '+ day +' del mes '+ month +' este recordatorio cada año';
       }
       if ( this.entityForm.periodicity == 'Mensual') {
          return 'Se le notificará el día '+ day +' este recordatorio cada mes';
       }
       if ( this.entityForm.periodicity == 'Sin Periodicidad') {
          return 'Se le notificará la fecha '+this.entityForm.date_reminder+' este recordatorio';
       }
    },
    createReminder()
    {
			const HTTP_CREATED = 201;
			
			const data = { ...this.entityForm, customer_id : this.customer}
    
    	axios
			.post('reminders', data)
			.then(res => {
				if (res.status == HTTP_CREATED) {
					  Toast.fire({
              icon: 'success',
              title: 'Operación completada',
            })
					this.$router.go(-1)
				}
			})
			.catch(err => console.log(err));
    },

		getCustomers() {
			
			axios
        .get("v1/customers")
        .then(res => {
					this.customers = res.data;
					//this.setCustomers(this.customers);
        })
        .catch((err) => console.log(err));
		},

    setCustomers(customers) {
			const options = this.customers.map(c => {
				return { id: c.id, name: `${c.firstname} ${c.lastname}` };
			});
    },
    blur($event){
      if (this.date_when == null) {
        this.entityForm.date_when = $event.value;
      }
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
