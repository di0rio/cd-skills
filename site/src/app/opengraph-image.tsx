import { translations } from "@/i18n/generated";
import { ogSize, pageOg } from "@/lib/og";

// Prévia do link da home. Robôs não mandam cookie, então sai no idioma padrão.
export const alt = "cd/skills";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
	return pageOg({
		title: translations.pt.app.home.title,
		description: translations.pt.app.meta.description,
	});
}
