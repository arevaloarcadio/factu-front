<template>
  <div class="container">
      <formGenerator
      :items="itemsForm"
      :entity="entityForm"
      :nameButton="'Filtrar'"
      @update="filter()">
      Filtrar
    </formGenerator>

     <CCard class="col-md-12">
      <CCardHeader class="text-success py-1">
        <strong>Timeline</strong>
      </CCardHeader>
      <CCardFooter>
        <paginate name="subordinates" :list="subordinates" :per="10" tag="tbody">
          <template v-for="subordinate in paginated('subordinates')">
            <div class="timeline-item" style="font-size: 12px" :date-is='new Date(new Date(subordinate.created_at).setDate(new Date(subordinate.created_at).getDate() + 1)).toLocaleDateString() +" "+new Date(subordinate.created_at).toLocaleTimeString()'>
              <img :src="'/img/profiles/'+subordinate.user.image" style="width:  40px">
              <h5>{{subordinate.user.firstname+' '+subordinate.user.lastname}}</h5>
              <p style="font-size: 12px" v-html="subordinate.description"></p>
            </div>
          </template>
        </paginate>
          <paginate-links for="subordinates" :limit="10" :show-step-links="true" :classes="{'ul': 'pagination', 'li': 'page-item', 'a': 'page-link'}"></paginate-links>
      </CCardFooter>
    </CCard>
  
  </div>
</template>

<script>
import axios from "axios";
import VueNotifications from "vue-notifications";
import formGenerator from "@/views/components/formGenerator.vue";
import items from './timelines-filters-items';
import VuePaginate from 'vue-paginate'
import { mapGetters } from 'vuex'

export default {
  name: "TimelinePage",
  components: { formGenerator },
  data() {
    return {
      entity: "Timeline",
      subordinates : [],
      itemsForm: items,
      entityForm: {
        date_from:  '',
        date_to:  '',
        subordinate:  '',
      },
      paginate : ['subordinates'],
      users: [],

    };
  },
  computed: {
  ...mapGetters([
      'getUnit'
  ]),
  ...mapGetters([
        'getUser'
    ]),
  },
  mounted() {
    
    this.getSubordinates();
    this.getUsers();
  },
  methods: {
 
     getUsers(){
      axios.get("users")
        .then(resp => {

           let users = resp.data;
            for (var i = 0; i < users.length; i++) {
              this.users.push({
                id : parseInt(users[i].id),
                name: users[i].firstname +' '+users[i].lastname
              });
            }
          this.itemsForm[0].campos[2].opciones = this.users;
        })
        .catch(err => {
          //commit('auth_error', err)
          //reject(err)
        });
    },
    getSubordinates(){
      axios({url: 'organizations/subordinate/'+this.getUser.id+'/'+this.getUser.unit,  method: 'GET'})
        .then(resp => {
          this.subordinates = resp.data
          resolve(resp)
        })
        .catch(err => {
          //commit('auth_error', err)
          //reject(err)
        });
    },
    filter(){
      const data = { ...this.entityForm}
      axios.post('organizations/subordinate/'+this.getUser.id+'/'+this.getUser.unit, data)
        .then(resp => {
          this.subordinates = resp.data
          this.reset_page(this.paginate)
          resolve(resp)
        })
        .catch(err => {
          //commit('auth_error', err)
          //reject(err)
        });
    },
    reset_page : function (paginate){
      for(let pag in paginate){
        paginate[pag].page = 0;
      }
    }
  }
};

</script>

<style lang="scss" scoped>
.btn--link { color: #FFF }


@import url('https://fonts.googleapis.com/css?family=Oswald|Roboto:400,700');

body {
  font-size: 14px;
  line-height: 1.5;
}


h1, h2, h3, h4, h5, h6 {
  font-family: 'Oswald', sans-serif;
}

h1 {
  font-size: 2rem;
  margin-bottom: .5em;
}

p {
  font-family: 'Roboto', sans-serif;
  font-size: .8rem;
}


.container {
  max-width: 1024px;
  width: 90%;
  margin: 0 auto;
}


$border-color: rgba(black, .3);

.timeline-item {
  padding: 3em 2em 2em;
  position: relative;
  color: rgba(black, .7);
  border-left: 2px solid $border-color;
  
  p {
    font-size: 1rem;
  }
  
  &::before {
    content: attr(date-is);
    position: absolute;
    left: 2em;
    font-weight: bold;
    top: 1em;
    display: block;
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    font-size: .785rem;
  }

  &::after {
    width: 10px;
    height: 10px;
    display: block;
    top: 1em;
    position: absolute;
    left: -7px;
    border-radius: 10px;
    content: '';
    border: 2px solid $border-color;
    background: white;
  }

  &:last-child {
    border-image: linear-gradient(
      to bottom,
      $border-color 60%,
      rgba($border-color, 0)) 1 100%
    ;
  }
}
</style>
