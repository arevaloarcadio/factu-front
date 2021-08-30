<template>
  <div>
    <CRow>
      <CCol class="col-md-6 col-xs-12">
        <formGenerator
          :items="itemsForm"
          :entity="entityForm"
          @update="editTask()">
          Editar Tarea
        </formGenerator>
        <CCard class="col-md-12">
          <CCardHeader class="text-success py-1">
            <strong>Equipo</strong>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <div v-for="user in attachedUsers" class="mr-2 text-success text-center" data-title="Seleccionar como responsable" @click="setUserResponsable(user.id)">
                <img width="70px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE985qTr1hauge-1nv0jJbyFmZL5j_R9U-Ug&usqp=CAU" ><br>
                <small>
                  <strong>{{ user.firstname + ' ' + user.lastname }}</strong>
                </small>
                <br>
                <span v-if="user.pivot.is_responsable" class="badge badge-primary">Responsable</span>
              </div>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CRow>
              <CCol class="col-md-3">
                <label for="user" class="strong"><strong>Usuarios:</strong></label>
              </CCol>
              <CCol class="col-md-6">
                <multiselect v-model="selectedUsers"placeholder="Introduzca Nombre"  :options="users.map(type => type.id)"
                    :custom-label="opt => users.find(x => x.id == opt).firstname + ' '+ users.find(x => x.id == opt).lastname" :show-labels="false" :option-height="30" 
                    id="user" name="user" :multiple="true" :hide-selected="true">
                </multiselect>
              </CCol>
              <CCol class="col-md-3">
                  <button @click="attachUsers" class="btn btn-primary float-left">Añadir</button>
              </CCol>
            </CRow>
          </CCardFooter>
        </CCard>
      </CCol>
      <CCol class="col-md-6 col-xs-12">
        <CRow>
          <CCard class="col-sm-12">
            <CCardHeader class="py-1">
              <h5>
                Notas
                <router-link :to="{ name: 'notes.create', params: { id: taskId } }">
                  <CButton class="float-right py-0 mr-1" color="success">
                    <CIcon name="cil-pencil" class="mr-2 cil-energy"></CIcon>Nueva Nota
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
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { mapGetters } from 'vuex'


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
  name: "TaskEdit",
  components: { formGenerator, NoteTable },
  data() {
    return {
			itemsForm: items,
      current_endpoint: 'v1/tasks',
      taskId: null,
      customer : null,
      selectedUsers: [],
      attachedUsers: [],
      unit_ids : [],
      customers : [{id:null,name:'Seleccione'}],
      users: [],
      notes: [],
      entityForm: {
        subject:  '',
        description:  '',
        date: '',
        customer_id : '',
        status : ''
      },
    };
  },

  created()
  {
    this.taskId = this.$route.params.id;

    this.getTaskById();
    this.getNotes();
    this.getOrganizations()
    this.getAttachedUsers();
    
    //this.getCustomers()
    // this.getProductTypes();
    // this.setSelectedProduct();
	},
  mounted(){
     tinymce.init({
      selector: 'textarea#description_edit',
    });
    this.getTaskStatusByUser()
  },

  methods: {
    customLabel ({ firstname, lastname }) {
      return `${firstname} ${lastname}`
    },

    getTaskById()
    {
      axios.get(`${this.current_endpoint}/${this.taskId}`)
      .then(res => {
        this.setTaskInformation(res.data);
      }).catch(err => console.log(err));
    },
    getTaskStatusByUser()
    {
      axios.get(`${this.current_endpoint}/status/${this.getUser.id}/${this.taskId}`)
      .then(res => {
         this.entityForm.status = res.data.status
         document.getElementById('status').disabled = !res.data.creator
      }).catch(err => console.log(err));
    },
    getCustomer(data) {
      if( data.customer != null){
        axios
        .get("v1/customers/"+data.customer)
        .then(res => {
        
        this.entityForm.subject =   data.subject
        //this.entityForm.description_edit = data.description
        tinymce.activeEditor.setContent(data.description)
        this.entityForm.date =  data.date
        this.entityForm.customer =  res.data.firstname+' '+res.data.lastname
        this.entityForm.customer_id =  res.data.id
       
  
        })
        .catch((err) => console.log(err));   
      }else{
        this.entityForm.subject =   data.subject
        //this.entityForm.description_edit = data.description
        tinymce.activeEditor.setContent(data.description)
        this.entityForm.date =  data.date
        this.entityForm.customer =  'Sin cliente'
       
  
      }
      

  //this.entityForm = { ...this.entityForm };
    },
    setCustomer() {
      this.itemsForm[0].campos[3].opciones = this.customers;
      this.itemsForm = { ...this.itemsForm };
    },
      getOrganizations(){
       axios.get('organizations/mine')
        .then(resp => {

          let organizations = resp.data
          for (var i = 0; i < organizations.length; i++) {
            this.unit_ids.push(organizations[i].unit_id)
          }

          this.getUsers(); 
          resolve(resp)
        })
        .catch(err => {
          //commit('auth_error', err)
          //reject(err)
        });
    },

    setTaskInformation(data)
    {
      let date = new Date(data.date)
      this.getCustomer(data)
    },

    editTask()
    {
      const HTTP_OK = 200;
      this.entityForm.description = tinyMCE.activeEditor.getContent();
			axios
        .put(`${this.current_endpoint}/${this.taskId}`, this.entityForm)
        .then(res => {
          if (res.status == HTTP_OK) {
            console.log(res.data);
            Toast.fire({
              icon: 'success',
              title: 'Operación completada',
            })
            // this.showSuccessMsg();
           // this.$router.go(-1)
          }
        })
        .catch(err => console.log(err));
    },
    setUserResponsable(user_id)
    {
      const HTTP_OK = 200;

      axios
        .put(`${this.current_endpoint}/${this.taskId}/responsable/${user_id}`)
        .then(res => {
          if (res.status == HTTP_OK) {
            Toast.fire({
              icon: 'success',
              title: 'Operación completada',
            })
            this.getAttachedUsers();
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

    getAttachedUsers() {
      axios
        .get(`v1/tasks/${this.taskId}/users`)
        .then(res => {
          console.log(res.data);
          this.attachedUsers = res.data
        })
        .catch(err => console.log(err));
    },
    attachUsers() {
      const HTTP_CREATED = 201;
      
      const users = {
        users:  this.selectedUsers
      };
      
      axios
        .post(`v1/tasks/${this.taskId}/users`, users)
        .then(res => {
          this.selectedUsers = null
           this.getAttachedUsers();
            Toast.fire({
              icon: 'success',
              title: 'Operación completada',
            })
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
   ...mapGetters([
        'getUser'
    ]),
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
  [data-title]:hover:after {
    opacity: 1;
    transition: all 0.1s ease 0.5s;
    visibility: visible;
}

[data-title]:after {
    content: attr(data-title);
    background-color: #3c4b64;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    position: absolute;
    padding: 3px 20px;
    bottom: -1.6em;
    left: 100%;
    white-space: nowrap;
    box-shadow: 1px 1px 3px #222222;
    opacity: 0;
    border: 1px solid #111111;
    z-index: 99999;
    visibility: hidden;
    border-radius: 6px;
    
}
[data-title] {
    position: relative;
}
</style>

