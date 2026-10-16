import { type NextRequest, NextResponse } from "next/server";

// Português na raiz, inglês em /en. Por dentro tudo vive em app/[locale]: "/" vira "/pt" sem mudar a URL.
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (/^\/en(\/|$)/.test(pathname)) return NextResponse.next();

	// /pt/... é só a versão interna; quem digitar vai pra URL sem prefixo.
	// Exceção: o Next aponta a og:image das skills pra /pt/.../opengraph-image; passa direto pra não virar redirect pro crawler.
	if (/^\/pt(\/|$)/.test(pathname)) {
		if (pathname.endsWith("/opengraph-image")) return NextResponse.next();
		const url = request.nextUrl.clone();
		url.pathname = pathname.slice(3) || "/";
		return NextResponse.redirect(url, 308);
	}

	const url = request.nextUrl.clone();
	url.pathname = `/pt${pathname}`;
	return NextResponse.rewrite(url);
}

export const config = {
	// Fora: arquivos internos, a imagem de prévia da home e qualquer arquivo com extensão (ícones, sitemap, robots, /public).
	matcher: ["/((?!_next|api|opengraph-image|.*\\..*).*)"],
};
