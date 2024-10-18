import { relations } from "drizzle-orm/relations";
import { usersInAuth, customers, products, prices, workspaces, folders, subscriptions, users, collaborators, files } from "./schema";

export const customersRelations = relations(customers, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [customers.id],
		references: [usersInAuth.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	customers: many(customers),
	subscriptions: many(subscriptions),
	users: many(users),
}));

export const pricesRelations = relations(prices, ({one, many}) => ({
	product: one(products, {
		fields: [prices.productId],
		references: [products.id]
	}),
	subscriptions_priceId: many(subscriptions, {
		relationName: "subscriptions_priceId_prices_id"
	}),
	subscriptions_priceId: many(subscriptions, {
		relationName: "subscriptions_priceId_prices_id"
	}),
}));

export const productsRelations = relations(products, ({many}) => ({
	prices: many(prices),
}));

export const foldersRelations = relations(folders, ({one, many}) => ({
	workspace: one(workspaces, {
		fields: [folders.workspaceId],
		references: [workspaces.id]
	}),
	files: many(files),
}));

export const workspacesRelations = relations(workspaces, ({many}) => ({
	folders: many(folders),
	collaborators: many(collaborators),
	files: many(files),
}));

export const subscriptionsRelations = relations(subscriptions, ({one}) => ({
	price_priceId: one(prices, {
		fields: [subscriptions.priceId],
		references: [prices.id],
		relationName: "subscriptions_priceId_prices_id"
	}),
	price_priceId: one(prices, {
		fields: [subscriptions.priceId],
		references: [prices.id],
		relationName: "subscriptions_priceId_prices_id"
	}),
	usersInAuth: one(usersInAuth, {
		fields: [subscriptions.userId],
		references: [usersInAuth.id]
	}),
	user: one(users, {
		fields: [subscriptions.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	subscriptions: many(subscriptions),
	usersInAuth: one(usersInAuth, {
		fields: [users.id],
		references: [usersInAuth.id]
	}),
	collaborators: many(collaborators),
}));

export const collaboratorsRelations = relations(collaborators, ({one}) => ({
	user: one(users, {
		fields: [collaborators.userId],
		references: [users.id]
	}),
	workspace: one(workspaces, {
		fields: [collaborators.workspaceId],
		references: [workspaces.id]
	}),
}));

export const filesRelations = relations(files, ({one}) => ({
	folder: one(folders, {
		fields: [files.folderId],
		references: [folders.id]
	}),
	workspace: one(workspaces, {
		fields: [files.workspaceId],
		references: [workspaces.id]
	}),
}));