<template>
  <div>
    <CRow>
      <CCol class="col-md-12 col-xs-12">
        <formGenerator
          :items="itemsForm"
          :entity="entityForm"
          @update="editReminder()">
          Editar Recordatorio
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
              </CRow>
            </CCardFooter>
          </CCard>
      </CCol>
    </CRow>
 </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import items from './reminder-edit-items';
import NoteTable from "@/views/tasks/notes/components/NoteTable.vue";

export default {
  name: "ReminderEdit",
  components: { formGenerator, NoteTable },
  data() {
    return {
			itemsForm: items,
      taskId: null,
      selectedUsers: [],
      attachedUsers: [],
      unit_ids : [],
      customers : [{ id : null , name : 'Seleccione' }],
      customer : '',
      users: [],
      notes: [],
      entityForm: {
        description:  '',
        status:  '',
      },
    };
  },

  created()
  {
    this.reminderId = this.$route.params.id;
    this.getCustomers()
    this.getReminderById()
  },

  methods: {
    customLabel ({ firstname, lastname }) {
      return `${firstname} ${lastname}`
    },

    getReminderById()
    {
      axios.get(`reminders/${this.reminderId}`)
      .then(res => {
        console.log(res.data)
        this.setReminderInformation(res.data);
      }).catch(err => console.log(err));
    },
    getCustomers() {
      axios
        .get("v1/customers")
        .then(res => {
          this.customers = res.data;
        })
        .catch((err) => console.log(err));
    },
    setReminderInformation(data)
    {
      this.entityForm = {
        description: data.description,
        status : data.status
      };
      this.customer = data.customer_id;
      this.entityForm = { ...this.entityForm };
    },

    editReminder()
    {
      const HTTP_OK = 200;

      const data = { ...this.entityForm, customer_id : this.customer}

			axios
        .put(`reminders/${this.reminderId}`,data)
        .then(res => {
          if (res.status == HTTP_OK) {
            console.log(res.data);
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

