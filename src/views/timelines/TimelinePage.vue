<template>
  <div class="container">
     <CCard class="col-md-12">
      <CCardHeader class="text-success py-1">
        <strong>Timeline</strong>
      </CCardHeader>
      <CCardFooter>
        <template v-for="subordinate in subordinates">
          <div class="timeline-item" :date-is='subordinate.created_at'>
            <h1>{{subordinate.user.firstname+' '+subordinate.user.lastname}}</h1>
            <p v-html="subordinate.description"></p>
          </div>
        </template>
      </CCardFooter>
    </CCard>
  
    
  </div>
</template>

<script>
import axios from "axios";
import VueNotifications from "vue-notifications";
import VuePaginate from 'vue-paginate'
import { mapGetters } from 'vuex'

export default {
  name: "TimelinePage",
  data() {
    return {
      entity: "Timeline",
      subordinates : []

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
  },
  methods: {
 
    getSubordinates(){
      axios({url: 'organizations/subordinate/'+this.getUser.id+'/'+this.getUser.unit,  method: 'GET' })
        .then(resp => {
          this.subordinates = resp.data
          resolve(resp)
        })
        .catch(err => {
          //commit('auth_error', err)
          //reject(err)
        });
    },
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
