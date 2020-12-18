<template>
	<div>
		<formGenerator :items="itemsForm" :entity="entityForm" @update="updated()">Crear Cliente
		</formGenerator>
	</div>
</template>

<script>
import VueNotifications from "vue-notifications"
import formGenerator from "@/views/components/formGenerator.vue"

export default {
	name: 'Customer',
	components:{ formGenerator},
	data () {
		return {
			entity: "Clientes",
			newEntity: "Nuevo Cliente",
			itemsForm:[
				{
					name: 'Identificación', 
					campos:[
						{ name: 'firstname', title: 'Nombre', placeholder:'Introduzca Nombre', validation: "required|min:3", type: 'string', size:"col-md-4" },
						{ name: 'lastname', title: 'Apellidos', placeholder:'Introduzca Apellidos', validation: "required|min:3", type: 'string', size:"col-md-4" },
						{ name: 'address', title: 'Dirección', placeholder:'Introduzca Dirección', validation: "required|min:3", type: 'string', size:"col-md-4" },
						{ name: 'cif', title: 'DNI', validation: 'required', type: 'string', size:"col-md-4" },
						{ name: 'birthdate', title: 'Fecha Nacimiento', validation: 'required', type: 'date', size:"col-md-4" },
					]
				},
				{ 
					name: 'Comunicación', 
					campos:[
						{ name: 'phone', title: 'Teléfono', placeholder:'Introduzca Teléfono', validation: 'required', type: 'number', size:"col-md-4" },
						{ name: 'cellphone', title: 'Móvil', placeholder:'Introduzca Móvil', validation: 'required' , type: 'number', size:"col-md-4 col-md-offset-right-4"},
						{ name: 'email', title: 'Email', placeholder:'Introduzca Email', validation: 'required|email', type: 'string', size:"col-md-4 col-md-offset-right-4" },
					]
				},
				{ 
					name: 'Información adicional', 
					campos:[
						{ name: 'description', title: 'Descripción', placeholder:'Introduzca Descripción', validation: '', type: 'text', size:"col-md-4" },
					]
				},
				
			],
			entityForm:{
	            firstname: '',
	            lastname: '',
	            address: '',
	            birthdate: '',
	            phone: '',
	            cellphone: '',
	            email: '',
	            description: '',
            },
		}
	},
	mounted(){

	},
	methods:{
		updated(){
			self = this
			this.$http({url: 'customers' , method: 'POST',data: this.entityForm })
	        .then(response => {
	          if(response.status == "201"){
	          	console.log("grabado")
	            //this.$router.push({path: '/customers'});
	          	//self.showSuccessMsg()

	          }
	        })
	        .catch(err => {
	          //commit('auth_error', err)
	          //self.unsetUser('token')
	          //reject(err)
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
	}
}
</script>

