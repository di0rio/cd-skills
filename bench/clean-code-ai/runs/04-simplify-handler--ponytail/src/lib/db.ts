export const db = {
	user: {
		async update(args: { where: { id: string }; data: { name: string; bio: string | null } }) {
			return { id: args.where.id, ...args.data };
		},
	},
};
