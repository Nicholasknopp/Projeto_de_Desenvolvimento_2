import React, { useState, useEffect } from 'react';
import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Badge,
  Progress,
  Card,
  ActionIcon,
  Modal,
  Select,
  TimeInput,
  Textarea,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconAlertTriangle } from '@tabler/icons-react';

interface DoseMedicamento {
  id: string;
  medicamentoId: number;
  medicamentoNome: string;
  horarioPrevisto: string;
  horarioTomada: string | null;
  status: 'pendente' | 'tomada' | 'atrasada' | 'perdida';
  efeitosColaterais?: string;
  observacoes?: string;
}

export function RastreamentoMedicamentos() {
  const [doses, setDoses] = useState<DoseMedicamento[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [doseAtual, setDoseAtual] = useState<DoseMedicamento | null>(null);
  const [efeitosColaterais, setEfeitosColaterais] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    carregarDoses();
    const interval = setInterval(atualizarStatusDoses, 60000); // Atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  const carregarDoses = async () => {
    try {
      const dosesStorage = localStorage.getItem('doses');
      if (dosesStorage) {
        setDoses(JSON.parse(dosesStorage));
      }
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao carregar doses',
        color: 'red'
      });
    }
  };

  const atualizarStatusDoses = () => {
    const agora = new Date();
    const dosesAtualizadas = doses.map(dose => {
      if (dose.status === 'pendente') {
        const horarioPrevisto = new Date(`${new Date().toDateString()} ${dose.horarioPrevisto}`);
        if (agora > horarioPrevisto) {
          return { ...dose, status: 'atrasada' };
        }
      }
      return dose;
    });
    setDoses(dosesAtualizadas);
    localStorage.setItem('doses', JSON.stringify(dosesAtualizadas));
  };

  const registrarTomada = (dose: DoseMedicamento) => {
    setDoseAtual(dose);
    setModalAberto(true);
  };

  const confirmarTomada = () => {
    if (!doseAtual) return;

    const dosesAtualizadas = doses.map(dose => {
      if (dose.id === doseAtual.id) {
        return {
          ...dose,
          status: 'tomada',
          horarioTomada: new Date().toLocaleTimeString(),
          efeitosColaterais,
          observacoes
        };
      }
      return dose;
    });

    setDoses(dosesAtualizadas);
    localStorage.setItem('doses', JSON.stringify(dosesAtualizadas));
    setModalAberto(false);
    setEfeitosColaterais('');
    setObservacoes('');

    notifications.show({
      title: 'Sucesso',
      message: 'Dose registrada com sucesso!',
      color: 'green'
    });
  };

  const calcularAderencia = () => {
    const dosesFinalizadas = doses.filter(dose => 
      dose.status === 'tomada' || dose.status === 'perdida'
    );
    if (dosesFinalizadas.length === 0) return 0;

    const dosesTomadas = dosesFinalizadas.filter(dose => 
      dose.status === 'tomada'
    ).length;

    return (dosesTomadas / dosesFinalizadas.length) * 100;
  };

  return (
    <Stack spacing="lg">
      <Title order={2}>Rastreamento de Medicamentos</Title>

      <Card>
        <Stack spacing="xs">
          <Text size="lg" weight={500}>Taxa de Aderência ao Tratamento</Text>
          <Progress
            value={calcularAderencia()}
            label={`${Math.round(calcularAderencia())}%`}
            size="xl"
            radius="xl"
            color={calcularAderencia() > 80 ? 'green' : calcularAderencia() > 50 ? 'yellow' : 'red'}
          />
        </Stack>
      </Card>

      <Stack spacing="md">
        {doses.map(dose => (
          <Paper key={dose.id} p="md" withBorder>
            <Group position="apart">
              <Stack spacing="xs">
                <Text weight={500}>{dose.medicamentoNome}</Text>
                <Text size="sm" color="dimmed">
                  Horário previsto: {dose.horarioPrevisto}
                </Text>
                {dose.horarioTomada && (
                  <Text size="sm" color="dimmed">
                    Horário tomada: {dose.horarioTomada}
                  </Text>
                )}
              </Stack>

              <Group>
                <Badge
                  color={
                    dose.status === 'tomada' ? 'green' :
                    dose.status === 'atrasada' ? 'yellow' :
                    dose.status === 'perdida' ? 'red' : 'blue'
                  }
                >
                  {dose.status.toUpperCase()}
                </Badge>
                {dose.status === 'pendente' && (
                  <ActionIcon
                    color="green"
                    variant="light"
                    onClick={() => registrarTomada(dose)}
                  >
                    <IconCheck size={20} />
                  </ActionIcon>
                )}
              </Group>
            </Group>
          </Paper>
        ))}
      </Stack>

      <Modal
        opened={modalAberto}
        onClose={() => setModalAberto(false)}
        title="Registrar Tomada de Medicamento"
      >
        <Stack spacing="md">
          <Textarea
            label="Efeitos Colaterais"
            placeholder="Descreva qualquer efeito colateral observado"
            value={efeitosColaterais}
            onChange={(event) => setEfeitosColaterais(event.currentTarget.value)}
          />

          <Textarea
            label="Observações"
            placeholder="Adicione observações sobre a tomada do medicamento"
            value={observacoes}
            onChange={(event) => setObservacoes(event.currentTarget.value)}
          />

          <Group position="right">
            <Button variant="light" onClick={() => setModalAberto(false)}>Cancelar</Button>
            <Button onClick={confirmarTomada}>Confirmar</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}