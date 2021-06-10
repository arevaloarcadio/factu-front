
<template>
  <CRow>
      <CCard  class="col-sm-12 col-md-12">
        <CCardHeader>
          <span class="text-success"><b> Archivos Adjuntos </b></span>
        </CCardHeader>
        <CCardBody>
          <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
              <li data-target="#carouselExampleIndicators" class="bg-info" v-for="(file,index) in files" v-bind:data-slide-to="index" v-bind:class="index == 0? 'active':null"></li>
            </ol>
            <div class="carousel-inner">
              <div v-for="(file,index) in files" v-bind:class="index == 0? 'active':null" class="carousel-item">
                <div v-if="file.type.split('/')[0] == 'image'">
                  <div class="row" style="margin-bottom: 5px;">   
                    <div class="col-4"></div>
                    <div class="col-4">
                      <div class="form-inline">
                        <div class="form-group mb-6">
                          <h5 style="margin:0;">
                            <label style="margin:0;color:rgb(13, 46, 65);">
                              <i class="icon-file"></i>
                              <b>{{file.name}}</b>
                            </label>
                          </h5>
                          &nbsp;
                          <button type="button" class="btn btn-danger btn-sm"  aria-label="Close" @click="deleteFile(index)" title="">
                            Remover
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <center>
                    <img style="border: solid 2px black; border-radius: 1%;" :src="file.url" height="500px" width="30%">
                  </center>
                </div>
                <div v-else-if="file.type == 'application/pdf' && file.name.split('.')[1] == 'pdf'">

                  <div class="row" style="margin-bottom: 5px;">   
                    <div class="col-4"></div>
                    <div class="col-4">
                      <div class="form-inline">
                        <div class="form-group mb-6">
                          <h5 style="margin:0;">
                            <label style="margin:0;color:rgb(13, 46, 65);">
                              <i class="icon-file"></i>
                              <b>{{file.name}}</b>
                            </label>
                          </h5>
                          &nbsp;
                          <button type="button" class="btn btn-danger btn-sm"  aria-label="Close" @click="deleteFile(index)" title="">
                            Remover
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <center>
                    <object :data="file.url+'#view=Fit'" width="30%" height="500"></object>
                  </center> 
                </div>
                <div v-else>
                  <div class="row" style="margin-bottom: 5px;">   
                    <div class="col-4"></div>
                    <div class="col-4">
                      <div class="form-inline">
                        <div class="form-group mb-6">
                          <h5 style="margin:0;">
                            <label style="margin:0;color:rgb(13, 46, 65);">
                              <i class="icon-file"></i>
                              <b>{{file.name}}</b>
                            </label>
                          </h5>
                          &nbsp;
                          <button type="button" class="btn btn-danger btn-sm"  aria-labele3="Close" @click="deleteFile(index)" title="">
                            Remover
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <a v-if="files.length > 1" class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
              <span class="carousel-control-prev-icon bg-info" style="padding: 15px; border-radius: 35%;" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a v-if="files.length > 1" class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
              <span class="carousel-control-next-icon bg-info" style="padding: 15px; border-radius: 35%;" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a>
            <center v-if="files.length == 0">
              <h2>
                <label for="note" class="typo__label mb-0 text-dark">No se ha cargado ningún archivo</label>
              </h2>
            </center>
          </div>
        </CCardBody>
        <CCardFooter>
          <button id="file" class="btn btn-success  btn-sm float-right" @click="file">Subir Archivos</button>
              <input type="file" @change="getFiles" style="display: none"  ref="files"  id="files-input" name="files-input"/>
        </CCardFooter>
      </CCard>
  </CRow>
</template>

<script>
import $ from 'jquery'
import bootstrap from 'bootstrap'
export default {
  props: ["taskId"],
  data() {
    return {
      upload_files : [],
      files : [],
    }
  },
  created(){
 
  },
  methods: {
   file : function () {
     $('#files-input').click(); 
   },
   getFiles : function(){
    for(var i = 0; i < this.$refs.files.files.length; i++){
        this.upload_files.push(this.$refs.files.files[i]);
        this.files.push({
          name: this.$refs.files.files[i].name,
          type: this.$refs.files.files[i].type,
          url : window.webkitURL.createObjectURL(this.$refs.files.files[i])
        });
      }
    },
     deleteFile: function(index){
      this.files.splice(index, 1);
      this.upload_files.splice(index, 1);
      $(".carousel-item").eq(0).addClass('active');
    },
    saludar : function(){
      alert("holllaa")
    }
  }
};
</script>

<style lang="scss" scoped>
.btn--link { color: #FFF }
</style>