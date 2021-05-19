<template>
  <div>
    <formGenerator
      :items="itemsForm" 
      :entity="entityForm" 
      @update="createUser()">
      Crear Usuario
    </formGenerator>
    
    <CCard class="col-md-12">
      <CCardHeader class="text-success py-1">
        <strong>Asignación de Unidades</strong>
      </CCardHeader>
      <CCardFooter>
        <CRow>
          <CCol class="col-md-3">
            <label for="user" class="strong"><strong>Unidades:</strong></label>
          </CCol>
          <CCol class="col-md-6">
            <multiselect v-model="selectedUnits" placeholder="Introduzca las Unidades"  :options="units.map(type => type.id)"
                :custom-label="opt => units.find(x => x.id == opt).name" :show-labels="false" :option-height="30" 
                id="user" name="user" :multiple="true" :hide-selected="true">
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
import items from './user-create-items';
import { mapGetters } from "vuex";
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
  name: "UserCreate",
  components: { formGenerator },
  data() {
    return {
      itemsForm: items,
      entityForm: {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        unit_ids :  []
      },
      units : [],
      selectedUnits : []
    };
  },
  mounted(){
     this.getUnit();
  },
  computed: {
    ...mapGetters(["getUnitId"])
  },
  methods: {
    createUser() {
      const HTTP_CREATED = 201;
      var selected_units =  this.selectedUnits
      this.entityForm.unit_ids = selected_units;

      axios
        .post("v1/users", this.entityForm)
        .then(res => {
          console.log(res.data);

          if (res.status == HTTP_CREATED) {
             Toast.fire({
              icon: 'success',
              title: 'Operación completada',
            })
            this.$router.go(-1);
          }
        })
        .catch(err => console.log(err));
    },
    getUnit() {
        axios
        .get("units")
        .then(resp => {
          console.log(resp.data)
          this.units = resp.data;
           resolve(resp)
        })
        .catch(err => {
          //commit('auth_error', err)
          //reject(err)r
        });
    },
    getSelecteUnit($event){
      console.log($event)
    }
  },
  computed: {
    groups: {
      get () { 
        return this.selectedUnits.map(value => this.units.find(option => option.key === value))
      },
      set (v) {
        this.selectedUnits = v.map(value => value.key)
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


<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
