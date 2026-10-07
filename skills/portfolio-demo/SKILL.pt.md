---
name: portfolio-demo
description: Planeja, prepara, captura ou repassa, verifica e integra vídeos de demonstração de projetos do portfólio. Dois modos - o dono grava no Recordly (ou outro gravador de tela) a partir do roteiro do agente, ou o agente captura o vídeo por script (Playwright + screencast do navegador + ffmpeg). Use quando o usuário pedir pra gravar, demonstrar ou mostrar um projeto em vídeo, citar o Recordly, uma demo de produto ou um vídeo pro portfólio. NÃO use para screenshots, GIFs de terminal, tutoriais ou texto de marketing.
---

# Portfolio Demo

Objetivo: o vídeo mais curto que deixa óbvio o valor do projeto. Grave o produto, não o processo de desenvolvimento.

## Modos

Escolha um por projeto e diga qual no roteiro. Se não estiver claro, proponha um e pergunte.

- **Script** (padrão quando cabe): o agente captura o site publicado por script, edita com ffmpeg e exporta. Serve quando o fluxo roda no navegador numa URL pública, é determinístico e o vídeo vai precisar ser refeito depois ou existir nos dois temas. Pra produto de linha de comando, reencene a saída real (ver Captura por script).
- **Manual**: o humano grava e edita no Recordly seguindo o roteiro. Serve quando o fluxo precisa de UI nativa do sistema (diálogo de arquivo de verdade, app desktop, prompt do sistema), quando o dono quer um ritmo feito à mão, ou quando a captura por script continua com cara de robô.

Todo o resto é igual nos dois modos: descoberta, um fluxo só, dados fictícios, ensaio, roteiro e revisão quadro a quadro. O modo muda a ferramenta, não as regras.

Nunca diga que uma gravação aconteceu se ela não aconteceu. Nunca opere o Recordly ou outros apps desktop.

## Fluxo de trabalho

1. **Descobrir** (nunca pule): README, package.json, rotas/páginas, dados de seed/mock, config de env, config de deploy, testes que revelam fluxos. Não é code review. Responda: problema, usuário, fluxo principal, recurso mais forte, o que NÃO mostrar.
2. **Escolher o fluxo**: ordene por impacto visual, valor de produto, relevância técnica, rapidez e originalidade. Prefira um fluxo que mostre várias qualidades (upload -> parse -> validação -> transformação -> preview -> export). Com vários projetos, entregue uma tabela: projeto | fluxo mais forte | valor da demo | dificuldade | prioridade. Qualidade acima de quantidade.
3. **Preparar**: estado inicial conhecido, dados fictícios realistas, navegador limpo, viewport fixo, rede estável. Prefira a URL publicada a localhost; prefira captura de janela.
4. **Ensaiar** no Playwright no viewport final: pegue erros, erros de console, estados de loading, layout shift, cliques sobrando, requisições externas; meça o tempo real de cada passo. Corrija ou replaneje antes de capturar.
5. **Entregar o roteiro de takes** (modelo abaixo).
6. **Capturar**: no modo script, o agente roda a captura e a edição; no modo manual, espere o humano gravar.
7. **Revisar o export** com a checagem, corrigir ou capturar de novo, e integrar.

## Narrativa

Gancho -> Contexto -> Fluxo principal (Entrada -> Ação -> Transformação -> Resultado) -> Prova.

- Gancho nos primeiros segundos, com o visual mais forte. Nunca abra em login, tela vazia, landing page, terminal ou spinner (terminal pode quando o produto é uma CLI).
- Contexto: curto e visual, sem slides.
- Termine no resultado, parado por ~2s.
- Duração: 30-60s por padrão, 45-90s se complexo, nunca mais de 2 min.
- Tipos de projeto: conversão de dados (origem -> import -> mapeamento -> transformação -> validação -> saída); dashboard (inicial -> filtro -> mudança relevante); CMS (criar -> publicar -> público); ferramenta de segurança (problema -> execução controlada -> evidência -> conclusão; só alvos fictícios); apps CRUD: mostre o fluxo do negócio, não o CRUD.
- Qualidades técnicas (local-first, processamento no cliente, validação, responsivo, tempo real, papéis) precisam aparecer na interface, não ser explicadas pelo código.

## Dados e segurança

- Dados fictícios mas realistas pro domínio. Nunca test123/foo/Fulano, e nunca dados pessoais reais, credenciais, chaves, tokens, cookies, URLs internas, CPF/CNPJ, telefones, e-mails privados ou dados de cliente. IPs de faixas de documentação (RFC 5737).
- Nunca estrague o projeto pela demo: nada de UI falsa, redesign, valores de produção fixos no código, recursos removidos, lógica alterada, segurança desligada ou dependências extras. O que só existe na captura (cursor, ripple de clique, scrollbar escondida, uma anotação) fica no script de captura, em runtime, nunca no repositório do projeto. Se precisar de dados ou flags temporárias: só seed/mock/runtime, isolado, reverta e confira que o `git status` está limpo.
- Feche notificações, outros apps e abas pessoais. Sem overlays de dev, devtools, extensões ou favoritos. Fontes e imagens carregadas antes da captura.
- Falha (diálogo de erro, stack trace, layout quebrado, asset faltando, falha de auth, tela vazia que não devia estar ali): pare, corrija e capture de novo. Nunca edite em volta de um estado quebrado. Se o bug é do produto, corrija no produto (mudança separada), publique e só então capture de novo.

