<template>
  <div>
    <CRow>
      <CCard  class="col-sm-12 col-md-12">
        <CCardHeader>
          <center>
            <h5>
              {{entityForm.firstname+' '+entityForm.lastname}} 
            </h5>
           <br>
            <label for="file-input">
                <img style="height:100px;width:100px;" title="Presione para cambiar foto de perfil" class="c-avatar-img" :src="'img/profiles/'+entityForm.image" alt="user@email.com">
            </label>
            <input type="file" @change="getPicture" style="display: none"  ref="picture"  id="file-input" name="file-input" accept="image/x-png,image/jpeg" />
           
          </center>
      </CCardHeader>
      
      </CCard>
      <formGenerator
        class="col-sm-12 col-md-6"
        :items="itemsForm" 
        :entity="entityForm" 
        @update="updateUser()">
        Editar Usuario
      </formGenerator>

      <formGenerator
        class="col-sm-12 col-md-6"
        :items="itemsSecurity" 
        :entity="entityFormPassword" 
        @update="updatePassword()">
        Seguridad
      </formGenerator>
    </CRow>
    <!-- <CCard>
     <CCardHeader>
        <h5>
          Interacciones
          <router-link :to="{ name: 'interactions.create', params: { userId } }">
          <CButton class="float-right py-0 mr-1" color="success">
            <CIcon name="cil-pencil" class="mr-2 cil-energy"></CIcon>
            Nueva Interacción
          </CButton>
          </router-link>
        </h5>
      </CCardHeader>

     <CCardBody class="py-2">
        
        <InteractionTable :items="interactions"></InteractionTable>
      </CCardBody>-->
      <!-- <CCardFooter v-if="products">
        <nav>
          <ul class="pagination justify-content-center">
            <li class="page-item">
              <a
                class="page-link"
                @click="page(previousUrl)"
                v-show="previousUrl"
                tabindex="-1">
                Anterior
              </a>
            </li>
            <li class="page-item">
              <a class="page-link" @click="page(nextUrl)" v-show="nextUrl">Siguiente</a>
            </li>
          </ul>
        </nav>
      </CCardFooter>
    </CCard> -->

      <CModal title="Subir foto de perfil" :show.sync="upload_profile.pictureModal">
        <div id="editProfile">
        </div> 
        <center>
          <hr>
          <h3>Previsualizar</h3>
          <canvas id="preview">
          </canvas>
        </center>
       <template #footer>
        <CButton @click="pictureModal = false" color="danger">Cerrar</CButton>
        <CButton color="primary" @click="uploadImage()">Subir Foto</CButton>
      </template>
     </CModal>
  </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import InteractionTable from "@/views/interactions/components/InteractionTable.vue";
