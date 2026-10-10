/**
 * Mola criticamente amortecida (damping 1, sem passar do alvo) como easing `linear()` do CSS, pra usar na Web
 * Animations API. `response` é o tempo de resposta da mola, em segundos (como no UIKit): quanto menor, mais rápida.
 * A duração devolvida é o quanto leva pra assentar abaixo de 0,1%.
 */
export function spring(response = 0.4) {
	const omega = (2 * Math.PI) / response;
	const duration = response * 1.5;
	const steps = 48;
	const points = Array.from({ length: steps + 1 }, (_, i) => {
		const t = (i / steps) * duration;
		return i === steps
			? 1
			: +(1 - (1 + omega * t) * Math.exp(-omega * t)).toFixed(4);
	});
	return { easing: `linear(${points.join(", ")})`, duration: duration * 1000 };
}

/** Sem suporte a `linear()` o easing vira a curva forte de saída do site. */
export const supportsLinear = () =>
	typeof CSS !== "undefined" &&
	CSS.supports("animation-timing-function", "linear(0, 1)");

export const fallbackEasing = "cubic-bezier(0.23, 1, 0.32, 1)";
