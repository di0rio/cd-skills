/** Os quatro "+" nos cantos do pai (que precisa ser `relative`). Só decoração. */
export function Corners() {
	return (
		<span aria-hidden="true" className="contents">
			<i className="xh top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
			<i className="xh top-0 right-0 translate-x-1/2 -translate-y-1/2" />
			<i className="xh bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
			<i className="xh right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
		</span>
	);
}
