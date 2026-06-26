"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    celular: "",
    data_nascimento: "",
    senha: "",
    confirmar_senha: "",

    tipoUsuario: "ALUNO",

    matricula: "",
    curso: "",
    nivel: "Graduação",
    periodoIngresso: "",

    siape: "",
    tipoFuncionario: "Docente",
    departamento: "",
    instituto: "",
    membroComissao: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { name, value } = e.target;

    if(e.target instanceof HTMLInputElement && e.target.type==="checkbox"){
      setFormData((prev)=>({
        ...prev,
        [name]:e.target.ariaChecked,
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.senha !== formData.confirmar_senha) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    try {
      const payload =
        formData.tipoUsuario === "ALUNO"
          ? {
              nome: formData.nome,
              cpf: formData.cpf,
              email: formData.email,
              celular: formData.celular,
              senha: formData.senha,
              dataNascimento: formData.data_nascimento,
              tipo: "ALUNO",
              detalhesPerfil: {
                matricula: formData.matricula,
                curso: formData.curso,
                nivel: formData.nivel,
                periodoIngresso: formData.periodoIngresso,
              },
            }
          : {
              nome: formData.nome,
              cpf: formData.cpf,
              email: formData.email,
              celular: formData.celular,
              senha: formData.senha,
              dataNascimento: formData.data_nascimento,
              tipo: "FUNCIONARIO",
              detalhesPerfil: {
                siape: formData.siape,
                tipo: formData.tipoFuncionario,
                departamento: formData.departamento,
                instituto: formData.instituto,
                membroComissao: formData.membroComissao,
              },
            };

      await signup(payload);

      router.push("/login");
    } catch (err) {
      const axiosError = err as any;

      setError(
            axiosError.response?.data?.errors?.general?.[0] || axiosError.response?.data?.message || "Erro ao criar conta. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome completo
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            value={formData.nome}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
            CPF
          </label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            value={formData.cpf}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="000.000.000-00"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="celular" className="block text-sm font-medium text-gray-700">
            Celular
          </label>
          <input
            id="celular"
            name="celular"
            type="text"
            value={formData.celular}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div>
          <label
            htmlFor="data_nascimento"
            className="block text-sm font-medium text-gray-700"
          >
            Data de nascimento
          </label>
          <input
            id="data_nascimento"
            name="data_nascimento"
            type="date"
            value={formData.data_nascimento}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="tipoUsuario" className="block text-sm font-medium text-gray-700">
          Tipo de Usuário
        </label>
        <select id="tipoUsuario" name="tipoUsuario" value={formData.tipoUsuario} onChange={handleChange} required className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none">
          <option value="ALUNO">Aluno</option>
          <option value="FUNCIONARIO">Funcionário</option>
        </select>
      </div>
      {formData.tipoUsuario === "ALUNO" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="matricula"
                className="block text-sm font-medium text-gray-700"
              >
                Matrícula
              </label>
              <input
                id="matricula"
                name="matricula"
                type="text"
                value={formData.matricula}
                onChange={handleChange}
                required
                maxLength={12}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="20260010124"
              />
            </div>

            <div>
              <label
                htmlFor="curso"
                className="block text-sm font-medium text-gray-700"
              >
                Curso
              </label>
              <input
                id="curso"
                name="curso"
                type="text"
                value={formData.curso}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Sistemas de Informação"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="nivel"
                className="block text-sm font-medium text-gray-700"
              >
                Nível
              </label>
              <select
                id="nivel"
                name="nivel"
                value={formData.nivel}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="Graduação">Graduação</option>
                <option value="Pós-graduação">Pós-graduação</option>
                <option value="Mestrado">Mestrado</option>
                <option value="Doutorado">Doutorado</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="periodoIngresso"
                className="block text-sm font-medium text-gray-700"
              >
                Período de ingresso
              </label>
              <input
                id="periodoIngresso"
                name="periodoIngresso"
                type="text"
                value={formData.periodoIngresso}
                onChange={handleChange}
                required
                maxLength={10}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="2026.1"
              />
            </div>
          </div>
        </>
      )}

      {formData.tipoUsuario === "FUNCIONARIO" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="siape"
                className="block text-sm font-medium text-gray-700"
              >
                SIAPE
              </label>
              <input
                id="siape"
                name="siape"
                type="text"
                value={formData.siape}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="3691232"
              />
            </div>

            <div>
              <label
                htmlFor="tipoFuncionario"
                className="block text-sm font-medium text-gray-700"
              >
                Tipo de funcionário
              </label>
              <select
                id="tipoFuncionario"
                name="tipoFuncionario"
                value={formData.tipoFuncionario}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
              >
                <option value="Docente">Docente</option>
                <option value="Técnico-Administrativo">
                  Técnico-Administrativo
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="departamento"
                className="block text-sm font-medium text-gray-700"
              >
                Departamento
              </label>
              <input
                id="departamento"
                name="departamento"
                type="text"
                value={formData.departamento}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="Departamento de Computação"
              />
            </div>

            <div>
              <label
                htmlFor="instituto"
                className="block text-sm font-medium text-gray-700"
              >
                Instituto
              </label>
              <input
                id="instituto"
                name="instituto"
                type="text"
                value={formData.instituto}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                placeholder="ICE"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              name="membroComissao"
              type="checkbox"
              checked={formData.membroComissao}
              onChange={handleChange}
              className="h-4 w-4"
            />
            Membro da comissão
          </label>
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            value={formData.senha}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label
            htmlFor="confirmar_senha"
            className="block text-sm font-medium text-gray-700"
          >
            Confirmar senha
          </label>
          <input
            id="confirmar_senha"
            name="confirmar_senha"
            type="password"
            value={formData.confirmar_senha}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}