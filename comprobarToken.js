const token = 'tid=aa4c3b4dd51091b645a9f179ee15e7c7;exp=1770936788;sku=free_educational_quota;proxy-ep=proxy.individual.githubcopilot.com;st=dotcom;chat=1;cit=1;malfil=1;editor_preview_features=1;agent_mode=1;agent_mode_auto_approval=1;mcp=1;ccr=1;rt=1;8kp=1;ip=148.237.97.201;asn=AS7325:9cdc01de93a2f1a75076f8eae8a3b1ff600376e71b1ac0a97496e013058b208d';

async function verifyCopilot() {
    console.log("Verificando token con GitHub...");
    
    try {
        const response = await fetch("https://api.github.com/copilot_internal/v2/token", {
            method: "GET",
            headers: {
                "Authorization": `token ${token}`,
                "User-Agent": "OpenClaw-Validator"
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("✅ ¡Token Válido!");
            console.log("Expira en:", new Date(data.expires_at * 1000).toLocaleString());
        } else {
            console.error(`❌ Error ${response.status}: ${response.statusText}`);
            if (response.status === 401) {
                console.error("El token ha expirado o es incorrecto.");
            }
        }
    } catch (error) {
        console.error("Error de red:", error.message);
    }
}

verifyCopilot();