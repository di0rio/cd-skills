import { isValidElement, type ReactNode } from "react";
import ReactMarkdown, {
	type Components,
	defaultUrlTransform,
} from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeCopy } from "@/components/code-copy";
import { rewriteLink } from "@/lib/skills";
import { slugify } from "@/lib/slugify";

// Link externo abre em outra aba sem dar acesso à janela de origem.
const link: Components["a"] = ({ href, title, children }) => {
	const external = href && /^(https?:)?\/\//i.test(href);
	return (
		<a
			href={href}
			title={title}
			{...(external && { rel: "noopener noreferrer", target: "_blank" })}
		>
			{children}
		</a>
	);
};

const textOf = (node: ReactNode): string =>
	typeof node === "string" || typeof node === "number"
		? String(node)
		: Array.isArray(node)
			? node.map(textOf).join("")
			: isValidElement<{ children?: ReactNode }>(node)
				? textOf(node.props.children)
				: "";

type CopyLabels = { label: string; done: string };

/** h2/h3 com id (e o "#" de link direto) e bloco de código com linguagem e botão de copiar. */
function enhance(copy: CopyLabels): Components {
	const seen = new Map<string, number>();
	const heading = (Tag: "h2" | "h3"): Components["h2"] => {
		const Heading: Components["h2"] = ({ children }) => {
			const label = textOf(children);
			const base = slugify(label) || "secao";
			const n = seen.get(base) ?? 0;
			seen.set(base, n + 1);
			const id = n ? `${base}-${n}` : base;
			return (
				<Tag id={id}>
					{children}
					<a aria-label={label} className="anchor" href={`#${id}`}>
						#
					</a>
				</Tag>
			);
		};
		return Heading;
	};

	return {
		a: link,
		h2: heading("h2"),
		h3: heading("h3"),
		pre: ({ children }) => {
			const lang = isValidElement<{ className?: string }>(children)
				? /language-([\w+#-]+)/.exec(children.props.className ?? "")?.[1]
				: undefined;
			return (
				<div className="code">
					<div className="code-bar">
						<span>{lang !== "text" && lang}</span>
						<CodeCopy
							done={copy.done}
							label={copy.label}
							text={textOf(children).replace(/\n$/, "")}
						/>
					</div>
					<pre>{children}</pre>
				</div>
			);
		},
	};
}

/**
 * Renderiza o README de uma skill. Caminhos relativos (`SKILL.md`, `../../LICENSE`) apontam pro arquivo
 * no GitHub (ver `rewriteLink`).
 *
 * Segurança: HTML cru não é renderizado (sem rehype-raw) e esquemas como `javascript:` são barrados
 * pelo `defaultUrlTransform`.
 */
export function Markdown({
	children,
	slug,
	copy,
}: {
	children: string;
	slug: string;
	copy: CopyLabels;
}) {
	return (
		<div className="markdown">
			<ReactMarkdown
				components={enhance(copy)}
				remarkPlugins={[remarkGfm]}
				urlTransform={(url, key) =>
					defaultUrlTransform(rewriteLink(url, slug, key))
				}
			>
				{children}
			</ReactMarkdown>
		</div>
	);
}
