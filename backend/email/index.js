import app from "./src/app.js";

// const PORT = 3002;

const PORT = process.env.API_PORT;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});