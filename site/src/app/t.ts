// Texto entre crases vira código mono na página (ver `Rich`).
export default {
	meta: {
		description: {
			pt: "Skills que escrevi para agentes de IA, como Claude Code, Codex e Cursor, trabalharem com as regras que uso no meu dia a dia. O código é aberto e a licença é MIT.",
			en: "Skills I wrote to help AI agents like Claude Code, Codex and Cursor follow the rules I use in my own work. The code is open source under the MIT license.",
		},
	},
	home: {
		hero: {
			eyebrow: {
			pt: "// {count} skills para Claude Code e outros agentes",
				en: "// {count} skills for Claude Code and other agents",
			},
			line1: { pt: "regras para a IA", en: "rules so AI" },
			line2: { pt: "trabalhar do meu jeito.", en: "works the way I do." },
			sub: {
			pt: "Cada skill vem em um `SKILL.md`, em português e inglês, e pode ser instalada com um comando. Código aberto, licença MIT.",
				en: "Each skill is one `SKILL.md`, in Portuguese and English. One command installs it. Free, MIT.",
			},
			browse: { pt: "ver as skills", en: "see the skills" },
			avatar: {
				pt: "Cauã, quem escreveu as skills",
				en: "Cauã, who wrote the skills",
			},
		},
		skills: {
			label: { pt: "skills", en: "skills" },
			title: { pt: "skills que fazem parte do meu trabalho.", en: "skills I use in my work." },
			open: { pt: "ver skill", en: "open" },
			removed: { pt: "removido", en: "removed" },
			added: { pt: "adicionado", en: "added" },
			before: { pt: "antes", en: "before" },
			after: { pt: "depois", en: "after" },
			empty: { pt: "Ainda não há skills por aqui.", en: "no skills here yet." },
		},
		demo: {
			label: { pt: "na prática", en: "in practice" },
			title: { pt: "uma skill em ação.", en: "a skill at work." },
			intro: {
				pt: "Selecione cada etapa para ver o que muda no código ou no texto.",
				en: "Click the steps to see what changes in the code or the text.",
			},
			steps: { pt: "Passos", en: "Steps" },
			pick: { pt: "Escolher a skill", en: "Pick the skill" },
			step1: { pt: "o pedido", en: "the request" },
			text1: {
				pt: "O agente recebe a tarefa original, sem as regras da skill.",
				en: "The agent gets the task the way it came, with no rules applied yet.",
			},
			step2: { pt: "a skill entra", en: "the skill kicks in" },
			text2: {
				pt: "Ele lê o `SKILL.md` e marca o que não precisa estar ali.",
				en: "It reads `SKILL.md` and marks what doesn't need to be there.",
			},
			step3: { pt: "o resultado", en: "the result" },
			text3: {
				pt: "O resultado mantém só o código necessário para resolver o pedido.",
				en: "Only what solves it is left. The rest goes.",
			},
		},
		bench: {
			label: { pt: "benchmark", en: "benchmark" },
			title: { pt: "com e sem a skill.", en: "with and without the skill." },
			intro: {
				pt: "As mesmas tarefas foram executadas pelo mesmo modelo, com e sem a skill. Um segundo modelo avaliou as respostas sem saber qual versão tinha recebido a skill.",
				en: "Same tasks, same model: one run with the skill and one without. A second model graded them without knowing which was which.",
			},
			task: { pt: "tarefa", en: "task" },
			without: { pt: "sem a skill", en: "without" },
			with: { pt: "com a skill", en: "with" },
			total: { pt: "total", en: "total" },
			higher: { pt: "maior é melhor", en: "higher is better" },
			more: { pt: "pontos a mais", en: "points more" },
			caption: {
			pt: "Cada tarefa foi executada uma vez. Os resultados servem como referência inicial, não como prova conclusiva.",
				en: "Each task ran once, so read it as a rough check, not proof.",
			},
			results: { pt: "ver os resultados", en: "see the results" },
		},
		how: {
			label: { pt: "como funciona", en: "how it works" },
			title: { pt: "como funciona.", en: "how it works." },
			step1: { pt: "instale a skill", en: "install the skill" },
			text1: {
			pt: "Um comando instala a pasta da skill no agente que você usa.",
				en: "One command copies the skill folder into your agent.",
			},
			step2: { pt: "o agente lê o SKILL.md", en: "the agent reads SKILL.md" },
			text2: {
				pt: "O agente carrega o arquivo quando a tarefa se encaixa nas regras ou quando você chama a skill pelo nome.",
				en: "It loads the file when the task calls for it, or when you call the skill by name.",
			},
			step3: {
				pt: "ele passa a seguir as regras",
				en: "it starts following the rules",
			},
			text3: {
				pt: "A partir daí, o agente segue as regras sem que você precise repeti-las no prompt.",
				en: "From then on it works the way I wrote it, without you repeating anything in the prompt.",
			},
		},
	},
	install: {
		tabs: { pt: "Jeitos de instalar", en: "Ways to install" },
		all: { pt: "todas", en: "all" },
		manual: { pt: "manual", en: "by hand" },
		agents: { pt: "configurar agente", en: "setup for agents" },
		agentsDone: { pt: "prompt copiado", en: "prompt copied" },
		agentsPrompt: {
			pt: "Instale as skills do repositório di0rio/cd-skills com `{command}` e informe quais foram adicionadas.",
			en: "Install the skills from the di0rio/cd-skills repository by running `{command}` and tell me which ones were added.",
		},
		manualClaude: {
			pt: "Claude Code: copie a pasta da skill para `~/.claude/skills/<skill>`. Para usar a versão em português, renomeie `SKILL.pt.md` para `SKILL.md`.",
			en: "Claude Code: copy the skill folder to `~/.claude/skills/<skill>`. For the Portuguese version, rename `SKILL.pt.md` to `SKILL.md`.",
		},
		manualOthers: {
			pt: "Outros agentes: copie o conteúdo do `SKILL.md` para o arquivo de regras, como `AGENTS.md`, `CLAUDE.md` ou `.cursor/rules`.",
			en: "Other agents: paste the body of `SKILL.md` into the rules file, like `AGENTS.md`, `CLAUDE.md` or `.cursor/rules`.",
		},
	},
	cta: {
		label: { pt: "instalar", en: "install" },
		title: { pt: "instale e experimente.", en: "install and try it." },
		text: {
			pt: "Escolha uma skill e teste em uma tarefa real. Se notar algo que dá pra melhorar, me manda uma sugestão pelo GitHub.",
			en: "Grab a skill, run it on a real task and see if it helps. If it doesn't, open an issue.",
		},
		github: { pt: "ver no github", en: "view on github" },
	},
	skill: {
		back: { pt: "todas as skills", en: "all skills" },
		nav: { pt: "Entre as skills", en: "Between skills" },
		files: { pt: "Arquivos da skill", en: "Skill files" },
		github: { pt: "ver no github", en: "view on github" },
		post: { pt: "ler o post", en: "read the post" },
		readme: { pt: "leia o README", en: "read the README" },
		// Rótulo pequeno em cima de cada seção numerada.
		sections: {
			idea: { pt: "na prática", en: "in practice" },
			list: { pt: "lista", en: "list" },
			stats: { pt: "números", en: "numbers" },
			modes: { pt: "modos", en: "modes" },
			readme: { pt: "readme", en: "readme" },
			bench: { pt: "benchmark", en: "benchmark" },
			related: { pt: "mais skills", en: "more skills" },
		},
		relatedTitle: { pt: "as outras skills.", en: "the other skills." },
		manual: {
			pt: "Copie a pasta `skills/{slug}` para `~/.claude/skills/{slug}`. Para usar em português, renomeie `SKILL.pt.md` para `SKILL.md`.",
			en: "Copy the `skills/{slug}` folder to `~/.claude/skills/{slug}`. For Portuguese, rename `SKILL.pt.md` to `SKILL.md`.",
		},
		onlyEnglish: {
			pt: "Este texto está disponível apenas em inglês por enquanto.",
			en: "This text is only available in English.",
		},
	},
	notFound: {
		path: { pt: "skill-que-nao-existe", en: "skill-that-doesnt-exist" },
		error: {
			pt: "cd: arquivo ou diretório inexistente",
			en: "cd: no such file or directory",
		},
		title: { pt: "esta página não existe.", en: "this page doesn't exist." },
		body: {
			pt: "Esse caminho não existe por aqui. Use `cd ..` ou o link abaixo para voltar.",
			en: "That path doesn’t exist here. Type cd .. or use the link below to head back.",
		},
		home: { pt: "voltar ao início", en: "back to the start" },
	},
};
