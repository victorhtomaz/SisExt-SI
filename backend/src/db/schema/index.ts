import { relations } from 'drizzle-orm';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';

export const usuarios = pgTable('usuarios', {
  id: serial('id').primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  cpf: varchar('cpf', { length: 12 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  senha_hash: varchar('senha_hash', { length: 255 }).notNull(),
  data_nascimento: date('data_nascimento', { mode: 'date' }).notNull(),
  ativo: boolean('ativo').notNull().default(true),
});

export const alunos = pgTable('alunos', {
  usuario_id: integer('usuario_id')
    .primaryKey()
    .references(() => usuarios.id, { onDelete: 'cascade' })
});

export const matriculas = pgTable('matriculas', {
  id: serial('id').primaryKey(),
  aluno_id: integer('aluno_id')
    .notNull()
    .references(() => alunos.usuario_id, { onDelete: 'cascade' }),
  matricula: varchar('matricula', { length: 12 }).notNull().unique(),
  curso: varchar('curso', { length: 255 }).notNull(),
  nivel: varchar('nivel', { length: 128 }).notNull(),
  status: varchar('status', { length: 64 }).notNull(),
  periodo_ingresso: varchar('periodo_ingresso', { length: 10 }).notNull(),
});

export const funcionarios = pgTable('funcionarios', {
  usuario_id: integer('usuario_id')
    .primaryKey()
    .references(() => usuarios.id, { onDelete: 'cascade' }),
  siape: varchar('siape', { length: 50 }).notNull().unique(),
  tipo: varchar('tipo', { length: 50 }).notNull(),
  departamento: varchar('departamento', { length: 255 }).notNull(),
  instituto: varchar('instituto', { length: 255 }).notNull(),
  membro_comissao: boolean('membro_comissao').default(false).notNull()
});

export const usuariosRelations = relations(usuarios, ({ one }) => ({
  aluno: one(alunos, {
    fields: [usuarios.id],
    references: [alunos.usuario_id]
  }),
  funcionario: one(funcionarios, {
    fields: [usuarios.id],
    references: [funcionarios.usuario_id]
  })
}));

export const alunosRelations = relations(alunos, ({ one, many }) => ({
  usuario: one(usuarios, {
    fields: [alunos.usuario_id],
    references: [usuarios.id]
  }),
  matriculas: many(matriculas)
}));

export const matriculasRelations = relations(matriculas, ({ one }) => ({
  aluno: one(alunos, {
    fields: [matriculas.aluno_id],
    references: [alunos.usuario_id]
  })
}));

export const funcionariosRelations = relations(funcionarios, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [funcionarios.usuario_id],
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