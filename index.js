const printer = require("pdf-to-printer");

// Primeiro argumento = caminho do PDF
const file = process.argv[2];
// Segundo argumento = nome/endereço da impressora (ex.: "\\\\n050fp01\\Central")
const printerName = process.argv[3];

if (!file) {
  console.error("Uso: node index.js <arquivo.pdf> [nome_da_impressora]");
  process.exit(1);
}

printer.print(file, printerName ? { printer: printerName } : {})
  .then(() => {
    console.log(`Arquivo ${file} enviado para ${printerName || "impressora padrão"} com sucesso!`);
  })
  .catch(err => console.error("Erro ao imprimir:", err));
