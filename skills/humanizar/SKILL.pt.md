---
name: humanizar
description: Reescreve textos com "cara de IA" para soarem escritos pela pessoa que assina, escreve do zero na voz dela e usa textos de referência só como inspiração. Use sempre que o usuário pedir para humanizar, naturalizar, "tirar cara de ChatGPT/IA", deixar menos robótico, menos genérico, mais natural ou mais "meu", revisar o tom de um texto, ou mandar um texto de outra pessoa dizendo "algo nessa linha". Use também, sem o usuário pedir, ao redigir posts de LinkedIn/redes, descrição de projeto de portfólio, bio, "sobre mim", copy de site ou landing, README voltado a pessoas, redação, resumo, introdução ou conclusão de trabalho acadêmico. Cobre PT-BR e EN. Não use para código, mensagens de commit ou respostas curtas de chat.
---

# Humanizar

Texto de IA não é ruim por ser de IA. É ruim porque é genérico: diz o óbvio com palavras infladas, em ritmo uniforme, com estrutura previsível. Leitor percebe em duas linhas e para de confiar. O objetivo é texto **específico, direto e com a voz de quem assina**, não texto "disfarçado".

Humanizar **não** é inserir erro de digitação, gíria forçada, "kkk" ou frase quebrada de propósito. Imperfeição fabricada é outro tique, só que pior.

## Três modos

1. **Reescrever**: o usuário entrega um texto e quer a versão humanizada.
2. **Escrever**: Claude vai redigir algo para pessoas lerem (post, bio, README, copy de site). Aplique tudo abaixo na primeira escrita, sem anunciar.
3. **Inspirar**: o usuário manda um texto de outra pessoa ("acho que a ideia é essa", "algo nessa linha"). Veja a seção própria abaixo. **Referência nunca é molde.**

## Antes de escrever: ache a voz

"Preserve a voz do autor" não funciona sem saber qual é a voz. Antes de escrever ou reescrever:

1. **Junte 2 a 4 amostras do que a pessoa já publicou**: posts, outras páginas do mesmo site, README, textos antigos no projeto. Mensagens de chat servem para entender o jeito de falar, mas o registro publicado costuma ser um degrau mais limpo (quem escreve "mano tlgd" no chat pode escrever "pra" e "manjo" no site, mas não "tlgd").
2. **Anote 3 a 5 traços concretos**: pessoa do verbo, comprimento médio de frase, gírias e contrações que aparecem ("pra", "tô", "tipo"), se usa maiúscula em título, se faz piada, palavras que a pessoa nunca usaria.
3. **Escreva com esses traços.** Se não houver amostra nenhuma, escreva neutro e direto, e pergunte.

## Processo

1. **Gênero, idioma e público.** Cada gênero tem convenção própria, veja `references/generos.md`.
2. **Liste as afirmações concretas** que o texto precisa carregar. Texto de IA costuma ter 3 ideias espalhadas em 300 palavras.
3. **Confira de onde vem cada fato.** Só entra o que está no texto original, nos arquivos do projeto ou no que o usuário disse. Detalhe concreto que você não tem fonte, você **não escreve**: pergunta (em texto curto) ou deixa `[exemplo concreto aqui]` (em texto longo).
4. **Escreva a partir das ideias, não frase a frase.** Trocar sinônimo mantém o esqueleto robótico. Comece pelo ponto mais interessante, corte o que não carrega informação.
5. **Faça a auditoria final** (abaixo) no seu próprio texto antes de entregar.

## Regras centrais

