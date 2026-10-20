# Portfólio de Gabriel Souza

Portfólio estático com serviços, trajetória e projetos pessoais: ParticleWall 3D e servidor doméstico com Android, Termux e Copyparty.

## Editar

No Windows, abra `ABRIR_NO_VSCODE.cmd`. Ele abre a pasta no VS Code e posiciona o editor em `editar.html`.

- `editar.html`: página principal e conteúdo dos projetos.
- `personalizar.css`: estilos personalizados.
- `interacoes.js`: interações básicas.
- `assets/`: ilustrações e cena recuperada.

## Visualizar

Com Node.js instalado, execute `node server.cjs` e acesse `http://127.0.0.1:4173/editar.html`. Mantenha o terminal aberto. Se a porta estiver ocupada, encerre o servidor anterior com Ctrl+C.

## GitHub Pages

O comando `node build.cjs` prepara a pasta `site/`, usando `editar.html` como página inicial. Os caminhos são relativos para funcionar também sob o nome de um repositório.

Depois de enviar este projeto para um repositório GitHub com branch `main`, selecione **Settings → Pages → Source → GitHub Actions**. O fluxo `.github/workflows/pages.yml` publica o site a cada envio à branch `main`; também pode ser executado em **Actions → Publicar portfólio no GitHub Pages → Run workflow**.

O endereço público é informado pelo GitHub ao concluir a publicação. Criar o repositório e enviar os arquivos não ativa, por si só, o GitHub Pages.

## Origem e limites

Esta é uma recuperação da versão publicada, com uma página HTML editável. Não corresponde ao código-fonte original completo do projeto. `index.html`, `backup/` e os módulos em `_next/static/chunks/` preservam a publicação recuperada. Eles não são usados no novo build estático. A versão editável carrega a cena Spline original de assets/scene.splinecode e inclui animações de entrada, efeitos nos cartões e transições durante a rolagem. O runtime Spline é carregado por CDN.

As imagens dos projetos são ilustrações conceituais. O servidor doméstico é uma configuração com ferramentas existentes; Copyparty não foi desenvolvido pelo autor deste portfólio.
