// Texto entre crases vira código mono na página (ver `Rich`).
export default {
	meta: {
		description: {
			pt: "Regras que eu escrevi pra agentes de IA (Claude Code, Codex, Cursor) trabalharem do jeito que eu trabalho. De graça, com licença MIT.",
			en: "Rules I wrote so AI agents (Claude Code, Codex, Cursor) work the way I do. Free, under the MIT license.",
		},
	},
	home: {
		title: { pt: "skills", en: "skills" },
		intro: {
			pt: "Regras que eu escrevi pra agentes de IA (Claude Code, Codex, Cursor) trabalharem do jeito que eu trabalho. Cada skill é um arquivo `SKILL.md`, em português e em inglês. São de graça, com licença MIT.",
			en: "Rules I wrote so AI agents (Claude Code, Codex, Cursor) work the way I do. Each skill is a single `SKILL.md` file, in Portuguese and English. Free, under the MIT license.",
		},
		list: { pt: "as skills", en: "the skills" },
		empty: { pt: "ainda não tem skill por aqui.", en: "no skills here yet." },
		install: {
			title: { pt: "instalar", en: "install" },
			label: { pt: "Jeitos de instalar", en: "Ways to install" },
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
