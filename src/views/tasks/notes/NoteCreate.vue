<template>
  <div>
    <formGenerator
      :items="itemsForm" 
      :entity="entityForm" 
      @update="createNote()">
      Crear Nota
    </formGenerator>
      <NoteAttachedFile v-bind:taskId="taskId" ref="NoteAttachedFile"></NoteAttachedFile>
  </div>

</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import items from './note-create-items';
import NoteAttachedFile from "./components/NoteAttachedFile.vue";

export default {
  name: "NoteCreate",
  components: { formGenerator,NoteAttachedFile },
  data() {
    return {
      itemsForm: items,
      taskId: 0,
      entityForm: {
        user_id: "",
        note: "",
      },
    };
  },
  created() {
    this.taskId = this.$route.params.id;
  },
  methods: {
    createNote() {
      
      var formData = new FormData();

      formData.append('taskId',this.taskId);
      formData.append('note',this.entityForm.note);
      
      for(var i = 0; i < this.$refs.NoteAttachedFile.upload_files.length; i++ ){
         formData.append('files[]',this.$refs.NoteAttachedFile.upload_files[i])
      }
      
      const HTTP_CREATED = 201;

      axios
        .post(`v1/tasks/${this.taskId}/notes`, formData,{ 'Content-Type': 'multipart/form-data' })
        .then(res => {
          console.log(res.data);

          if (res.status == HTTP_CREATED) {
            // this.showSuccessMsg();
            this.$router.go(-1);
          }
        })
        .catch(err => console.log(err));

    },
    setTaskNotes(taskNotes) {
      const newTaskNotes = taskNotes.map(c => {
        return {
          id: c.id,
          name: `${c.firstname} ${c.lastname}`
        }
      });

      this.itemsForm[0].campos[0].opciones = newTaskNotes;
      this.itemsForm = { ...this.itemsForm };
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
  #note{
    margin: 1%;
  }
</style>
