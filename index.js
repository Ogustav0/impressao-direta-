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

// Impressora de rede no Windows
const printerPath = '\\\\n050fp01\\Central';

// Caminho completo do Adobe Reader
const adobePath = 'C:\\Arquivos de Programas\\Adobe\\Acrobat DC\\Acrobat\\AcroRd32.exe';

app.post('/print', upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('Nenhum arquivo enviado.');
  }

  const filePath = path.resolve(req.files[0].path);
  console.log('Arquivo recebido:', filePath);

  // Comando Adobe Reader silencioso
  const printProcess = spawn(
    `"${adobePath}"`,
    ['/t', filePath, printerPath],
    { shell: true }
  );

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