## Captura por script

Guarde os scripts junto dos exports (ver Organização dos arquivos), pra dar pra refazer o vídeo quando o produto mudar.

- **Navegador**: o Playwright dirige o Chromium ou o Edge na URL publicada, com viewport fixo. Defina tema e idioma antes do primeiro script da página (`addInitScript` gravando a chave de tema do app no `localStorage`, mais `colorScheme` no contexto), pra o quadro 0 já sair no tema certo.
- **Cursor**: captura headless não tem cursor. Injete um com `addInitScript` (seta em SVG, movimento com easing, bounce e ripple discretos no clique). Mova com propósito e pare ~0,5s em cima antes dos cliques importantes.
- **Quadros**: capture com o `Page.startScreencast` do CDP (jpeg qualidade ~92). Os quadros chegam em ritmo variável, com timestamp; remonte um vídeo de 30 fps constante a partir desses timestamps.
- **Resolução**: o screencast de alguns navegadores ignora o `deviceScaleFactor` e devolve pixels CSS. Confira o tamanho real do quadro. Ou coloque um viewport (ex.: 1600x900) 1:1 dentro do quadro de 1920x1080, sem reescala, ou force a escala com flag de inicialização mais `Emulation.setDeviceMetricsOverride`.
- **Marcas**: grave um timestamp de cada ação no relógio do screencast e prenda zooms e cortes nessas marcas, nunca em tempos fixos; assim variação de rede não desalinha a edição.
- **Edição com ffmpeg**: zooms com easing (smoothstep, no máximo ~1,6x, nunca durante um clique), fundo que combina com o portfólio, máscara arredondada, sombra sutil. Encurte as pausas na captura em vez de acelerar o vídeo.
- **Saltos de luminosidade**: meça a luminosidade média de cada quadro. Um salto acima de ~4 (escala 0-255) entre quadros seguidos parece uma piscada (scrim de modal, navegação, flash de tema). Tire o trecho se ele não acrescenta nada; senão, aplique um crossfade curto (~4 quadros) naquele corte. Isso é edição; a UI continua real.
- **Produtos de linha de comando**: rode a CLI de verdade, salve a saída (e o tempo) num JSON e reencene numa página HTML que desenha o terminal de forma determinística, como `render(t)`; capture quadro a quadro. A única mudança permitida no texto é anonimizar caminhos. Cores podem ser aplicadas na renderização.
- **Dois temas**: mesmo script, mesmas marcas, mesmo tempo; exporte `<slug>.mp4` e `<slug>-light.mp4`.

## Modo manual: regras de interação e edição (pro humano)

- Cursor: suavização ligada, trajetos curtos e intencionais, pausa antes das ações importantes, um clique só, deixe as mudanças respirarem. Nada de rodear, vagar, movimento frenético ou hover acidental.
- Corte sem dó: tempo morto, hesitação, clique errado, loading, tentativas repetidas, navegação irrelevante.
- Trechos acelerados só pra esperas inevitáveis; prefira cortar. Nunca acelere a interação principal nem o resultado.
- Zoom só quando quem assiste precisa de ajuda pra ver (controle pequeno, mudança localizada, UI densa, ênfase no resultado). Não em todo clique, não no meio da ação, não agressivo.
- Anotações com moderação: resultado, recurso único, conceito não visual. Nunca em botão óbvio, nunca cobrindo a UI.
- Sem narração, música ou webcam por padrão. Se pedirem narração: roteirizada, curta, sem "e aí, pessoal".
- Não use um recurso do Recordly só porque ele existe.
- Regra de decisão pra cada elemento: aumenta o entendimento? Não -> corta. Talvez -> corta.

As regras de zoom, anotação e corte valem também no modo script.

## Enquadramento (igual em todos os projetos)

Paisagem 16:9, padding moderado, cantos arredondados, sombra sutil, fundo discreto que combine com a identidade visual do portfólio (leia as cores dele antes de escolher). O app é o protagonista. Mesma faixa de duração, qualidade, ritmo e nomes de arquivo entre projetos, mas nunca o mesmo roteiro.

## Entrega obrigatória: ROTEIRO DE TAKES

Entregue isto em markdown antes de capturar. Preencha todo campo com valores concretos.

````markdown
# Roteiro: <projeto> (<slug>)
Modo: <script | manual (Recordly)>
Fluxo: <uma frase>   Duração final esperada: <NN>s   Tempo no ensaio: <NN>s

