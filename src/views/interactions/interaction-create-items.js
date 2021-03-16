const items = [
  {
    name: "Interacciones",
    campos: [
      {
        name: "customer",
        title: "Clientes",
        placeholder: "Seleccione un cliente",
        validation: "required",
        type: "select",
        size: "col-md-4",
        opciones: [],
      },
      {
        name: "type",
        title: "Tipo de interacción",
        placeholder: "Presencial",
        type: "string",
        size: "col-md-4",
      },
      {
        name: "description",
        title: "Descripción",
        placeholder: "Fui a su oficina y le ofrecí...",
        type: "string",
        size: "col-md-4",
      },
    ],
  }
];

export default items;
