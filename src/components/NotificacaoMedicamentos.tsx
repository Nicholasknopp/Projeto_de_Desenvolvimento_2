import React, { useState, useEffect } from 'react';
import {
  Paper,
  Title,
  Text,
  Switch,
  Stack,
  Group,
  Button,
  Modal,
  TimeInput,
  Select,
  TextInput,
  ActionIcon,
  Badge,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconBell, IconTrash } from '@tabler/icons-react';

interface Lembrete {
  id: string;
  medicamentoId: number;
  medicamentoNome: string;
  horario: string;
  intervalo: string;
  ativo: boolean;
}

export function NotificacaoMedicamentos() {
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [medicamentos, setMedicamentos] = useState<{ value: string; label: string }[]>([]);
  const [novoLembrete, setNovoLembrete] = useState<Omit<Lembrete, 'id'>>({ 
    medicamentoId: 0,
    medicamentoNome: '',
    horario: '',
    intervalo: '8',
    ativo: true
  });

  useEffect(() => {
    carregarMedicamentos();
    carregarLembretes();
    verificarPermissaoNotificacao();
  }, []);

  const verificarPermissaoNotificacao = async () => {
    if ('Notification' in window) {
      const permissao = await Notification.requestPermission();
      setNotificacoesAtivas(permissao === 'granted');
    }
  };

  const carregarMedicamentos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/medicamentos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMedicamentos(data.map((med: any) => ({
        value: String(med.id),
        label: med.nome
      })));
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao carregar medicamentos',
        color: 'red'
      });
    }
  };

  const carregarLembretes = async () => {
    const lembretesStorage = localStorage.getItem('lembretes');
    if (lembretesStorage) {
      setLembretes(JSON.parse(lembretesStorage));
    }
  };

  const salvarLembrete = () => {
    if (!novoLembrete.medicamentoId || !novoLembrete.horario) {
      notifications.show({
        title: 'Erro',
        message: 'Preencha todos os campos obrigatórios',
        color: 'red'
      });
      return;
    }

    const medicamento = medicamentos.find(med => med.value === String(novoLembrete.medicamentoId));
    if (!medicamento) return;

    const novoLembreteCompleto: Lembrete = {
      ...novoLembrete,
      id: Date.now().toString(),
      medicamentoNome: medicamento.label
    };

    const novosLembretes = [...lembretes, novoLembreteCompleto];
    setLembretes(novosLembretes);
    localStorage.setItem('lembretes', JSON.stringify(novosLembretes));
    setModalAberto(false);
    agendarNotificacao(novoLembreteCompleto);
  };

  const removerLembrete = (id: string) => {
    const novosLembretes = lembretes.filter(lembrete => lembrete.id !== id);
    setLembretes(novosLembretes);
    localStorage.setItem('lembretes', JSON.stringify(novosLembretes));
  };

  const agendarNotificacao = (lembrete: Lembrete) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const [hora, minuto] = lembrete.horario.split(':');
    const agora = new Date();
    const horarioNotificacao = new Date();
    horarioNotificacao.setHours(parseInt(hora), parseInt(minuto), 0);

    if (horarioNotificacao < agora) {
      horarioNotificacao.setDate(horarioNotificacao.getDate() + 1);
    }

    const timeout = horarioNotificacao.getTime() - agora.getTime();

    setTimeout(() => {
      new Notification(`Hora do Medicamento: ${lembrete.medicamentoNome}`, {
        body: `Está na hora de tomar ${lembrete.medicamentoNome}`,
        icon: '/favicon.ico'
      });

      // Reagenda para o próximo intervalo
      const proximoHorario = new Date(horarioNotificacao.getTime() + parseInt(lembrete.intervalo) * 60 * 60 * 1000);
      const novoTimeout = proximoHorario.getTime() - new Date().getTime();
      setTimeout(() => agendarNotificacao(lembrete), novoTimeout);
    }, timeout);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Paper shadow="xs" p="md">
        <Group position="apart" mb="lg">
          <Title order={2}>Lembretes de Medicação</Title>
          <Group>
            <Switch
              label="Notificações"
              checked={notificacoesAtivas}
              onChange={() => verificarPermissaoNotificacao()}
            />
            <Button
              leftIcon={<IconBell size={18} />}
              onClick={() => setModalAberto(true)}
            >
              Novo Lembrete
            </Button>
          </Group>
        </Group>

        <Stack spacing="md">
          {lembretes.map(lembrete => (
            <Paper key={lembrete.id} shadow="xs" p="md" withBorder>
              <Group position="apart">
                <div>
                  <Text weight={500}>{lembrete.medicamentoNome}</Text>
                  <Text size="sm" color="dimmed">
                    Horário: {lembrete.horario} - A cada {lembrete.intervalo} horas
                  </Text>
                </div>
                <Group>
                  <Badge color={lembrete.ativo ? 'green' : 'gray'}>
                    {lembrete.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <ActionIcon
                    color="red"
                    onClick={() => removerLembrete(lembrete.id)}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Paper>

      <Modal
        opened={modalAberto}
        onClose={() => setModalAberto(false)}
        title="Novo Lembrete de Medicação"
      >
        <Stack spacing="md">
          <Select
            label="Medicamento"
            placeholder="Selecione o medicamento"
            data={medicamentos}
            value={String(novoLembrete.medicamentoId)}
            onChange={(value) => setNovoLembrete(prev => ({
              ...prev,
              medicamentoId: Number(value)
            }))}
            required
          />

          <TimeInput
            label="Horário"
            placeholder="00:00"
            value={novoLembrete.horario}
            onChange={(event) => setNovoLembrete(prev => ({
              ...prev,
              horario: event.currentTarget.value
            }))}
            required
          />

          <TextInput
            label="Intervalo (horas)"
            type="number"
            value={novoLembrete.intervalo}
            onChange={(event) => setNovoLembrete(prev => ({
              ...prev,
              intervalo: event.currentTarget.value
            }))}
            required
          />

          <Group position="right">
            <Button variant="light" onClick={() => setModalAberto(false)}>Cancelar</Button>
            <Button onClick={salvarLembrete}>Salvar</Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}