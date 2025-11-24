const printer = require("pdf-to-printer");

const file = process.argv[2];

if (!file) {
  console.error("Uso: node index.js <arquivo.pdf>");
  process.exit(1);
}

printer.print(file)
  .then(() => console.log(`Arquivo ${file} enviado para a impressora padrão com sucesso!`))
  .catch(err => console.error("Erro ao imprimir:", err));