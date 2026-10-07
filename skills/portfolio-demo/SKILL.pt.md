---
name: portfolio-demo
description: Planeja, prepara, verifica e integra vídeos de demonstração de projetos do portfólio, gravados pelo dono no Recordly (ou outro gravador de tela). Use quando o usuário pedir pra gravar, demonstrar ou mostrar um projeto em vídeo, citar o Recordly, uma demo de produto ou um vídeo pro portfólio. O agente entrega o roteiro de takes, o ambiente, o ensaio e a checagem pós-export; o humano grava e edita. NÃO use para screenshots, GIFs de terminal, tutoriais, texto de marketing ou edição direta de arquivos de vídeo.
---

# Portfolio Demo

Objetivo: o vídeo mais curto que deixa óbvio o valor do projeto. Grave o produto, não o processo de desenvolvimento.

## Papéis

Um agente de código não consegue operar o Recordly (app desktop). Divisão:

- **Agente**: descobrir, escolher o fluxo, preparar dados e ambiente, ensaiar no navegador (Playwright), escrever o roteiro de takes, verificar o export e integrar ao portfólio.
- **Humano (dono)**: gravar e editar no Recordly seguindo o roteiro.

Nunca diga que gravou. Nunca automatize a gravação.

## Fluxo de trabalho

1. **Descobrir** (nunca pule): README, package.json, rotas/páginas, dados de seed/mock, config de env, config de deploy, testes que revelam fluxos. Não é code review. Responda: problema, usuário, fluxo principal, recurso mais forte, o que NÃO mostrar.
2. **Escolher o fluxo**: ordene por impacto visual, valor de produto, relevância técnica, rapidez e originalidade. Prefira um fluxo que mostre várias qualidades (upload -> parse -> validação -> transformação -> preview -> export). Com vários projetos, entregue uma tabela: projeto | fluxo mais forte | valor da demo | dificuldade | prioridade. Qualidade acima de quantidade.
3. **Preparar**: estado inicial conhecido, dados fictícios realistas, navegador limpo, viewport fixo, rede estável. Prefira a URL publicada a localhost; prefira captura de janela.
4. **Ensaiar** no Playwright no viewport final: pegue erros, erros de console, estados de loading, layout shift, cliques sobrando; meça o tempo real de cada passo. Corrija ou replaneje antes do humano gravar.
5. **Entregar o roteiro de takes** (modelo abaixo). Espere o humano gravar.
6. **Depois do export**, rode a checagem e integre.

## Narrativa

Gancho -> Contexto -> Fluxo principal (Entrada -> Ação -> Transformação -> Resultado) -> Prova.

- Gancho nos primeiros segundos, com o visual mais forte. Nunca abra em login, tela vazia, landing page, terminal ou spinner.
- Contexto: curto e visual, sem slides.
- Termine no resultado, parado por ~2s.
- Duração: 30-60s por padrão, 45-90s se complexo, nunca mais de 2 min.
- Tipos de projeto: conversão de dados (origem -> import -> mapeamento -> transformação -> validação -> saída); dashboard (inicial -> filtro -> mudança relevante); CMS (criar -> publicar -> público); ferramenta de segurança (problema -> execução controlada -> evidência -> conclusão; só alvos fictícios); apps CRUD: mostre o fluxo do negócio, não o CRUD.
- Qualidades técnicas (local-first, processamento no cliente, validação, responsivo, tempo real, papéis) precisam aparecer na interface, não ser explicadas pelo código.

## Dados e segurança

- Dados fictícios mas realistas pro domínio. Nunca test123/foo/Fulano, e nunca dados pessoais reais, credenciais, chaves, tokens, cookies, URLs internas, CPF/CNPJ, telefones, e-mails privados ou dados de cliente.
- Nunca estrague o projeto pela demo: nada de UI falsa, redesign, valores de produção fixos no código, recursos removidos, lógica alterada, segurança desligada ou dependências extras. Se precisar de dados ou flags temporárias: só seed/mock/runtime, isolado, grave, reverta e confira que o `git status` está limpo.
- Feche notificações, outros apps e abas pessoais. Sem overlays de dev, devtools, extensões ou favoritos. Fontes e imagens carregadas antes da captura.
- Falha (diálogo de erro, stack trace, layout quebrado, asset faltando, falha de auth): pare, corrija e grave de novo. Nunca edite em volta de um estado quebrado.

## Regras de interação e edição (pro humano)

- Cursor: suavização ligada, trajetos curtos e intencionais, pausa antes das ações importantes, um clique só, deixe as mudanças respirarem. Nada de rodear, vagar, movimento frenético ou hover acidental.
- Corte sem dó: tempo morto, hesitação, clique errado, loading, tentativas repetidas, navegação irrelevante.
- Trechos acelerados só pra esperas inevitáveis; prefira cortar. Nunca acelere a interação principal nem o resultado.
- Zoom só quando quem assiste precisa de ajuda pra ver (controle pequeno, mudança localizada, UI densa, ênfase no resultado). Não em todo clique, não no meio da ação, não agressivo.
- Anotações com moderação: resultado, recurso único, conceito não visual. Nunca em botão óbvio, nunca cobrindo a UI.
- Sem narração, música ou webcam por padrão. Se pedirem narração: roteirizada, curta, sem "e aí, pessoal".
- Não use um recurso do Recordly só porque ele existe.
- Regra de decisão pra cada elemento: aumenta o entendimento? Não -> corta. Talvez -> corta.

