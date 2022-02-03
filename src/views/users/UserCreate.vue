<template>
  <div>
    <formGenerator v-if="step == 1"
      :items="itemsForm1" 
      :entity="entityFormUser" 
      @update="createUser()"
      @blur="validateDNI($event)">
      Crear Usuario
    </formGenerator>

    <!--
    <formGenerator 
      :items="itemsForm2" 
      :entity="entityFormCompany" 
      @update="createUser()"
      @blur="validateDNI($event)">
      Crear Empresas
    </formGenerator>
    -->

    <ValidationObserver  v-slot="{ invalid }"  v-if="step == 2" >
      <div  class="card shadow">
        <div class="card-header py-1">
          <span class="text-success"><b>Crear Empresas</b></span>
        </div>
        <div>
          <div  v-for="(company,key) in companies" card="card-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-12">
                  <span class="text-info"><b><u>Empresa {{key+1}} </u></b></span>
                </div>
              </div>
              <div class="row pt-2">
                <div class="col-md-4">
                  <label class="typo__label mb-0 text-dark">CIF</label>
                  <ValidationProvider :name="'CIF'" :rules="'required|min:3'" v-slot="{ errors, validate }">
                      <input type="text"  @blur="validateDNI($event)"  class="form-control" v-model="companies[key].cif" placeholder="Introduzca el CIF" >
                      <span class="small text-danger">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
                <div class="col-md-4">
                  <label class="typo__label mb-0 text-dark">Nombre</label>
                  <ValidationProvider :name="'Nombre'" :rules="'required|min:3'" v-slot="{ errors, validate }">
                      <input type="text"  class="form-control" v-model="companies[key].name" placeholder="Introduzca el nombre" >
                      <span class="small text-danger">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
                <div class="col-md-4">
                  <label class="typo__label mb-0 text-dark">Razón Social</label>
                  <ValidationProvider :name="'Razon Social'" :rules="'required|min:3'" v-slot="{ errors, validate }">
                      <input type="text" class="form-control" v-model="companies[key].business_name" placeholder="Introduzca la razón social" >
                      <span class="small text-danger">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
                <div class="col-md-4">
                  <label class="typo__label mb-0 text-dark">Código postal</label>
                  <ValidationProvider :name="'Código Postal'" :rules="'required|min:3'" v-slot="{ errors, validate }">
                      <input type="text" class="form-control" v-model="companies[key].code_postal" placeholder="Introduzca la  código postal" >
                      <span class="small text-danger">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
                <div class="col-md-4">
                  <label class="typo__label mb-0 text-dark">Descripción</label>
                  <ValidationProvider :name="'Descripción'" :rules="'required|min:3'" v-slot="{ errors, validate }">
                      <textarea class="form-control" v-model="companies[key].description" placeholder="Introduzca la descripción" />
                      <span class="small text-danger">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
              </div>  
            </div>
          </div>
          <div class="card-footer py-1">
            <button class="btn btn-primary btn-sm float-right" :disabled="invalid" @click="createCompanies">Guardar</button>
          </div>
        </div>
      </div>   
    </ValidationObserver>  
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
      itemsForm1: items.items_step_1,
      itemsForm2: items.items_step_2,
      step : 1,
      companies : [],
      entityFormUser: {
        name : '',
        last_name : '',
        email : '',
        password : '',
        password_confirmation : '',
        number_companies : 1
      },
      entityFormCompany:{
        cif : '',
        name : '',
        business_name : '',
        code_postal : '',
        description : '',
      },
      user:{}
    };
  },
  methods: {
    createUser() {
      
      Swal.showLoading()

      if (this.entityFormUser.number_companies < 1) {
        Toast.fire({
          icon: 'warning',
          title: 'El mínimo de número de empresas es 1',
        }) 
        return
      }

      axios
      .post("/api/users/add",this.entityFormUser)
      .then(res => {
        
        this.user = res.data.data

        Toast.fire({
          icon: 'success',
          title: 'CREACION DE USUARIO COMPLETADA',
        })
        
        for (var i = 0; i < this.entityFormUser.number_companies; i++) {
          this.companies.push({cif : '',name : '',business_name : '',code_postal : '',description : ''})
        }
     
        this.step = 2
        this.$router.go(-1);
      })
      .catch(err => console.log(err));

    },
    createCompanies(){
      axios
      .post("/api/companies/add",{user_id:this.user.id, companies:this.companies})
      .then(res => {
        console.log(res.data);
        Toast.fire({
          icon: 'success',
          title: 'CREACION DE EMPRESAS COMPLETADA',
        })
        //this.$router.go(-1);
      })
      .catch(err => console.log(err));
    },
    validateDNI($event){
      if ($event.target.value == '' || $event.target.value == null) {
        return;
      }
      let validate = this.ValidateSpanishID($event.target.value)
      
      if(!validate.valid){
        Toast.fire({
          icon: 'error',
          title: 'DNI NO ES VALIDO',
        })
        return;
      }
    },
    ValidateSpanishID(str) {

    // Ensure upcase and remove whitespace
    str = str.toUpperCase().replace(/\s/, '');

    var valid = false;
    var type = this.spainIdType( str );

    switch (type) {
      case 'dni':
        valid = this.validDNI( str );
        break;
      case 'nie':
        valid = this.validNIE( str );
        break;
      case 'cif':
        valid = this.validCIF( str );
        break;
    }

    return {
      type: type,
      valid: valid
    };

  },

   spainIdType ( str ) {
    
    var DNI_REGEX = /^(\d{8})([A-Z])$/;
    var CIF_REGEX = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/;
    var NIE_REGEX = /^[XYZ]\d{7,8}[A-Z]$/;

    if ( str.match( DNI_REGEX ) ) {
      return 'dni';
    }
    if ( str.match( CIF_REGEX ) ) {
      return 'cif';
    }
    if ( str.match( NIE_REGEX ) ) {
      return 'nie';
    }
  },

   validDNI ( dni ) {
    var dni_letters = "TRWAGMYFPDXBNJZSQVHLCKE";
    var letter = dni_letters.charAt( parseInt( dni, 10 ) % 23 );
    
    return letter == dni.charAt(8);
  },

   validNIE ( nie ) {

    // Change the initial letter for the corresponding number and validate as DNI
    var nie_prefix = nie.charAt( 0 );

    switch (nie_prefix) {
      case 'X': nie_prefix = 0; break;
      case 'Y': nie_prefix = 1; break;
      case 'Z': nie_prefix = 2; break;
    }

    return validDNI( nie_prefix + nie.substr(1) );

  },

   validCIF ( cif ) {

      var match = cif.match( CIF_REGEX );
      var letter  = match[1],
          number  = match[2],
          control = match[3];

      var even_sum = 0;
      var odd_sum = 0;
      var n;

      for ( var i = 0; i < number.length; i++) {
        n = parseInt( number[i], 10 );

        // Odd positions (Even index equals to odd position. i=0 equals first position)
        if ( i % 2 === 0 ) {
          // Odd positions are multiplied first.
          n *= 2;

          // If the multiplication is bigger than 10 we need to adjust
          odd_sum += n < 10 ? n : n - 9;

        // Even positions
        // Just sum them
        } else {
          even_sum += n;
        }

      }

      var control_digit = (10 - (even_sum + odd_sum).toString().substr(-1) );
      var control_letter = 'JABCDEFGHI'.substr( control_digit, 1 );

      // Control must be a digit
      if ( letter.match( /[ABEH]/ ) ) {
        return control == control_digit;

      // Control must be a letter
      } else if ( letter.match( /[KPQS]/ ) ) {
        return control == control_letter;

      // Can be either
      } else {
        return control == control_digit || control == control_letter;
      }

    }
  }
};
</script>


<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
