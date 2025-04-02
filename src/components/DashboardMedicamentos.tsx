import React, { useState, useEffect } from 'react';
import {
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Card,
  Grid,
  RingProgress,
  List,
  ThemeIcon,
  Transition,
  Container,
  Badge,
  Tooltip,
  ActionIcon,
  Box,
} from '@mantine/core';
import { IconPill, IconAlertTriangle, IconClockHour4, IconChartBar } from '@tabler/icons-react';

interface EstatisticasMedicamento {
  medicamentoId: number;
  nome: string;
  taxaAderencia: number;
  dosesPerdidas: number;
  proximaDose: string;
  efeitosColateraisComuns: string[];
  diasRestantesEstoque: number;
}

export function DashboardMedicamentos() {
  const [estatisticas, setEstatisticas] = useState<EstatisticasMedicamento[]>([]);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const doses = JSON.parse(localStorage.getItem('doses') || '[]');
      const medicamentos = JSON.parse(localStorage.getItem('medicamentos') || '[]');

      const estatisticasCalculadas = medicamentos.map((med: any) => {
        const dosesMedicamento = doses.filter((dose: any) => dose.medicamentoId === med.id);
        const dosesFinalizadas = dosesMedicamento.filter(
          (dose: any) => dose.status === 'tomada' || dose.status === 'perdida'
        );
        const dosesTomadas = dosesMedicamento.filter(
          (dose: any) => dose.status === 'tomada'
        );

        const taxaAderencia = dosesFinalizadas.length > 0
          ? (dosesTomadas.length / dosesFinalizadas.length) * 100
          : 0;

        const dosesPerdidas = dosesMedicamento.filter(
          (dose: any) => dose.status === 'perdida'
        ).length;

        const proximaDose = dosesMedicamento.find(
          (dose: any) => dose.status === 'pendente'
        )?.horarioPrevisto || 'Não agendada';

        const efeitosRelatados = dosesMedicamento
          .filter((dose: any) => dose.efeitosColaterais)
          .map((dose: any) => dose.efeitosColaterais);

        const efeitosColateraisComuns = [...new Set(efeitosRelatados)];

        return {
          medicamentoId: med.id,
          nome: med.nome,
          taxaAderencia,
          dosesPerdidas,
          proximaDose,
          efeitosColateraisComuns,
          diasRestantesEstoque: Math.floor(med.quantidade / (24 / parseInt(med.intervalo)))
        };
      });

      setEstatisticas(estatisticasCalculadas);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        <Box sx={(theme) => ({
          backgroundColor: theme.colors.blue[0],
          padding: theme.spacing.md,
          borderRadius: theme.radius.md,
        })}>
          <Title order={2} align="center" color="blue">Dashboard de Medicamentos</Title>
        </Box>

      <Grid>
        {estatisticas.map((estatistica) => (
          <Grid.Col key={estatistica.medicamentoId} span={6}>
            <Transition mounted={true} transition="fade" duration={400}>
              {(styles) => (
                <Card
                  withBorder
                  shadow="sm"
                  radius="md"
                  p="lg"
                  sx={(theme) => ({
                    backgroundColor: theme.white,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: theme.shadows.md,
                    },
                  })}
                  style={styles}
                >
              <Stack spacing="md">
                <Group position="apart">
                  <Group position="apart" align="center" spacing="xl">
                    <Text weight={700} size="lg" color="blue">{estatistica.nome}</Text>
                    <Badge
                      variant="filled"
                      color={estatistica.diasRestantesEstoque <= 7 ? 'red' : estatistica.diasRestantesEstoque <= 15 ? 'yellow' : 'green'}
                    >
                      {estatistica.diasRestantesEstoque} dias de estoque
                    </Badge>
                  </Group>
                  <RingProgress
                    size={120}
                    roundCaps
                    thickness={12}
                    sections={[{ value: estatistica.taxaAderencia, color: estatistica.taxaAderencia > 80 ? 'teal' : estatistica.taxaAderencia > 60 ? 'blue' : 'red' }]}
                    label={
                      <Text align="center" size="xs" weight={700}>
                        {Math.round(estatistica.taxaAderencia)}%
                      </Text>
                    }
                  />
                </Group>

                <List spacing="md" size="sm" center icon={
                  <ThemeIcon color="teal" size={28} radius="xl" variant="light">
                    <IconPill size={16} />
                  </ThemeIcon>
                }>
                  <List.Item>
                    <Group spacing="xs">
                      <IconClockHour4 size={16} />
                      <Text>Próxima dose: {estatistica.proximaDose}</Text>
                    </Group>
                  </List.Item>
                  <List.Item>
                    <Group spacing="xs">
                      <IconAlertTriangle size={16} />
                      <Text>Doses perdidas: {estatistica.dosesPerdidas}</Text>
                    </Group>
                  </List.Item>
                  <List.Item>
                    <Group spacing="xs">
                      <IconChartBar size={16} />
                      <Text>Estoque para: {estatistica.diasRestantesEstoque} dias</Text>
                    </Group>
                  </List.Item>
                </List>

                {estatistica.efeitosColateraisComuns.length > 0 && (
                  <Stack spacing="xs">
                    <Text weight={500} size="sm">Efeitos Colaterais Relatados:</Text>
                    <List size="sm">
                      {estatistica.efeitosColateraisComuns.map((efeito, index) => (
                        <List.Item key={index}>{efeito}</List.Item>
                      ))}
                    </List>
                  </Stack>
                )}
              </Stack>
            </Card>
              )}
            </Transition>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
    </Container>
  );
}