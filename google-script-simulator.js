// ============================================
// CONFIGURACIÓN DE LA API (usa GET directo)
// ============================================
const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyx2ZKEOGThYPBLjDeavIn1EYF9tmcYieT-6mfvAZAeiR0-nO__NKiJTejXxjJGJCBaBA/exec';

// ============================================
// SIMULADOR DEFINITIVO (JSON-SAFE)
// ============================================
(function(global) {
    global.google = global.google || {};
    global.google.script = (function() {
        let _successHandler = null;
        let _failureHandler = null;
        let _userObject = null;
        
        const resetHandlers = () => {
            _successHandler = null;
            _failureHandler = null;
            _userObject = null;
        };
        
        const execute = (functionName, args) => {
            const success = _successHandler;
            const failure = _failureHandler;
            const userObj = _userObject;
            
            resetHandlers();
            
            // Preparar payload - mantener como objeto, NO convertir a string individualmente
            let payload = args;
            if (args.length === 1) {
                payload = args[0];
            }
            
            console.log(`📤 Llamando a ${functionName} con:`, payload);
            
            // IMPORTANTE: Usar text/plain para evitar CORS, pero enviar JSON en el body
            fetch(GAS_API_URL, {
                method: 'POST',
                mode: 'cors',
                headers: { 
                    'Content-Type': 'text/plain'  // ← CRUCIAL: text/plain, NO application/json
                },
                body: JSON.stringify({
                    endpoint: functionName,
                    payload: payload  // ← Enviar el objeto directamente, no convertido a string
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                console.log(`📥 Respuesta de ${functionName}:`, result);
                if (result.success) {
                    if (success) success(result.data, userObj);
                } else {
                    if (failure) failure(result.error, userObj);
                }
            })
            .catch(error => {
                console.error(`❌ Error en ${functionName}:`, error);
                if (failure) failure(error.message, userObj);
            });
        };
        
        const handler = {
            get: function(target, prop) {
                if (prop === 'withSuccessHandler') {
                    return function(handler) {
                        _successHandler = handler;
                        return this;
                    };
                }
                if (prop === 'withFailureHandler') {
                    return function(handler) {
                        _failureHandler = handler;
                        return this;
                    };
                }
                if (prop === 'withUserObject') {
                    return function(obj) {
                        _userObject = obj;
                        return this;
                    };
                }
                
                return function(...args) {
                    return execute(prop, args);
                };
            }
        };
        
        return { run: new Proxy({}, handler) };
    })();
})(window);
