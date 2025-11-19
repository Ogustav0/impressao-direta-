const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

// Configuração do Multer
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `relatorio-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Rota para receber e imprimir
app.post('/print', upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('Nenhum arquivo enviado.');
  }

  const filePath = path.resolve(req.files[0].path);
  console.log('Arquivo recebido:', filePath);

  // Impressora de rede no Windows
  const printerPath = '\\\\n050fp01\\Central';

  // Comando de impressão
  const printProcess = spawn('print', ['/D:' + printerPath, filePath]);

  printProcess.on('close', (code) => {
    if (code === 0) {
      res.send(`Arquivo ${req.files[0].originalname} enviado para a impressora ${printerPath} com sucesso!`);
    } else {
      res.status(500).send('Erro ao imprimir o arquivo.');
    }
  });
});

app.listen(port, () => {
  console.log(`API de impressão rodando em http://localhost:${port}`);
});
