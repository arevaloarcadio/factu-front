<template>
  <div>
    <formGenerator
      :items="itemsForm"
      :entity="entityForm"
      @update="createTask()">
      Crear Tarea
    </formGenerator>
 

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
          <!--<CCol class="col-md-3">
              <button @click="getSelecteUnit" class="btn btn-primary float-left">Añadir</button>
          </CCol>-->
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
import items from './task-create-items';
let tomorrow = new Date();
tomorrow.setDate(new Date().getDate()+1)

export default {
  name: "TaskCreate",
  components: { formGenerator },
  data() {
    return {
      next_day: tomorrow,
      current_endpoint: 'v1/tasks',
      entity: "Tarea",
      newEntity: "Nueva Tarea",
      product_types: [],
      customers: [],
      customer : null,
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
    // this.getItems("v1/customers");
		// this.getItems("product_types");
		 this.getCustomers();
		// this.getProductTypes();
  },
  computed: {
    ...mapGetters(["getUser"]),
  },

  watch:{

    // 'entityForm.date'(val)
    // {
    //   console.log(val)
    //   // let current_date = `${this.next_day.getFullYear()}-${this.next_day.getMonth()}-${this.next_day.getDay()}`

    //   let tomorrow = new Date();
    //   tomorrow.setDate(new Date().getDate()+1)

    //   // let currentFullYear = this.next_day.getFullYear()
    //   // let currentFullMoth = this.next_day.getMonth() < 10 ? 0+''+this.next_day.getMonth() : this.next_day.getMonth()
    //   // let currentFullDay = this.next_day.getDay() < 10 ? 0+''+this.next_day.getDay() : this.next_day.getDay()

    //   let tomorrow_object = {
    //     year: tomorrow.getFullYear(),
    //     moth: tomorrow.getMonth(),
    //     day: tomorrow.getDay(),
    //   }

    //   // let currentFullTomorrowDate = `${currentFullYear}-${currentFullMoth}-${currentFullDay}`

    //   console.log([tomorrow_object, 'currentFullTomorrowDate'])
    // }

  },

  methods: {

    getCustomer($event){
      console.log($event)
    },
    createTask()
    {
			const HTTP_CREATED = 201;
			
			const data = { ...this.entityForm, customer_id : this.customer == null ? null :  this.customer[0]  }
    
    	axios
			.post(this.current_endpoint, data)
			.then(res => {
				if (res.status == HTTP_CREATED) {
					// this.showSuccessMsg();
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
