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
        size: "col-md-6 col-md-offset-right-4",
      },
      {
        name: "periodicity",
        title: "Periodicidad",
        placeholder: "Introduzca la Periodicidad",
        validation: "required",
        type: "select",
        size: "col-md-6 col-md-offset-right-4",
        opciones : [ 
              {
                id:'Anual',
                name: 'Anual'
              },
              {
                id:'Mensual',
                name: 'Mensual'
              },
              {
                id:'Sin Periodicidad',
                name: 'Sin Periodicidad'
              }
            ]
          },
        ],
      },
      {
     name: "Periodicidad",
     campos: [ 
     
      {
        name: "date_reminder",
        title: "Fecha del Recordatorio",
        placeholder: "",
        validation: "required",
        type: "date",
        size: "col-md-4",
      },
       {
        name: "date_when",
        title: "Fecha Cuando",
        placeholder: "",
        validation: "required",
        type: "date",
        size: "col-md-4",
      },
    ]
  }
]

export default items;
