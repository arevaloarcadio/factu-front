<template>
  <div>
    <formGenerator
      :items="itemsForm" 
      :entity="entityForm" 
      @update="createNote()">
      Crear Nota
    </formGenerator>
  </div>
</template>

<script>
import axios from 'axios';
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import items from './note-create-items';

export default {
  name: "NoteCreate",
  components: { formGenerator },
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
    console.log(this.taskId)
  },
  methods: {
    createNote() {
      const HTTP_CREATED = 201;
      
      const note = {
        taskId:  parseInt(this.taskId),
        note: this.entityForm.note
      };
      
      axios
        .post(`v1/tasks/${this.taskId}/notes`, note)
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
