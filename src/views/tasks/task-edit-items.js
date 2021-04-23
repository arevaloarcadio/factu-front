const items = [
  {
    name: "Información",
    campos: [
      // {
      //   name: "customer_id",
      //   title: "Cliente",
      //   placeholder: "Introduzca Cliente",
      //   validation: "required",
      //   type: "select",
      //   size: "col-md-4",
      //   opciones: [],
      // },
      {
        name: "subject",
        title: "Tema",
        placeholder: "Introduzca tema de la tarea",
        validation: "required",
        type: "string",
        size: "col-md-8  col-md-offset-right-4",
      },
      {
        name: "date",
        title: "Fecha",
        placeholder: "",
        validation: "required",
        type: "date",
        size: "col-md-6  col-md-offset-right-6",
      },
      {
        name: "description",
        title: "Descripción",
        placeholder: "Introduzca la descripción",
        validation: "required",
        type: "text",
        size: "col-md-12",
      },
    ],
  }
]

export default items;