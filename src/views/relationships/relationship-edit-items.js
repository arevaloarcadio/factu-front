const items = [
  {
    name: "Información",
    campos: [
      {
        name: "description",
        title: "Relación",
        placeholder: "Introduzca la relacion",
        validation: "required",
        type: "select",
        size: "col-md-12 col-md-offset-right-4",
        opciones : [
         {
            id: '',
            name: 'Seleccione'
          },
          {
            id:'Madre',
            name: 'Madre'
          },
          {
            id:'Padre',
            name: 'Padre'
          },
          {
            id:'Hermano',
            name: 'Hermano'
          },
          {
            id:'Hermana',
            name: 'Hermana'
          },
          {
            id:'Suegro',
            name: 'Suegro'
          },
          {
            id:'Suegra',
            name: 'Suegra'
          },
          {
            id:'Esposo',
            name: 'Esposo'
          },
          {
            id:'Esposa',
            name: 'Esposa'
          },
          {
            id:'Cuñado',
            name: 'Cuñado'
          },
          {
            id:'Cuñada',
            name: 'Cuñada'
          },
        ]
      } 
    ]
  }
];

export default items;