## Enquadramento (igual em todos os projetos)

Paisagem 16:9, padding moderado, cantos arredondados, sombra sutil, fundo discreto que combine com a identidade visual do portfólio (leia as cores dele antes de escolher). O app é o protagonista. Mesma faixa de duração, qualidade, ritmo e nomes de arquivo entre projetos, mas nunca o mesmo roteiro.

## Entrega obrigatória: ROTEIRO DE TAKES

Entregue isto em markdown antes de qualquer gravação. Preencha todo campo com valores concretos.

````markdown
# Roteiro: <projeto> (<slug>)
Fluxo: <uma frase>   Duração final esperada: <NN>s   Tempo no ensaio: <NN>s

## Checklist de preparo
- [ ] URL: <URL exata, limpa, sem query sobrando>
- [ ] Janela/viewport: 1440x900 (captura de janela), barra do navegador cortada ou escondida
- [ ] Tema / idioma: <escuro|claro>, <idioma>
- [ ] Dados a carregar: <caminhos, ex.: demo/pedidos-exemplo.csv> (fictícios, conferido que não há dado real)
- [ ] Estado inicial: <logado como usuário demo / upload vazio / etc.>
- [ ] Fechar: notificações, apps de chat, outras abas, extensões, devtools
- [ ] Posição inicial do cursor: <onde>

## Takes
| # | Tempo | Ação (cliques/digitação exatos) | O que quem assiste deve notar | Edição no Recordly |
|---|-------|---------------------------------|-------------------------------|--------------------|
| 1 | 0-4s | Página já mostrando <prévia do resultado>; cursor vai até Upload | <gancho> | nenhuma |
| 2 | 4-10s | Arrastar `pedidos-exemplo.csv` pra área de upload; esperar o parse | <validação instantânea> | zoom 1.8x na área; cortar a espera |
| 3 | ... | ... | ... | 3x nos 6s de processamento / anotação "Roda 100% no navegador" |
| N | fim | Parar no resultado final | <prova> | segurar 2s, sem zoom |

## Configuração do Recordly
- Captura: janela, 16:9
- Fundo: <combina com o portfólio>, padding <moderado>, raio <12-16px>, sombra sutil
- Cursor: suavização ligada, click bounce ligado, motion blur leve
- Sugestões de zoom automático: aceite só as que batem com a tabela
- Webcam desligada, áudio desligado
- Export: MP4, 1080p (1920x1080), alta qualidade; salve o projeto .recordly

## Não mostrar
<dados reais, tokens, UI de dev, etc.>
````

## Checagem pós-export (o agente roda)

1. `ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate -of default=nw=1 file.mp4`: confirme duração na faixa, 1920x1080 (ou o pretendido) e sem áudio, a não ser que seja intencional.
2. Extraia frames e olhe: primeiro, último e um a cada ~2s: `ffmpeg -i file.mp4 -vf fps=0.5 frames/f_%03d.png`. Procure: UI quebrada, diálogos de erro, spinners, dado sensível, UI do editor do Recordly, desktop/barra de tarefas vazando, primeiro frame fraco, último frame sem sentido.
3. Reporte os problemas com timestamp; o humano exporta de novo.
4. Comprima se passar de ~8 MB: `ffmpeg -i in.mp4 -vf "scale=1920:-2" -c:v libx264 -crf 23 -preset slow -pix_fmt yuv420p -movflags +faststart -an out.mp4`
5. Poster: `ffmpeg -ss <t> -i out.mp4 -frames:v 1 -q:v 2 poster.jpg` (o frame mais claro do resultado, não o frame 0, a não ser que ele seja o gancho).
6. Integre ao portfólio: descubra onde ele renderiza mídia de projeto (componente, props, convenção de nomes) e leia um uso existente antes de adicionar vídeo e poster. Siga as convenções e regras de agente do portfólio (AGENTS.md, CLAUDE.md). Confira a página em dev ou no build.
7. Nunca commite vídeos grandes nos repositórios dos projetos.

## Organização dos arquivos

Guarde as demos fora dos repositórios dos projetos: `<pasta-de-demos>/<projeto>/{source/<projeto>.recordly, exports/<projeto>.mp4|gif, README.md}`. README: fluxo, dados usados, data, configuração do Recordly, versão do projeto gravada. Guarde o .recordly quando a edição for relevante ou um novo export for provável. MP4 por padrão; GIF só pra loops curtos (menos de ~8s).

## Antipadrões

Captura crua, despejo de recursos, vitrine de CRUD, tour pela UI, cursor caótico, zoom em tudo, simulador de loading, demo de dev (terminal, instalação, debug), produto falso, produção exagerada, produção fraca.

Grave de novo quando: confuso, cursor caótico, visual quebrado, recurso principal pouco claro, longo demais, zooms que distraem, resultado fraco ou o projeto mudou.

## Relatório final

Demo concluída | Projeto | Fluxo principal | Duração | Caminho do export | Caminho do projeto Recordly | Observações.

Regra de ouro: mostre o produto, a interação importante e o resultado. Corte todo o resto.