import items from './user-edit-items';
import Croppr from 'croppr';
import $ from 'jquery';
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
  name: "UserEdit",
  components: { 
    formGenerator,
    InteractionTable
  },
  data() {
    return {
      userId: null,
      interactions: [],
      itemsForm: items.information,
      itemsSecurity: items.security,
      upload_profile :{
        file_picture : null,
        picture : null,
        pictureModal : false
      },
      entityForm: {
        firstname: "",
        lastname: "",
        email: "",
        image : ""
      },
      entityFormPassword: {
        password: "",
        password_confirmation: "",
      },
    };
  },
  created() {

    this.userId = this.$route.params.id;

    this.getUser();
    this.getInteractions();

  },
  methods: {
    getUser() {
      const userId = this.$route.params.id;
      
      axios
        .get(`v1/users/${userId}`)
        .then(res => {
          this.setUserInformation(res.data);
        })
        .catch(err => console.log(err));
    },
    getInteractions() {
      const userId = this.$route.params.id;
      
      axios
        .get(`v1/users/${userId}/interactions`)
        .then(res => {
          this.interactions = res.data;
        })
        .catch(err => console.log(err));
    },
    updateUser() {
      const HTTP_OK = 200;
      const userId  = this.$route.params.id;
      
      axios
        .put(`v1/users/${userId}`, this.entityForm)
        .then(res => {
          console.log(res.data);

          if (res.status == HTTP_OK) {
             Toast.fire({
              icon: 'success',
              title: 'Operación completada',
            })
            this.$router.go(-1);
          }
        })
        .catch(err => console.log(err));
    },

    getPicture : function () {
      this.upload_profile.file_picture = this.$refs.picture.files[0];
      this.upload_profile.picture = {
          name: this.$refs.picture.files[0].name,
          url :  ''
      }
      
     const editProfile = $('#editProfile');
     // El canvas donde se mostrará la previa
     const preview = document.querySelector('#preview');
     // Contexto del canvas
     const context = preview.getContext('2d');
 
     const urlImage = window.webkitURL.createObjectURL(this.upload_profile.file_picture);

       // Borra editor en caso que existiera una imagen previa
      editProfile.html('');

      editProfile.html('<center><img id="croppr"></center>');
       
      context.clearRect(0, 0, preview.width, preview.height);
       // Limpia la previa en caso que existiera algún elemento previo
       //editProfile.clearRect(0, 0, editProfile.width, editProfile.height);

       // Envia la imagen al editor para su recorte
      $('#croppr').attr('src', urlImage);
  

       // Crea el editor
       new Croppr('#croppr', {
           aspectRatio: 1,
           startSize: [70, 70],
           onCropEnd: this.recutImage
       })

      this.upload_profile.preview = preview;
      this.upload_profile.pictureModal = true;
    }, 
    recutImage : function (data) {
      var self = this;
      let preview =  self.upload_profile.preview
      const inicioX = data.x;
      const inicioY = data.y;
      const newWidth = data.width;
      const newheight = data.height;
      const zoom = 1;
      let imageInBase64 = '';
      
      preview = document.querySelector('#preview');
      
      preview.width = newWidth;
      
      preview.height = newheight;

      let ImageTemp = new Image();

      ImageTemp.onload = function() {
      
        var context = preview.getContext('2d');

        context.drawImage(ImageTemp, inicioX, inicioY, newheight * zoom, newheight * zoom, 0, 0, newWidth, newheight);

        imageInBase64 = preview.toDataURL("image/jpeg");
       
        var newFile = self.dataURLtoFile(imageInBase64, self.upload_profile.file_picture.name);
       
        self.upload_profile.picture.recut_picture = newFile;
       
      }
      
      var urlImage = window.webkitURL.createObjectURL(this.upload_profile.file_picture);

      ImageTemp.src = urlImage;
    }, 
     dataURLtoFile : function(dataurl, filename) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    },
    uploadImage : function(){
      var formData = new FormData();

      formData.append('image',this.upload_profile.picture.recut_picture);

      const HTTP_OK = 200;
      const userId  = this.$route.params.id;
      
      axios
        .post('v1/users/'+userId+'/image', formData,{ 'Content-Type': 'multipart/form-data' })
        .then(res => {
          console.log(res.data);

          if (res.status == HTTP_OK) {
            Toast.fire({
              icon: 'success',
              title: 'Operación completada',
            })
            this.$router.go(-1);
          }
        })
        .catch(err => console.log(err.response));

    },
    updatePassword() {
      const HTTP_OK = 200;
      const userId  = this.$route.params.id;
      
      axios
        .put(`v1/users/${userId}/password`, this.entityFormPassword)
        .then(res => {
          console.log(res.data);

          if (res.status == HTTP_OK) {
            Toast.fire({
              icon: 'success',
              title: 'Operación completada',
            })
            this.$router.go(-1);
          }
        })
        .catch(err => console.log(err));
    },

		
		
		// setters
    
    setUserInformation(user) {
      // this.entityForm.firstname = user.firstname;
      // this.entityForm.lastname  = user.lastname;
      // this.entityForm.email     = user.email;

      this.entityForm = { ...user };
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

<style type="text/css">

canvas{
  vertical-align: middle;
  max-width: 100%;
  height: 300px
}
  .croppr-container * {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.croppr-container img {
  vertical-align: middle;
  max-width: 100%;
  height: 300px
}

.croppr {
  position: relative;
  display: inline-block;
}

.croppr-overlay {
  background: rgba(0,0,0,0.5);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  cursor: crosshair;
}

.croppr-region {
  border: 1px dashed rgba(0, 0, 0, 0.5);
  position: absolute;
  z-index: 3;
  cursor: move;
  top: 0;
}

.croppr-imageClipped {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;
}

.croppr-handle {
  border: 1px solid black;
  background-color: white;
  width: 10px;
  height: 10px;
  position: absolute;
  z-index: 4;
  top: 0;
}
</style>