- **Cena vence abstração.** "Do banco e da API até o último estado da tela" é abstrato. "Se a tela precisa de uma rota nova, eu faço" é uma situação que o leitor imagina. Prefira o que dá para ver acontecendo.
- **Específico vence genérico**, desde que o específico seja verdade (passo 3).
- **Varie o ritmo.** Frase curta. Depois uma mais longa, que desenvolve a ideia com calma. IA escreve tudo no mesmo comprimento.
- **Termine quando o conteúdo acabar.** Sem frase de efeito no fim, sem moral, sem aforismo ("código que eu não entendo não entra", "e isso faz toda a diferença"). Se a última frase cabe numa caneca, corte ou troque por um fato.
- **Corte abertura vazia.** Nada de "Em um mundo cada vez mais conectado...". Comece no assunto.
- **Palavra que a pessoa usaria.** Em bio e texto de site, nada de termo técnico que ela não falaria numa conversa ("estado de carregamento", "rota", "camada de serviço"). Fale do que ela curte, do jeito que ela fala ("curto motion e design"), e deixe o detalhe técnico pro estudo de caso.
- **Verbo comum.** "Usar", não "alavancar". "Mostrar", não "evidenciar". "Use", not "leverage".
- **Afirme.** Tire "é importante ressaltar que", "vale destacar", "it's worth noting".
- **Menos pontuação dramática.** Travessão e dois-pontos de suspense são marca forte em PT-BR. E dois-pontos seguido de **lista de três** ("o carregamento, o erro, a velocidade") é o tique que mais sobrevive à revisão.
- **Sem formatação decorativa** quando o gênero não pede.
- **Mantenha idioma e registro.** Acadêmico continua acadêmico, só que claro. Post continua post.

## Modo inspirar (texto de referência)

A pessoa gostou de algo no texto do outro. Seu trabalho é descobrir **o quê** e fazer isso com o material e a voz dela.

1. **Diga em uma linha o que a referência faz bem** (os movimentos, não as palavras). Ex.: "diz para quem o trabalho é", "admite uma preferência pessoal concreta", "termina com onde te achar".
2. **Não copie:** estrutura em parágrafos igual, ordem das frases, expressões, imagens ("software people spend their whole workday in"), nem **fatos** da referência (outra pessoa pode fazer ERP e ter X; o usuário talvez não).
3. **Escreva com os fatos e a voz do usuário** (seção "ache a voz").
4. **Teste de distância:** leia as duas lado a lado. Se alguém percebe que uma foi feita em cima da outra, reescreva.

## Texto curto (bio, tagline, legenda, título)

Em texto de até ~4 frases, entregue **2 ou 3 versões com ângulos diferentes** (ex.: uma mais direta, uma com mais humor, uma focada no trabalho), cada uma com uma linha dizendo o ângulo. Uma versão só vira vai-e-volta. Se o usuário já escolheu o ângulo, entregue uma.

## Auditoria final (rode no seu texto, sempre)

- [ ] Última frase de cada parágrafo é fato ou slogan? Slogan sai.
- [ ] Tem dois-pontos seguido de três itens? Tem trio de adjetivos? Mude para dois, quatro ou prosa.
- [ ] Tem "do X até Y", "de ponta a ponta", "não é X, é Y"? Troque por cena ou afirmação direta.
- [ ] Algum fato sem fonte (passo 3)? Tire ou pergunte.
- [ ] A pessoa falaria isso em voz alta para um amigo, do jeito que está? Se não, reescreva a frase.
- [ ] (Modo inspirar) Passa no teste de distância?

Os tiques detalhados estão em `references/padroes.md`. Um isolado não condena; acúmulo sim.

## Formato da resposta

1. O texto pronto para copiar (ou as 2-3 versões, em texto curto), num bloco só cada.
2. Até 4 linhas curtas com as mudanças principais. Pule se o usuário pediu só o texto.
3. Fatos que faltaram ou que você não pôde confirmar, como pergunta direta.

Se o texto já está bom, diga e mude pouco. Reescrever por reescrever piora.

## Limites

- Não prometa que o texto "passa em detector de IA". Detectores são pouco confiáveis e o foco é qualidade de leitura.
- Em trabalho acadêmico, mantenha ideias, argumentos e citações do autor. Nunca invente referência, dado ou autor. Se o usuário quer o trabalho inteiro escrito do zero para entregar como seu, lembre de checar as regras da instituição sobre uso de IA.

## Referências

- `references/padroes.md`: catálogo de tiques em PT-BR e EN, incluindo os que sobrevivem à primeira revisão. Leia ao revisar qualquer texto.
- `references/generos.md`: o que muda em post, portfólio/bio, copy de site, redação e texto acadêmico.
