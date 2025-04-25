// Gerenciador de agendamento de notificações
class NotificationScheduler {
    constructor() {
        this.scheduledNotifications = new Map();
        this.checkPermission();
    }

    async checkPermission() {
        if (!('Notification' in window)) {
            console.error('Este navegador não suporta notificações desktop');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }

        return false;
    }

    async scheduleNotification(medicamento, horarios) {
        if (!Array.isArray(horarios)) {
            horarios = [horarios];
        }

        const notificationPromises = horarios.map(async (horario) => {
            try {
                const scheduledTime = this.calculateNextNotificationTime(horario);
                const timeoutId = setTimeout(async () => {
                    await this.showNotification(medicamento);
                    // Reagenda para o próximo dia
                    this.scheduleNotification(medicamento, horario);
                }, scheduledTime - Date.now());

                this.scheduledNotifications.set(
                    `${medicamento.id}-${horario}`,
                    timeoutId
                );

                await this.saveNotificationSchedule(medicamento, horario);
                return true;
            } catch (error) {
                console.error('Erro ao agendar notificação:', error);
                return false;
            }
        });

        return Promise.all(notificationPromises);
    }

    calculateNextNotificationTime(horario) {
        const [hours, minutes] = horario.split(':').map(Number);
        const now = new Date();
        const scheduledTime = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hours,
            minutes
        );

        if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        return scheduledTime.getTime();
    }

    async showNotification(medicamento) {
        if (!await this.checkPermission()) {
            console.error('Permissão para notificações não concedida');
            return;
        }

        const options = {
            body: `Hora de tomar ${medicamento.nome} - ${medicamento.posologia}`,
            icon: '/public/logo-home.svg',
            badge: '/public/logo-home.svg',
            vibrate: [100, 50, 100],
            data: {
                medicamentoId: medicamento.id,
                timestamp: Date.now()
            },
            actions: [
                {
                    action: 'confirmar',
                    title: 'Confirmar',
                    icon: '/public/logo-home.svg'
                },
                {
                    action: 'adiar',
                    title: 'Adiar 30min',
                    icon: '/public/logo-home.svg'
                }
            ]
        };

        try {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification('Lembrete de Medicação', options);
        } catch (error) {
            console.error('Erro ao mostrar notificação:', error);
        }
    }

    async saveNotificationSchedule(medicamento, horario) {
        try {
            await fetch('/api/notificacoes/agendar', {
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
        } catch (error) {
            console.error('Erro ao salvar agendamento:', error);
        }
    }

    cancelNotification(medicamentoId, horario) {
        const key = `${medicamentoId}-${horario}`;
        const timeoutId = this.scheduledNotifications.get(key);
        
        if (timeoutId) {
            clearTimeout(timeoutId);
            this.scheduledNotifications.delete(key);
            return true;
        }
        return false;
    }
}

// Instância global do gerenciador de notificações
const notificationScheduler = new NotificationScheduler();

// Exportar a instância
window.notificationScheduler = notificationScheduler;