<template>
<CModal title="Recordatorios!" :show.sync="ReminderModal">
      <CCard v-for="reminder in reminders">
            <CCardHeader >
              <b>{{ reminder.description }}</b>
            </CCardHeader>
            <CCardBody>
              <p> {{ 'Nos complace recordarle que la fecha '+reminder.date_when+' tiene un evento pendiente.'}}</p>
              <p> {{ 'Descripcion: '+ reminder.description}}</p>
              <p v-if="reminder.customer != null">
                {{ 'Cliente: '+ reminder.customer.firstname+' '+reminder.customer.lastname}}
              </p>
            </CCardBody>
            <CCardFooter>

            </CCardFooter>
      </CCard>
    </CModal>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TheReminder',
    data () {
    return {
      reminders : null,
      ReminderModal : false
    }
  },
  mounted(){
    this.getMyReminders();
  },
  methods:{

    getMyReminders(){
      axios.get('reminders/todays_reminder')
        .then(resp => {
          this.reminders = resp.data
          if(this.reminders.length != 0){
            this.ReminderModal = true;
          }
        })
        .catch(err => {
          //commit('auth_error', err)
          //reject(err)
        });
    },
  }
}
</script>
