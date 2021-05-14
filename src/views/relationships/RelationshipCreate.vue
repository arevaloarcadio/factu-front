<template>
  <div>


     <CCard class="col-md-12">
      <CCardHeader class="text-success py-1">
        <strong>Selecionar Cliente</strong>
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

    <formGenerator
      :items="itemsForm"
      :entity="entityForm"
      @update="createRelationship()">
      Crear Parentezco
    </formGenerator>
 


  </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import { mapGetters } from "vuex";
import items from './relationship-create-items';
let tomorrow = new Date();
tomorrow.setDate(new Date().getDate()+1)

export default {
  name: "RelationshipCreate",
  components: { formGenerator },
  data() {
    return {
      entity: "Parentezco",
      newEntity: "Editar Parentezco",
      customer_id : null,
      customers: [],
      customer : null,
     	itemsForm: items,
      entityForm: {
        description:  '',
      },
    };
  },
  created() {
    this.getCustomers();
    this.customer_id = this.$route.params.customerId !== undefined ? this.$route.params.customerId : null
  },
  computed: {
    ...mapGetters(["getUser"]),
  },


  methods: {
    createRelationship()
    {
			const HTTP_OK = 200;
			
			const data = { ...this.entityForm, relationship_customer_id : this.customer}
    
    	axios
			.post('v1/customers/'+this.customer_id+'/relationships', data)
			.then(res => {
				if (res.status == HTTP_OK) {
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
					this.setCustomers();
        })
        .catch((err) => console.log(err));
		},
    setCustomers() {

      for(var i in this.customers){
        if(this.customers[i].id == this.customer_id){
            this.customers.splice(i,1);
            break;
        }
      }

			const options = this.customers.map(c => {
    		  return { id: c.id, name: `${c.firstname} ${c.lastname}` };
    	});

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
