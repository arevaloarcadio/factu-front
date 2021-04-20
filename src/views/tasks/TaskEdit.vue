<template>
  <div>
    <CRow>
      <CCol class="col-md-4 col-xs-12">
        <formGenerator
          :items="itemsForm"
          :entity="entityForm"
          @update="editTask()">
          Editar Tarea
        </formGenerator>
      </CCol>
      <CCol class="col-md-8 col-xs-12">
        <CRow>
          <label for="user">Usuarios:</label>
          <multiselect v-model="selectedUsers" placeholder="Introduzca Nombre"  :options="users.map(type => type.id)"
            :custom-label="opt => users.find(x => x.id == opt).firstname + ' '+ users.find(x => x.id == opt).lastname" :show-labels="false" :option-height="30" 
            id="user" name="user" :multiple="true" :hide-selected="true">
          </multiselect>
          <button @click="sendUsers">Añadir</button>
          <div v-for="user in users">
            
          </div>
        </CRow>
        <CRow>
          <CCard class="col-sm-12">
            <CCardHeader class="py-1">
              <h5>
                Notas
                <router-link :to="{ name: 'notes.create', params: { id: taskId } }">
                <CButton class="float-right py-0 mr-1" color="success">
                  <CIcon name="cil-pencil" class="mr-2 cil-energy"></CIcon>
                  Nueva Tarea
                </CButton>
                </router-link>
              </h5>
            </CCardHeader>
            <CCardBody class="py-2">
              <NoteTable :items="notes"></NoteTable>
            </CCardBody>
          </CCard>
        </CRow>
      </CCol>
    </CRow>

  </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import items from './task-edit-items';
import NoteTable from "@/views/tasks/notes/components/NoteTable.vue";

export default {
  name: "TaskEdit",
  components: { formGenerator, NoteTable },
  data() {
    return {
			itemsForm: items,
      current_endpoint: 'v1/tasks',
      taskId: null,
      selectedUsers: [],
      users: [],
      notes: [],
      entityForm: {
        subject:  '',
        description:  '',
        date: '',
      },
    };
  },

  created()
  {
    this.taskId = this.$route.params.id;
    this.getTaskById();
    this.getNotes();
    this.getUsers();
    // this.getProductTypes();
    // this.setSelectedProduct();
	},

  methods: {
    customLabel ({ firstname, lastname }) {
      return `${firstname} ${lastname}`
    },

    getTaskById()
    {
      axios.get(`${this.current_endpoint}/${this.taskId}`).then(res => {
        this.setTaskInformation(res.data);
      }).catch(err => console.log(err));
    },

    setTaskInformation(data)
    {
      let date = new Date(data.date)

      console.log([date.toDateString(), date])

      this.entityForm = {
        subject:      data.subject,
        description:  data.description,
        date:         data.date,
      };

      this.entityForm = { ...this.entityForm };
    },

    editTask()
    {
      const HTTP_OK = 200;

			axios
        .put(`${this.current_endpoint}/${this.taskId}`, this.entityForm)
        .then(res => {
          if (res.status == HTTP_OK) {
            console.log(res.data);
            // this.showSuccessMsg();
            this.$router.go(-1)
          }
        })
        .catch(err => console.log(err));
    },

    getNotes() {      
      axios
        .get(`v1/tasks/${this.taskId}/notes`)
        .then(res => {
          this.notes = res.data;
        })
        .catch(err => console.log(err));
    },

    getUsers() {      
      axios
        .get(`users`)
        .then(res => {
          this.users = res.data;
        })
        .catch(err => console.log(err));
    },
    sendUsers() {
      const HTTP_CREATED = 201;
      
      const users = {
        users:  this.selectedUsers
      };
      
      axios
        .post(`v1/tasks/${this.taskId}/users`, users)
        .then(res => {
          console.log(res.data);

          if (res.status == HTTP_CREATED) {
            // this.showSuccessMsg();
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

