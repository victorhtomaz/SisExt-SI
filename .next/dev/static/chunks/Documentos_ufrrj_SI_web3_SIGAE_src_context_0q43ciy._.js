(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documentos/ufrrj/SI/web3/SIGAE/src/context/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthContext",
    ()=>AuthContext,
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$ufrrj$2f$SI$2f$web3$2f$SIGAE$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/ufrrj/SI/web3/SIGAE/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$ufrrj$2f$SI$2f$web3$2f$SIGAE$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/ufrrj/SI/web3/SIGAE/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$ufrrj$2f$SI$2f$web3$2f$SIGAE$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$ufrrj$2f$SI$2f$web3$2f$SIGAE$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$ufrrj$2f$SI$2f$web3$2f$SIGAE$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$ufrrj$2f$SI$2f$web3$2f$SIGAE$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$ufrrj$2f$SI$2f$web3$2f$SIGAE$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Carregar token e usuário do localStorage ao montar
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$ufrrj$2f$SI$2f$web3$2f$SIGAE$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const savedToken = localStorage.getItem("token");
            const savedUser = localStorage.getItem("user");
            if (savedToken && savedUser) {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            }
            setLoading(false);
        }
    }["AuthProvider.useEffect"], []);
    const login = async (email, senha)=>{
        try {
            setError(null);
            setLoading(true);
            // Chamar API de login (vamos criar depois)
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    senha
                })
            });
            if (!response.ok) {
                throw new Error("Falha ao fazer login");
            }
            const data = await response.json();
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
            setError(errorMessage);
            throw err;
        } finally{
            setLoading(false);
        }
    };
    const signup = async (data)=>{
        try {
            setError(null);
            setLoading(true);
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error("Falha ao criar conta");
            }
            const responseData = await response.json();
            setToken(responseData.token);
            setUser(responseData.user);
            localStorage.setItem("token", responseData.token);
            localStorage.setItem("user", JSON.stringify(responseData.user));
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
            setError(errorMessage);
            throw err;
        } finally{
            setLoading(false);
        }
    };
    const logout = ()=>{
        setUser(null);
        setToken(null);
        setError(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };
    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        signup,
        logout,
        error
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$ufrrj$2f$SI$2f$web3$2f$SIGAE$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Documentos/ufrrj/SI/web3/SIGAE/src/context/AuthContext.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "ihfjI6MF9YjLOpbFlkCQPaRWc98=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$ufrrj$2f$SI$2f$web3$2f$SIGAE$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documentos/ufrrj/SI/web3/SIGAE/src/context/AuthProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClientAuthProvider",
    ()=>ClientAuthProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$ufrrj$2f$SI$2f$web3$2f$SIGAE$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/ufrrj/SI/web3/SIGAE/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$ufrrj$2f$SI$2f$web3$2f$SIGAE$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/ufrrj/SI/web3/SIGAE/src/context/AuthContext.tsx [app-client] (ecmascript)");
"use client";
;
;
function ClientAuthProvider({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$ufrrj$2f$SI$2f$web3$2f$SIGAE$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$ufrrj$2f$SI$2f$web3$2f$SIGAE$2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/Documentos/ufrrj/SI/web3/SIGAE/src/context/AuthProvider.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
_c = ClientAuthProvider;
var _c;
__turbopack_context__.k.register(_c, "ClientAuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documentos_ufrrj_SI_web3_SIGAE_src_context_0q43ciy._.js.map