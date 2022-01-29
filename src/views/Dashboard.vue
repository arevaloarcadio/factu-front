<template>
  <CCard>
    <CCardHeader>
      <h5>
         En desarrollo
      </h5>
    </CCardHeader>
  </CCard>
</template>

<script>
import axios from 'axios'
import { mapGetters,mapActions } from 'vuex'

export default {
name: 'app',
mounted(){

},
data () {
  return {
    entity: "Dashboard"
  }
}
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

html, body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    overflow: hidden;
    font-family: Helvetica;
}

#tree {
    width: 100%;
    height: 100%;
}
</style>