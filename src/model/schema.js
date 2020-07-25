import { appSchema, tableSchema } from '@nozbe/watermelondb'

// export default appSchema({
// 	version: 1,
// 	tables: [
// 		// tableSchemas go here...
// 	]
// })

const mySchema = appSchema({
// export const mySchema = appSchema({
	version: 1,
	tables: [
		tableSchema({
			name: 'posts',
			columns: [
				{ name: 'title', type: 'string' },
				{ name: 'subtitle', type: 'string', isOptional: true },
				{ name: 'body', type: 'string' },
				{ name: 'is_pinned', type: 'boolean' },
			]
		}),
		tableSchema({
			name: 'comments',
			columns: [
				{ name: 'body', type: 'string' },
				{ name: 'post_id', type: 'string', isIndexed: true },
			]
		}),
	]
})

export default mySchema