const items = [
  {
    name: "Identificación",
    campos: [
      {
        name: "firstname",
        title: "Nombre",
        placeholder: "Introduzca Nombre",
        validation: "required|min:3",
        type: "string",
        size: "col-md-4",
      },
      {
        name: "lastname",
        title: "Apellidos",
        placeholder: "Introduzca Apellidos",
        validation: "required|min:3",
        type: "string",
        size: "col-md-4 col-md-offset-right-4",
      },
      {
        name: "email",
        title: "Email",
        placeholder: "Introduzca Email",
        validation: "required|email",
        type: "string",
        size: "col-md-4 col-md-offset-right-4",
      },
    ],
  },
  {
    name: "Seguridad",
    campos: [
      {
        name: "password",
        title: "Contraseña",
        placeholder: "Introduzca Contraseña",
        validation: "required",
        type: "string",
        size: "col-md-4",
      },
      {
        name: "password_confirmation",
        title: "Confirmar contraseña",
        placeholder: "Repita su contraseña",
        validation: "required",
        type: "string",
        size: "col-md-4 col-md-offset-right-4",
      },
    ],
  },
]

export default items;
