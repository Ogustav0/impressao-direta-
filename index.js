#!/usr/bin/env node
const printer = require("pdf-to-printer");

// Pega o PDF passado como argumento
const file = process.argv[2];

// Nome da impressora (opcional, se não passar usa a padrão do sistema)
const printerName = "\\\\n050fp01\\Central"; // exemplo de impressora de rede

if (!file) {
  console.error("Uso: node print.js <arquivo.pdf>");
  process.exit(1);
}

// Envia para impressão
printer.print(file, { printer: printerName })
  .then(() => {
    console.log(`Arquivo ${file} enviado para a impressora ${printerName || "padrão"} com sucesso!`);
  })
  .catch(err => {
    console.error("Erro ao imprimir:", err);
  });
