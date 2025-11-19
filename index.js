const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Configuração do Multer para armazenar em memória
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Impressora de rede no Windows
const printerPath = '\\\\n050fp01\\Central';

// Caminho completo do Adobe Acrobat DC
const adobePath = 'C:\\Arquivos de Programas\\Adobe\\Acrobat DC\\Acrobat\\Acrobat.exe';

app.post('/print', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo enviado.');
  }

  // Criar um arquivo temporário só para o Acrobat ler
  const tempPath = path.join(__dirname, `temp-${Date.now()}.pdf`);
  fs.writeFileSync(tempPath, req.file.buffer);

  console.log('Arquivo recebido em memória e salvo temporariamente:', tempPath);

  // Chama o Acrobat em modo silencioso (/t)
  const printProcess = spawn(
    `"${adobePath}"`,
    ['/t', tempPath, printerPath],
    { shell: true }
  );

  printProcess.stdout.on('data', (data) => {
    console.log(`STDOUT: ${data}`);
  });

  printProcess.stderr.on('data', (data) => {
    console.error(`STDERR: ${data}`);
  });

  printProcess.on('close', (code) => {
    console.log(`Processo Acrobat terminou com código: ${code}`);

    // Apaga o arquivo temporário depois de usar
    fs.unlinkSync(tempPath);

    if (code === 0 || code === 1) {
      res.send(`Arquivo enviado para a impressora ${printerPath} com sucesso!`);
    } else {
      res.send(`Arquivo enviado para a impressora ${printerPath}, mas Acrobat retornou código ${code}.`);
    }
  });
});

app.listen(port, () => {
  console.log(`API de impressão rodando em http://localhost:${port}`);
});
