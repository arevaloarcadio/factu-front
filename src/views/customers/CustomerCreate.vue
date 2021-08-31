<template>
  <div>
    <formGenerator 
      :items="itemsForm" 
      :entity="entityForm" 
      @update="create()" 
      @change="change($event)"
      @enter="enter($event)"
      @blur="validateDNI($event)">
      Crear Cliente
    </formGenerator>
  </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import items from './customer-create-items';
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
  name: "CustomerCreate",
  components: { formGenerator },
  data() {
    return {
      entity: "Clientes",
      newEntity: "Nuevo Cliente",
      itemsForm: items,
      entityForm: {
        cif : "",
        firstname: "",
        lastname: "",
        // address: "",
        birthdate: "",
        phone: "",
        cellphone: "",
        email: "",
        description: "",
        revision_time: 90,
      },
    };
  },
  computed: {
    ...mapGetters([
      "getUnitId",
      "getUser",
    ])
  },
  methods: {
    validateDNI($event){
      if($event.name == "cif"){
        if ($event.value == '' || $event.value == null) {
          return;
        }
        
        let validate = this.ValidateSpanishID($event.value)
      
          if(!validate.valid){
            Toast.fire({
              icon: 'error',
              title: 'DNI NO ES VALIDO',
            })
            return;
          }

        axios
        .post(`v1/customers/find_by_dni`, {cif : $event.value})
        .then(res => {
          if(res.data.id !== undefined ){
            Toast.fire({
              icon: 'warning',
              title: 'EXISTE UN CLIENTE CON ESTE DNI',
            })
            this.$router.push({ name: 'customers.edit', params: { id: res.data.id } })
          }
        })
        .catch(err => {});
      }
    },
    create() {

       if (this.entityForm.cif != '') {
        this.entityForm.cif = this.entityForm.cif.toUpperCase();
        let validate = this.ValidateSpanishID(this.entityForm.cif)
        if(!validate.valid){
          Toast.fire({
            icon: 'error',
            title: validate.type !== undefined ? validate.type.toUpperCase()+' NO ES VALIDO' : 'DNI NO ES VALIDO',
          })
          return;
        }
      }
      
      
      if(this.entityForm.phone== null && this.entityForm.cellphone == null){
        Toast.fire({
          icon: 'error',
          title: 'ES REQUERIDO AL MENOS UN TELEFONO',
        })
        return;
      }

      const HTTP_CREATED = 201;
      
      const data = {
        unitId: this.getUnitId,
        userId: this.getUser.id,
        ...this.entityForm
      };
      
       axios
         .post("v1/customers", data)
         .then((response) => {

           if (response.status == HTTP_CREATED) {
            Toast.fire({
              icon: 'success',
              title: 'CRACION DE CLIENTE COMPLETADA',
            })
          
            const customerId = response.data.data.id;
            this.$router.push({ name: "customers.edit",  params: { id: customerId } });
           }
         })
         .catch((err) => console.log(err));
    },
    ValidateSpanishID ( str ) {

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
};
</script>
