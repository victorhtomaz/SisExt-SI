CREATE TABLE "alunos" (
	"usuario_id" integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "funcionarios" (
	"usuario_id" integer PRIMARY KEY NOT NULL,
	"siape" varchar(50) NOT NULL,
	"tipo" varchar(50) NOT NULL,
	"departamento" varchar(255) NOT NULL,
	"instituto" varchar(255) NOT NULL,
	"membro_comissao" boolean DEFAULT false NOT NULL,
	CONSTRAINT "funcionarios_siape_unique" UNIQUE("siape")
);
--> statement-breakpoint
CREATE TABLE "matriculas" (
	"id" serial PRIMARY KEY NOT NULL,
	"aluno_id" integer NOT NULL,
	"matricula" varchar(12) NOT NULL,
	"curso" varchar(255) NOT NULL,
	"nivel" varchar(128) NOT NULL,
	"status" varchar(64) NOT NULL,
	"periodo_ingresso" varchar(10) NOT NULL,
	CONSTRAINT "matriculas_matricula_unique" UNIQUE("matricula")
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"cpf" varchar(12) NOT NULL,
	"email" varchar(255) NOT NULL,
	"celular" varchar(20) NOT NULL,
	"senha_hash" varchar(255) NOT NULL,
	"data_nascimento" date NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	CONSTRAINT "usuarios_cpf_unique" UNIQUE("cpf"),
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "funcionarios" ADD CONSTRAINT "funcionarios_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_aluno_id_alunos_usuario_id_fk" FOREIGN KEY ("aluno_id") REFERENCES "public"."alunos"("usuario_id") ON DELETE cascade ON UPDATE no action;