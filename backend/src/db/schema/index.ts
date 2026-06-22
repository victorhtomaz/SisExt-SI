import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
	boolean,
	date,
	integer,
	pgTable,
	serial,
	varchar,
} from "drizzle-orm/pg-core";

export const usuarios = pgTable("usuarios", {
	id: serial("id").primaryKey(),
	nome: varchar("nome", { length: 255 }).notNull(),
	cpf: varchar("cpf", { length: 12 }).notNull().unique(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	celular: varchar("celular", { length: 20 }).notNull(),
	senhaHash: varchar("senha_hash", { length: 255 }).notNull(),
	dataNascimento: date("data_nascimento", { mode: "date" }).notNull(),
	ativo: boolean("ativo").notNull().default(true),
});

export const alunos = pgTable("alunos", {
	usuarioId: integer("usuario_id")
		.primaryKey()
		.references(() => usuarios.id, { onDelete: "cascade" }),
});

export const matriculas = pgTable("matriculas", {
	id: serial("id").primaryKey(),
	alunoId: integer("aluno_id")
		.notNull()
		.references(() => alunos.usuarioId, { onDelete: "cascade" }),
	matricula: varchar("matricula", { length: 12 }).notNull().unique(),
	curso: varchar("curso", { length: 255 }).notNull(),
	nivel: varchar("nivel", { length: 128 }).notNull(),
	status: varchar("status", { length: 64 }).notNull(),
	periodoIngresso: varchar("periodo_ingresso", { length: 10 }).notNull(),
});

export const funcionarios = pgTable("funcionarios", {
	usuarioId: integer("usuario_id")
		.primaryKey()
		.references(() => usuarios.id, { onDelete: "cascade" }),
	siape: varchar("siape", { length: 50 }).notNull().unique(),
	tipo: varchar("tipo", { length: 50 }).notNull(),
	departamento: varchar("departamento", { length: 255 }).notNull(),
	instituto: varchar("instituto", { length: 255 }).notNull(),
	membroComissao: boolean("membro_comissao").default(false).notNull(),
});

export const usuariosRelations = relations(usuarios, ({ one }) => ({
	aluno: one(alunos, {
		fields: [usuarios.id],
		references: [alunos.usuarioId],
	}),
	funcionario: one(funcionarios, {
		fields: [usuarios.id],
		references: [funcionarios.usuarioId],
	}),
}));

export const alunosRelations = relations(alunos, ({ one, many }) => ({
	usuario: one(usuarios, {
		fields: [alunos.usuarioId],
		references: [usuarios.id],
	}),
	matriculas: many(matriculas),
}));

export const matriculasRelations = relations(matriculas, ({ one }) => ({
	aluno: one(alunos, {
		fields: [matriculas.alunoId],
		references: [alunos.usuarioId],
	}),
}));

export const funcionariosRelations = relations(funcionarios, ({ one }) => ({
	usuario: one(usuarios, {
		fields: [funcionarios.usuarioId],
		references: [usuarios.id],
	}),
}));

export type UsuarioRow = InferSelectModel<typeof usuarios>;
export type NewUsuarioRow = InferInsertModel<typeof usuarios>;
export type AlunoRow = InferSelectModel<typeof alunos>;
export type NewAlunoRow = InferInsertModel<typeof alunos>;
export type FuncionarioRow = InferSelectModel<typeof funcionarios>;
export type NewFuncionarioRow = InferInsertModel<typeof funcionarios>;
export type MatriculaRow = InferSelectModel<typeof matriculas>;
export type NewMatriculaRow = InferInsertModel<typeof matriculas>;

export const schema = {
	alunos,
	funcionarios,
	matriculas,
	usuarios,
} as const;