## Checklist de preparo
- [ ] URL: <URL exata, limpa, sem query sobrando>
- [ ] Viewport: <1600x900 1:1 no quadro | 1440x900 captura de janela>, barra do navegador escondida
- [ ] Tema / idioma: <escuro|claro|os dois>, <idioma>
- [ ] Dados a carregar: <caminhos, ex.: demo/pedidos-exemplo.csv> (fictícios, conferido que não há dado real)
- [ ] Estado inicial: <logado como usuário demo / upload vazio / etc.>
- [ ] Só no modo manual: fechar notificações, apps de chat, outras abas, extensões, devtools; posição inicial do cursor <onde>

## Takes
| # | Tempo | Ação (cliques/digitação exatos) | O que quem assiste deve notar | Edição |
|---|-------|---------------------------------|-------------------------------|--------|
| 1 | 0-4s | Página já mostrando <prévia do resultado>; cursor vai até Upload | <gancho> | nenhuma |
| 2 | 4-10s | Arrastar `pedidos-exemplo.csv` pra área de upload; esperar o parse | <validação instantânea> | zoom 1.5x na área; cortar a espera |
| 3 | ... | ... | ... | crossfade ao abrir o modal / anotação "Roda 100% no navegador" |
| N | fim | Parar no resultado final | <prova> | segurar 2s, sem zoom |

## Configuração da captura
- Script: script de captura, viewport, 30 fps, âncoras de zoom (marcas), fundo, raio 12-16px, configuração de export
- Manual (Recordly): captura de janela 16:9; fundo <combina com o portfólio>, padding moderado, raio 12-16px, sombra sutil; suavização do cursor ligada, click bounce ligado, motion blur leve; sugestões de zoom automático só se baterem com a tabela; webcam e áudio desligados; salve o projeto .recordly

## Não mostrar
<dados reais, tokens, UI de dev, etc.>
````

## Configuração de export

MP4, H.264, 1920x1080, 30 fps, `yuv420p`, faixa TV, tags `bt709` completas, `+faststart`, sem áudio:

`ffmpeg -i in.mp4 -vf "scale=1920:-2" -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -color_range tv -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart -an out.mp4`

Sem as tags de cor, o mesmo arquivo aparece com cor diferente em navegadores diferentes. CRF 21-26; mire em menos de ~4 MB pra um vídeo de 45s.

## Checagem pós-export (o agente roda)

1. `ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate,pix_fmt,color_range,color_primaries,color_transfer,color_space -of default=nw=1 file.mp4`: duração na faixa, 1920x1080 (ou o pretendido), `yuv420p`, tags `bt709`, sem áudio, a não ser que seja intencional.
2. Extraia quadros e olhe: primeiro, último e um a cada ~1,5-2s, numa folha de contato: `ffmpeg -i file.mp4 -vf fps=0.5 frames/f_%03d.png`. Procure: UI quebrada, diálogos de erro, spinners, telas vazias, dado sensível, UI do gravador, desktop/barra de tarefas vazando, UI cortada dentro dos zooms, primeiro quadro fraco, último quadro sem sentido.
3. Confira a luminosidade por quadro em volta de modais, navegações e zooms (ver Saltos de luminosidade). Olhe os quadros seguidos onde ela salta.
4. Reporte os problemas com timestamp. Modo script: corrija o script e renderize de novo. Modo manual: o humano exporta de novo.
5. Reencode com a configuração de export se o arquivo passar do tamanho ou estiver sem as tags de cor.
6. Poster: `ffmpeg -ss <t> -i out.mp4 -frames:v 1 -c:v libwebp -quality 85 poster.webp` (um quadro sem zoom; o quadro 0 quando ele é o gancho).
7. Integre ao portfólio: descubra onde ele renderiza mídia de projeto (componente, props, convenção de nomes, variantes do tema claro) e leia um uso existente antes de adicionar vídeo e poster. Siga as convenções e regras de agente do portfólio (AGENTS.md, CLAUDE.md). Confira a página em dev ou no build.
8. Nunca commite vídeos grandes nos repositórios dos projetos.

## Organização dos arquivos

Guarde as demos fora dos repositórios dos projetos: `<pasta-de-demos>/<projeto>/{source/, exports/, README.md, exports/REVIEW.md}`. `source/` guarda os scripts de captura (modo script) ou o projeto `.recordly` (modo manual). README: modo, fluxo e por que ele ganhou, dados usados, data, configuração, versão do projeto gravada, como refazer. REVIEW.md: saída do ffprobe, o que a revisão achou e o que foi corrigido. MP4 por padrão; GIF só pra loops curtos (menos de ~8s).

## Antipadrões

Captura crua, despejo de recursos, vitrine de CRUD, tour pela UI, cursor caótico, cursor de robô (pulos instantâneos, sem pausa), zoom em tudo, simulador de loading, demo de dev (terminal, instalação, debug, a não ser que o produto seja uma CLI), produto falso, produção exagerada, produção fraca.

Capture de novo quando: confuso, cursor caótico, visual quebrado, piscada, recurso principal pouco claro, longo demais, zooms que distraem, resultado fraco ou o projeto mudou.

## Relatório final

Demo concluída | Projeto | Modo | Fluxo principal | Duração | Tamanho | Caminho do export | Caminho da fonte | Problemas achados e corrigidos | Observações.

Regra de ouro: mostre o produto, a interação importante e o resultado. Corte todo o resto.
