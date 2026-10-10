import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

// Ubuntu em TTF direto do Google Fonts; se falhar, cai na fonte padrão do ImageResponse.
async function ubuntu(weight: 400 | 700) {
	try {
		const css = await (
			await fetch(
				`https://fonts.googleapis.com/css2?family=Ubuntu:wght@${weight}`,
			)
		).text();
		const url = css.match(
			/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/,
		)?.[1];
		return url ? await (await fetch(url)).arrayBuffer() : null;
	} catch {
		return null;
	}
}

const clip = (text: string, max: number) =>
	text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

/** Prévia de link: prompt `~ $ cd skills/<path>`, título, descrição e o endereço do repositório. */
export async function pageOg({
	path = "",
	title,
	description,
}: {
	path?: string;
	title: string;
	description?: string;
}) {
	const [regular, bold] = await Promise.all([ubuntu(400), ubuntu(700)]);
	const fonts = [
		...(regular
			? [{ name: "Ubuntu", data: regular, weight: 400 as const }]
			: []),
		...(bold ? [{ name: "Ubuntu", data: bold, weight: 700 as const }] : []),
	];

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				padding: 80,
				background: "#1c1c1c",
				color: "#f5f5f5",
				fontFamily: "Ubuntu",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					fontSize: 34,
					color: "#a3a3a3",
				}}
			>
				<span style={{ color: "#ffd23f" }}>~</span>&nbsp;$ cd skills
				{path && `/${clip(path, 40)}`}
				<span
					style={{
						width: 18,
						height: 36,
						marginLeft: 10,
						background: "#ffd23f",
					}}
				/>
			</div>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div
					style={{
						fontSize: title.length > 18 ? 76 : 104,
						fontWeight: 700,
						lineHeight: 1.05,
					}}
				>
					{clip(title, 40)}
				</div>
				{description && (
					<div
						style={{
							marginTop: 28,
							fontSize: 38,
							lineHeight: 1.3,
							color: "#a3a3a3",
						}}
					>
						{clip(description, 130)}
					</div>
				)}
			</div>
			<div
				style={{
					display: "flex",
					alignItems: "baseline",
					gap: 20,
					fontSize: 30,
					color: "#a3a3a3",
				}}
			>
				<div style={{ display: "flex", fontSize: 44, fontWeight: 700 }}>
					<span style={{ color: "#f5f5f5" }}>cd</span>
					<span style={{ color: "#ffd23f" }}>/</span>
					<span style={{ color: "#f5f5f5" }}>skills</span>
				</div>
				<div style={{ display: "flex" }}>github.com/{site.repo}</div>
			</div>
		</div>,
		{ ...ogSize, fonts: fonts.length ? fonts : undefined },
	);
}
