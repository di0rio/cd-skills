export const MOTION_KEY = "cd-skills-motion";

/** Pausa guardada no navegador. Sem acesso ao storage (aba privada, bloqueio), vale só nessa visita. */
export function storedPause() {
	try {
		return localStorage.getItem(MOTION_KEY) === "paused";
	} catch {
		return false;
	}
}

export function storePause(paused: boolean) {
	try {
		localStorage.setItem(MOTION_KEY, paused ? "paused" : "on");
	} catch {
		return;
	}
}

/** Movimento desligado pelo botão de pausa ou pelo sistema (`prefers-reduced-motion`). */
export const motionOff = () =>
	storedPause() || matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Marca o `<html>` pro CSS parar as animações e transições do site. */
export const applyPause = (paused: boolean) =>
	document.documentElement.toggleAttribute("data-motion-paused", paused);
