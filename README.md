# PokeDex 

Aplicación web Full-Stack construida con **.NET 8** y **React + TypeScript**. Este proyecto consume la PokeApi: (https://pokeapi.co/) para mostrar un catálogo interactivo de Pokémon. La aplicación implementa arquitectura limpia separando responsabilidades mediante servicios inyectables en el backend.

##  Tecnologías y Librerías Utilizadas

**Frontend:**
*   **React 18** con **TypeScript**: Para un tipado estricto y un desarrollo escalable.
*   **Tailwind CSS**: Para el diseño visual, maquetación de la tabla, diseño responsivo y la interfaz del modal interactivo sin depender de archivos CSS pesados.

**Backend:**
*   **ASP.NET Core Web API (.NET 8)**: Motor principal de la aplicación.
*   **System.Net.Mail**: Cliente nativo de C# para la gestión y envío de correos electrónicos.
*   **ClosedXML**: Librería de código abierto para la manipulación y creación de documentos de Excel.

## Requisitos Previos

Para ejecutar este proyecto de forma local, necesitas tener instalado:
1.  [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0).
2.  [Node.js](https://nodejs.org/) (versión 18 o superior) para el entorno de React.
3.  Una cuenta de Google/Gmail con la **Verificación en 2 pasos** activada (necesario para el envío de correos).

## Decisiones importantes durante el desarrollo
1. **Uso de CLoseXML**: Fue una alternativa más eficiente en el ecosistema .NET para la exportacion de reportes, a diferencia de **Microsoft.Office.Interop.Excel**, CloseXML trabaja con formato OpenXML, por lo cual no requiere Office Instalado para funcionar.
2. **SMTP de GMAIL**: Para el alcance de la aplicacion, integrar el cliente nativo de System.Net.Mail del SMTP de Google resulta ser la solucion mas directa y confiable, sin necesidad de agregar configuraciones adicionales.
3. **Desarollo con TypeScript**: Typescript ofrece el tipado estatico y herramientas de desarrollo mas potentes sobre JavaScript, por lo cual me permitio tener un mayor control sobre la seguridad, reglas de negocio y visualizacion de excepciones/errores durante el desarrollo del proyecto. 


##  Configuración para el Envío de Correos 

Para que la funcionalidad de "Enviar por Correo" funcione en tu entorno local, es necesario configurar las credenciales de Gmail en el proyecto backend.

1. Genera una **Contraseña de aplicación** de 16 caracteres en la configuración de Seguridad de tu cuenta de Google.
2. Abre el archivo `appsettings.json` ubicado en la raíz del proyecto backend (C#).
3. Modifica el nodo `EmailSettings` con tu correo y la contraseña generada (sin espacios):

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "EmailSettings": {
    "SenderEmail": "tu_correo@gmail.com",
    "SenderPassword": "tu_contraseña_de_aplicacion_de_16_letras"
  }
}

