// Solicitar permissão para notificações
async function solicitarPermissaoNotificacao() {
    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(process.env.VAPID_PUBLIC_KEY)
            });
            
            // Enviar a subscription para o servidor
            await fetch('/api/notificacoes/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(subscription)
            });
        }
    } catch (error) {
        console.error('Erro ao configurar notificações:', error);
    }
}

// Função para converter VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Função para agendar notificação
async function agendarNotificacao(medicamento, horario) {
    try {
        const response = await fetch('/api/notificacoes/agendar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                medicamentoId: medicamento.id,
                horario: horario
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao agendar notificação');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao agendar notificação:', error);
        throw error;
    }
}

// Função para listar notificações do usuário
async function listarNotificacoes() {
    try {
        const response = await fetch('/api/notificacoes', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar notificações');
        }

        const notificacoes = await response.json();
        return notificacoes;
    } catch (error) {
        console.error('Erro ao buscar notificações:', error);
        throw error;
    }
}

// Função para marcar notificação como lida
async function marcarNotificacaoComoLida(notificacaoId) {
    try {
        const response = await fetch(`/api/notificacoes/${notificacaoId}/lida`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao marcar notificação como lida');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error);
        throw error;
    }
}

// Exportar funções
export {
    solicitarPermissaoNotificacao,
    agendarNotificacao,
    listarNotificacoes,
    marcarNotificacaoComoLida
};