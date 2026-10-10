// Texto entre crases vira código mono na página (ver `Rich`).
export default {
	meta: {
		description: {
			pt: "Regras que eu escrevi pra agentes de IA (Claude Code, Codex, Cursor) trabalharem do jeito que eu trabalho. De graça, com licença MIT.",
			en: "Rules I wrote so AI agents (Claude Code, Codex, Cursor) work the way I do. Free, under the MIT license.",
		},
	},
	home: {
		hero: {
			eyebrow: {
				pt: "cd/skills · {count} skills pra agente de IA",
				en: "cd/skills · {count} skills for AI agents",
			},
			line1: { pt: "regras pra IA", en: "rules so AI" },
			line2: { pt: "trabalhar do meu jeito.", en: "works the way I do." },
			sub: {
				pt: "Cada skill é um `SKILL.md`, em português e inglês. De graça, MIT.",
				en: "Each skill is one `SKILL.md`, in Portuguese and English. Free, MIT.",
			},
			install: { pt: "instalar em uma linha", en: "install in one line" },
			browse: { pt: "ver as skills", en: "see the skills" },
			avatar: {
				pt: "Cauã, quem escreveu as skills",
				en: "Cauã, who wrote the skills",
			},
		},
		skills: {
			label: { pt: "skills", en: "skills" },
			title: { pt: "as skills que eu uso.", en: "the skills I use." },
			open: { pt: "abrir", en: "open" },
			removed: { pt: "removido", en: "removed" },
			added: { pt: "adicionado", en: "added" },
			before: { pt: "antes", en: "before" },
			after: { pt: "depois", en: "after" },
			empty: { pt: "ainda não tem skill por aqui.", en: "no skills here yet." },
		},
		how: {
			label: { pt: "como funciona", en: "how it works" },
			title: { pt: "como funciona.", en: "how it works." },
			step1: { pt: "instala a skill", en: "install the skill" },
			text1: {
				pt: "Um comando copia a pasta da skill pro seu agente.",
				en: "One command copies the skill folder into your agent.",
			},
			step2: { pt: "o agente lê o SKILL.md", en: "the agent reads SKILL.md" },
			text2: {
				pt: "Ele carrega o arquivo quando a tarefa pede, ou quando você chama a skill pelo nome.",
				en: "It loads the file when the task calls for it, or when you call the skill by name.",
			},
			step3: {
				pt: "ele passa a seguir as regras",
				en: "it starts following the rules",
			},
			text3: {
				pt: "Daí em diante ele trabalha do jeito que eu escrevi, sem você repetir nada no prompt.",
				en: "From then on it works the way I wrote it, without you repeating anything in the prompt.",
			},
		},
		install: {
			label: { pt: "instalar", en: "install" },
			title: { pt: "instala em uma linha.", en: "install in one line." },
			tabs: { pt: "Jeitos de instalar", en: "Ways to install" },
			cli: { pt: "skills CLI", en: "skills CLI" },
			claude: { pt: "Claude Code", en: "Claude Code" },
			others: { pt: "outros agentes", en: "other agents" },
			cliText: {
				pt: "Com a skills CLI você instala todas de uma vez ou escolhe uma.",
				en: "With the skills CLI you install all of them at once or pick one.",
			},
			claudeText: {
				pt: "Copia a pasta da skill pra `~/.claude/skills/<skill>`. Pra usar a versão em português, renomeia `SKILL.pt.md` pra `SKILL.md`.",
				en: "Copy the skill folder to `~/.claude/skills/<skill>`. For the Portuguese version, rename `SKILL.pt.md` to `SKILL.md`.",
			},
			othersText: {
				pt: "Cola o corpo do `SKILL.md` no arquivo de regras do seu agente: `AGENTS.md`, `CLAUDE.md` ou `.cursor/rules`.",
				en: "Paste the body of `SKILL.md` into your agent's rules file: `AGENTS.md`, `CLAUDE.md` or `.cursor/rules`.",
			},
		},
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
			idea: { pt: "ideia", en: "idea" },
			list: { pt: "lista", en: "list" },
			stats: { pt: "números", en: "numbers" },
			modes: { pt: "modos", en: "modes" },
			readme: { pt: "readme", en: "readme" },
		},
		onlyEnglish: {
			pt: "Esse texto só existe em inglês por enquanto.",
			en: "This text is only available in English.",
		},
	},
	notFound: {
		path: { pt: "skill-que-nao-existe", en: "skill-that-doesnt-exist" },
		error: {
			pt: "cd: arquivo ou diretório inexistente",
			en: "cd: no such file or directory",
		},
		title: { pt: "essa página não existe.", en: "this page doesn't exist." },
		body: {
			pt: "Esse caminho não existe por aqui. Manda um cd .. ou usa o link aí embaixo pra voltar.",
			en: "That path doesn’t exist here. Type cd .. or use the link below to head back.",
		},
		home: { pt: "voltar pro começo", en: "back to the start" },
	},
};
