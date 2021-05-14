const items = [
  {
    name: "Información",
    campos: [
      {
        name: "description",
        title: "Descripción",
        placeholder: "Introduzca la descripción",
        validation: "required",
        type: "text",
        size: "col-md-12",
      },
       {
        name: "status",
        title: "Estado",
        placeholder: "Introduzca Estado",
        validation: "required",
        type: "select",
        size: "col-md-4 col-md-offset-right-4",
        opciones: [{id:'Pendiente',name:'Pendiente'},{id:'Realizado',name:'Realizado'}],
      },
    ],
  }
]

export default items;