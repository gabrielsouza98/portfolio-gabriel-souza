# Portfólio Gabriel Souza — recuperação da publicação

Origem: https://gabriel-souza-site.gs-servicos.workers.dev/
Recuperado em 20/10/2026. O site online não foi alterado.

## Abrir no Windows
1. Extraia todo o ZIP e abra a pasta no VS Code.
2. Com Node.js instalado, execute npm start no terminal (não precisa de npm install), ou abra INICIAR.cmd.
3. Acesse http://127.0.0.1:4173/ para a cópia da publicação.
4. Acesse http://127.0.0.1:4173/editar.html para a versão em HTML editável.
Não abra os HTMLs por duplo clique: os módulos precisam de servidor HTTP.

## Onde editar
- editar.html: conteúdo, textos, links e estrutura, com tags separadas por linha.
- personalizar.css: alterações de aparência.
- interacoes.js: menu e interações básicas da versão editável.
- index.html e _next/: cópia do HTML e dos bundles compilados da publicação; preservados para referência e recuperação posterior. O React pode sobrescrever alterações feitas apenas no index.html.
- fonts/: fontes originais recuperadas.
- assets/scene.splinecode: arquivo da cena 3D recuperado. O bundle original ainda aponta para a URL Spline externa.

## Limites desta recuperação
Esta pasta NÃO é o projeto original do VS Code. Não foram recuperados componentes TSX/JSX originais, histórico Git, package.json original, configurações do build, código servidor do Worker ou segredos. O package.json e o servidor local foram criados para visualizar os arquivos recuperados.

A versão index.html depende do comportamento do runtime compilado e pode tentar acessar endpoints do servidor original que não existem nesta cópia estática. A cena 3D e outros recursos podem exigir internet.

A versão editar.html remove a hidratação React para permitir editar o conteúdo diretamente. Mantém estrutura e estilos recuperados, com interações básicas reimplementadas; NÃO reproduz todas as animações originais e mostra o placeholder da cena 3D.

Foram baixados 116 módulos JavaScript. Três nomes citados em strings internas (bevel_wasm_bg.js, boolean_wasm_bg.js, hana_bg.js) retornaram 404 e não foram recuperados; não foi confirmado se são exigidos pela cena. Veja recuperacao.json.

## Validação
Os arquivos foram gravados e o servidor iniciou na porta 4173. As consultas HTTP locais foram bloqueadas pelas permissões do ambiente. A seção Projetos da versão editar.html foi conferida no Chrome, com imagens carregadas e detalhes expansíveis dos dois projetos. A cópia original index.html não teve equivalência funcional validada. Faça uma revisão local antes de republicar.

## Publicar novamente
Não há deploy configurado nesta cópia. Não substitua a publicação existente antes de validar e reconstruir as funções desejadas.


## Seção Projetos
A versão editar.html inclui ParticleWall 3D e Servidor doméstico, com imagens SVG conceituais, tecnologias, explicação e detalhes expansíveis nativos do HTML. Edite os textos dentro de id="projetos" e os estilos de projetos em personalizar.css. As imagens não são capturas reais. Os detalhes técnicos são limitados às informações disponíveis; bibliotecas específicas do ParticleWall não foram confirmadas pelo código original. A cópia index.html foi preservada.

