
<template>
  <div>
    <CDataTable
      class="mb-0 table-outline"
      hover
      :items="items"
      :fields="tableFields"
      head-color="light"
      no-sorting
      v-if="items">

      <td slot="user" slot-scope="{ item }">
        <img width="70px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE985qTr1hauge-1nv0jJbyFmZL5j_R9U-Ug&usqp=CAU"><br>
        <small>
          <strong>{{ item.user.firstname + ' ' + item.user.lastname }}</strong>
        </small>
      </td>
      <td slot="actions" slot-scope="{ item }">
        <CButton class="m-2 btn--link" size="sm" color="success" @click="getNote(item.files,item.note)" >Ver</CButton>
      </td>
    </CDataTable>

    <CModal :title="'Ver Nota'" :show.sync="noteModal">
      
      <center>
        <h5>{{note}}</h5>
      </center>
      
      <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
            <ol class="carousel-indicators">
              <li data-target="#carouselExampleIndicators" class="bg-info" v-for="(file,index) in files" v-bind:data-slide-to="index" v-bind:class="index == 0? 'active':null"></li>
            </ol>
            <div class="carousel-inner">
              <div v-for="(file,index) in files" v-bind:class="index == 0? 'active':null" class="carousel-item">
                <div v-if="file.format == 'image'">
                  <div class="row" style="margin-bottom: 5px;">  
                    
                    <center>
                      <img style="border: solid 2px black; border-radius: 1%;"  :title="file.file" :src="'note_files/'+file.file" height="500" width="80%">
                    </center> 
                    <div class="col-4">
                      <div class="form-inline">
                        <div class="form-group mb-6">
                          <h5 style="margin:0;">
                            <label style="margin:0;color:rgb(13, 46, 65);">
                              <!--<b>{{file.file}}</b>-->
                            </label>
                          </h5>

                        </div>
                      </div>
                    </div>
                  </div>
                  <center>
                     <a :href="'note_files/'+file.file" class="btn btn-success btn-sm" :download="file.file" >Descargar</a>
                  </center>
                </div>

                <div v-else-if="file.format == 'application' && file.file.split('.')[1] == 'pdf'">
                  <center>
                    <object :data="'note_files/'+file.file+'#view=Fit'" :title="file.file" width="100%" height="500"></object>
                  </center> 
                   <div class="row" style="margin-bottom: 5px;">   
                    <div class="col-4"></div>
                    <div class="col-4">
                      <div class="form-inline">
                        <div class="form-group mb-6">
                          <h5 style="margin:0;">
                            <label style="margin:0;color:rgb(13, 46, 65);">
                              <!--<b>{{file.file}}</b>-->
                            </label>
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                  <center>
                    <a :href="'note_files/'+file.file+'#view=Fit'" class="btn btn-success btn-sm" :download="file.file" >Descargar</a>
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
                              <!--<b>{{file.file}}</b>-->
                            </label>
                          </h5>
                          &nbsp;
                          <button type="button" class="btn btn-success btn-sm"  aria-label="Close" title="">
                            Descargar
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
              
            </center>
          </div>
        
      <template #footer>
        <CButton @click="noteModal = false;" color="danger">Cerrar</CButton>
      </template>
    </CModal>
  
  </div>
</template>

<script>

import $ from 'jquery'
import bootstrap from 'bootstrap'

export default {
  name: "NoteTable",
  props: ["items"],
  data() {
    return {
      entityTable: "notes",
      tableFields: [
        { key: "user", label: "", _classes: "text-center" },
        { key: "note", label: "Nota", _classes: "text-center" },
        {
          key: 'actions',
          label: 'Acciones',
          _style: { width: '1%' },
          sorter: false,
          filter: false
        }
      ],
      note : null,
      noteModal : false,
      files : []
    }
  },
  created(){
    console.log(this.items,"<-----")
  },
  methods: {
    getParams(item) {
      return { customerId: item.customer_id, productId: item.id };
    },
    getQuery(item) {
      return { identifier: item.identifier, product_type: item.product_type_id };
    },
    getNote(files,note){
      this.files = files;
      this.note = note;
      this.noteModal = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.btn--link { color: #FFF }
</style>