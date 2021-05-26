const items = [
  {
    name: "Rango de Fecha",
    campos: [
      {
        name: "date_from",
        title: "Fecha Desde",
        placeholder: "Introduzca la relacion",
        validation: "",
        type: "date",
        size: "col-md-4 col-md-offset-right-4",
      },
      {
        name: "date_to",
        title: "Fecha Hasta",
        placeholder: "Introduzca la relacion",
        validation: "",
        type: "date",
        size: "col-md-4 col-md-offset-right-4",
      },
      {
        name: "subordinate",
        title: "Subordinado",
        placeholder: "Introduzca la relacion",
        validation: "",
        type: "select",
        size: "col-md-4 col-md-offset-right-4",
        opciones : 
        [ 
          {
            id:'Seleccione',
            name: 'Seleccione'
          },
        ]
      }    
    ]
  }
];

export default items;
