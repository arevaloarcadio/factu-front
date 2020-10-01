<template>
	<div>
		<div id="editForm" style="display:none; text-align:center; position:absolute; border: 1px solid #aeaeae;width:300px;z-index:10000; background-color: #eeeeee">
	        <div style="padding: 10px 0 10px 0; background-color:#039BE5; color: #ffffff;">Edit Form</div>
			    <div>
			        <div style="padding: 10px 0 5px 0;">
			            <label style="color:#000000; width:50px; display:inline-block;" for="name">Name</label>
			            <input id="name" value="" />
			        </div>
			        <div style="padding: 5px 0 10px 0;">
			            <label style="color:#000000; width:50px; display:inline-block;" for="title">Title</label>
			            <input  id="title" value="" />
			        </div>
			        <div style="padding: 5px 0 15px 0;">
			            <button style="width:108px;" id="cancel">Cancelar</button>
			            <button style="width:108px;" id="save">Guardar</button>
			        </div>
			    </div>
			</div>
		<div id="tree" ref="tree"></div>	
	</div>
	    
</template>

<script>

import OrgChart from '@balkangraph/orgchart.js'

export default {

	name: 'tree',
	data() {
		return {
			nodes: [
	            { id: 1, name: "Denny Curtias", title: "CEO", img: "https://cdn.balkan.app/shared/2.jpg" },
	            { id: 2, pid: 1, name: "Ashley Barnett", title: "Sales Manager", img: "https://cdn.balkan.app/shared/3.jpg" },
	            { id: 3, pid: 1, name: "Caden Ellison", title: "Dev Manager", img: "https://cdn.balkan.app/shared/4.jpg" },
	            { id: 4, pid: 2, name: "Elliot Patel", title: "Sales", img: "https://cdn.balkan.app/shared/5.jpg" },
	            { id: 5, pid: 2, name: "Lynn Hussain", title: "Sales", img: "https://cdn.balkan.app/shared/6.jpg" },
	            { id: 6, pid: 3, name: "Tanner May", title: "Developer", img: "https://cdn.balkan.app/shared/7.jpg" },
	            { id: 7, pid: 3, name: "Fran Parsons", title: "Developer", img: "https://cdn.balkan.app/shared/8.jpg" }
	        ],
	        chart: null,
	        editForm: null,
	    }
	},

	methods: {

	    oc: function(domEl, x) {
	        this.chart = new OrgChart(
	        	domEl, {
	                    nodes: x,
	                    nodeBinding: {
	                        field_0: "name", field_1: "title", img_0: "img"
	                    },
	                    template: 'polina',
	                    editUI: new this.editForm,
	                    nodeMenu:{
					    	edit: {text:"Editar"}, add: {text:"Agregar"}, remove: {text:"Borrar"}
					    },
	        });
	    },                        
	},

	mounted(){

		this.editForm = function () {
            this.nodeId = null;
        };

        this.editForm.prototype.init = function (obj) {
            var that = this;
            this.obj = obj;
            this.editForm = document.getElementById("editForm");
            this.nameInput = document.getElementById("name");
            this.titleInput = document.getElementById("title");
            this.cancelButton = document.getElementById("cancel");
            this.saveButton = document.getElementById("save");

            this.cancelButton.addEventListener("click", function () {
                that.hide();
            });

            this.saveButton.addEventListener("click", function () {
            		var node = chart.get(that.nodeId);
                node.name = that.nameInput.value;
                node.title = that.titleInput.value;

                chart.updateNode(node);
                that.hide();
            });
        };

        this.editForm.prototype.show = function (nodeId) {
        		this.hide();
            this.nodeId = nodeId;

            var left = document.body.offsetWidth / 2 - 150;
            this.editForm.style.display = "block";
            this.editForm.style.left = left + "px";
            var node = chart.get(nodeId);
            this.nameInput.value = node.name;
            this.titleInput.value = node.title;
        };

        this.editForm.prototype.hide = function (showldUpdateTheNode) {
            this.editForm.style.display = "none";
        };



		this.oc(this.$refs.tree, this.nodes)
	}
}
</script>

<style scoped>
</style>