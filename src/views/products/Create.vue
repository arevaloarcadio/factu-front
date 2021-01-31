<template>
	<div v-if="customers">
		<formGenerator :items="itemsForm" :entity="entityForm" @update="updated()" v-if="customers.length > 0">Crear Cliente
		</formGenerator>
	</div>
</template>

<script>
import VueNotifications from "vue-notifications"
import formGenerator from "@/views/components/formGenerator.vue"
import { mapGetters } from 'vuex'

export default {
	name: 'Product',
	components:{ formGenerator},
	data () {
		return {
			entity: "Producto",
			newEntity: "Nuevo Producto",
			product_types: [],
			customers: [],
			identifier: '',
			
			entityForm:{
	            customer_id: 0,
	            product_type_id: 0,
	            identifier: '',
            },
		}
	},
	created(){
		this.getItems('customers')
		this.getItems('product_types')
	},
	methods:{
		updated(){
			self = this
			this.$http({url: 'products' , method: 'POST',data: this.entityForm })
	        .then(response => {
	          if(response.status == "201"){
	            self.$router.push({path: '/products/list'});
	          	//self.showSuccessMsg()

	          }
	        })
	        .catch(err => {
	          //commit('auth_error', err)
	          //self.unsetUser('token')
	          //reject(err)
	        });

		},
		getItems(entity){
			self = this
			this.$http({url: entity , method: 'GET'})
	        .then(response => {
	        	var array = response.data
	        	array.forEach(function(el) {
	        		if(entity == "customers"){
				  		el.name = el.firstname + " " + el.lastname
	        		}
				});
	        	this[entity] = array
	        })
	        .catch(err => {
	        	
	        });

		}
	},
	notifications: {
		showSuccessMsg: {
			type: VueNotifications.types.success,
			title: 'Operación completada',
			message: 'Registro añadido con éxito!'
		},
		showErrorMsg: {
			type: VueNotifications.types.error,
			title: 'Operación rechazada',
			message: 'Algo salió mal'
		}
	},
	computed:{
		itemsForm() {
			return [
				{ 
					name: 'Información', 
					campos:[
						{ name: 'customer_id', title: 'Cliente', placeholder:'Introduzca Cliente', validation: 'required', type: 'select', size:"col-md-4" , opciones: this.customers},
						{ name: 'product_type_id', title: 'Tipo', placeholder:'Introduzca Móvil', validation: 'required' , type: 'select', size:"col-md-4 col-md-offset-right-4", opciones: this.product_types},
						{ name: 'identifier', title: 'Identificador', placeholder:'0039293029302', validation: 'required', type: 'string', size:"col-md-4 col-md-offset-right-4" },
					]
				}
			]	
		},
    ...mapGetters([
                'getUser'
            ]),
	}
}
</script>

