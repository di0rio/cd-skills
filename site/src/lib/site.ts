// Dados fixos num lugar só. Os textos traduzidos ficam nos `t.ts`.
export const site = {
	name: "cd/skills",
	repo: "di0rio/cd-skills",
	branch: "main",
	github: "https://github.com/di0rio/cd-skills",
	portfolio: "https://cauadiorio.vercel.app",
	// Na Vercel usa o domínio de produção do projeto; local, o dev server.
	url: process.env.VERCEL_PROJECT_PRODUCTION_URL
		? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
		: "http://localhost:3000",
};
