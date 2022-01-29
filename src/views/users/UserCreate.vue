<template>
  <div>
    <formGenerator
      :items="itemsForm" 
      :entity="entityForm" 
      @update="createUser()"
      @blur="validateDNI($event)">
      Crear Usuario
    </formGenerator>
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
        name : '',
        last_name : '',
        email : '',
        password : '',
        password_confirmation : '',
        cif : '',
        tax_data_name : '',
        business_name : '',
        code_postal : '',
        description : '',
      },
    };
  },
  methods: {
    createUser() {

      let data = {
        user : {
          name : this.entityForm.name,
          last_name : this.entityForm.last_name,
          email : this.entityForm.email,
          user_name : this.entityForm.user_name,
          password : this.entityForm.password,
          password_confirmation : this.entityForm.password_confirmation
        },
        tax_data : {
          cif : this.entityForm.cif,
          name : this.entityForm.name,
          business_name : this.entityForm.business_name,
          code_postal : this.entityForm.code_postal,
          description : this.entityForm.description
        }
      }
      
      axios
      .post("/api/users/add",data)
      .then(res => {
        console.log(res.data);
        Toast.fire({
          icon: 'success',
          title: 'CREACION DE USUARIO COMPLETADA',
        })
        this.$router.go(-1);
      })
      .catch(err => console.log(err));
    },
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
