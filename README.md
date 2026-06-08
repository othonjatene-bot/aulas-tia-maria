# Aulas de Apoio da Tia Maria

Landing page estática para apresentar o acompanhamento educacional, explicar os pacotes e qualificar famílias por meio de um formulário com recomendação automática e envio para o WhatsApp.

## Rodar localmente

Abra o arquivo `index.html` diretamente no navegador. Para uma visualização mais fiel, também é possível servir a pasta com qualquer servidor HTTP estático.

## Publicar na Netlify

1. Crie um repositório no GitHub.
2. Envie todos os arquivos deste projeto.
3. Na Netlify, escolha **Import an existing project**.
4. Conecte sua conta do GitHub e selecione o repositório.
5. Use `.` como **Publish directory**.
6. Deixe o **Build command** vazio.
7. Confirme o deploy.

## Personalização

- **WhatsApp:** altere `WHATSAPP_NUMBER` no início de `script.js`.
- **Textos e pacotes:** edite as seções correspondentes em `index.html`.
- **Preços:** procure por `R$` em `index.html`.
- **Imagem principal:** substitua `assets/maria-foto-landv01.png`, mantendo o mesmo nome, ou atualize o caminho no HTML.
- **Cores:** altere as variáveis no início de `styles.css`.

O formulário funciona inteiramente no navegador. Nenhum dado é armazenado ou enviado a um banco de dados.
