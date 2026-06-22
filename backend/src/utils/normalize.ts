export function normalizeCpf(cpf: string) {
	return cpf.replace(/\D/g, "");
}

export function normalizeEmail(email: string) {
	return email.trim().toLowerCase();
}

export function normalizeCelular(celular: string): string {
	const apenasNumeros = celular.replace(/\D/g, "");

	if (apenasNumeros.length === 11) {
		return `55${apenasNumeros}`;
	}

	if (apenasNumeros.length === 13 && apenasNumeros.startsWith("55")) {
		return apenasNumeros;
	}

	return apenasNumeros;
}
