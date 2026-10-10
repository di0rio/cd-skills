"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { SitePrompt } from "@/components/site-shell/site-prompt";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";

type Labels = {
	back: string;
	forward: string;
	address: string;
	copied: string;
};

function Step({
	label,
	onClick,
	children,
}: {
	label: string;
	onClick: () => void;
	children: ReactNode;
}) {
	return (
		<Tooltip>
			<TooltipTrigger
				aria-label={label}
				onClick={onClick}
				render={<Button size="icon-sm" type="button" variant="ghost" />}
			>
				{children}
			</TooltipTrigger>
			<TooltipPopup>{label}</TooltipPopup>
		</Tooltip>
	);
}

/** Barra de ferramentas da janela: voltar/avançar, o campo de endereço no meio e os controles do site à direita. */
export function Toolbar({
	labels,
	children,
}: {
	labels: Labels;
	children: ReactNode;
}) {
	return (
		<div className="flex h-[46px] shrink-0 items-center gap-1.5 border-b bg-chrome px-2.5 sm:gap-2">
			<div className="flex items-center max-sm:hidden">
				<Step label={labels.back} onClick={() => window.history.back()}>
					<ArrowLeftIcon aria-hidden="true" />
				</Step>
				<Step label={labels.forward} onClick={() => window.history.forward()}>
					<ArrowRightIcon aria-hidden="true" />
				</Step>
			</div>
			<div className="flex min-w-0 flex-1 justify-center">
				<SitePrompt done={labels.copied} label={labels.address} />
			</div>
			<div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
				{children}
			</div>
		</div>
	);
}
