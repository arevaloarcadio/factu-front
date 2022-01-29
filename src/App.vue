<template>
  <router-view></router-view>
</template>

<script>
import PushJs from 'push.js'

export default {
  	name: 'App',
  	mounted(){
		document.addEventListener('DOMContentLoaded', () => {
			PushJs.Permission.request();
		});
   
	}
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
  @import 'sweetalert2/src/sweetalert2.scss';
</style>
