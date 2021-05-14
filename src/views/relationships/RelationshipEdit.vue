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
      @update="updateRelationship()">
      Crear Parentezco
    </formGenerator>
 </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import items from './relationship-edit-items';

export default {
  name: "RelationshipEdit",
  components: { formGenerator },
  data() {
    return {
		   entity: "Parentezco",
      newEntity: "Nuevo Parentezco",
      customer_id : null,
      customers: [],
      customer : null,
      itemsForm: items,
      entityForm: {
        description:  '',
      },
    };
  },

  created()
  {
    this.getCustomers();
    this.customer_id = this.$route.params.customerId !== undefined ? this.$route.params.customerId : null;
  },
  methods: {
    customLabel ({ firstname, lastname }) {
      return `${firstname} ${lastname}`
    },
      updateRelationship()
    {
      const HTTP_OK = 200;
      
      const data = { ...this.entityForm, relationship_customer_id : this.customer}
    
      axios
      .put('v1/customers/'+this.customer_id+'/relationships', data)
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
         
        })
        .catch((err) => console.log(err)).
        finally(() => {
           this.setCustomers();
        });
    },
    setCustomers() {
      for(var i in this.customers){
        if(this.customers[i].id == this.customer_id){
            this.customers.splice(i,1);
            break;
        }
      }
      this.customer = this.$route.query.relationship_customer_id
      this.entityForm.description = this.$route.query.description;
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
