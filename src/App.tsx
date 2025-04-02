import { MantineProvider, AppShell, Header, Container, Title, Group, Navbar, UnstyledButton, Text } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { CadastroMedicamento } from './components/CadastroMedicamento';
import { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('cadastro');

  const NavbarLink = ({ label, value }: { label: string; value: string }) => (
    <UnstyledButton
      onClick={() => setActiveTab(value)}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.black,
        backgroundColor: activeTab === value ? theme.colors.gray[1] : 'transparent',
        '&:hover': {
          backgroundColor: theme.colors.gray[1],
        },
      })}
    >
      <Text>{label}</Text>
    </UnstyledButton>
  );

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications />
      <AppShell
        padding="md"
        navbar={
          <Navbar width={{ base: 250 }} p="xs">
            <Navbar.Section grow mt="xs">
              <NavbarLink label="Cadastrar Medicamento" value="cadastro" />
              <NavbarLink label="Lista de Medicamentos" value="lista" />
              <NavbarLink label="Relatórios" value="relatorios" />
            </Navbar.Section>
          </Navbar>
        }
        header={
          <Header height={70} p="md">
            <Group position="apart">
              <Title order={1}>Sistema de Gestão de Medicamentos</Title>
            </Group>
          </Header>
        }
      >
        <Container size="lg">
          {activeTab === 'cadastro' && <CadastroMedicamento />}
          {activeTab === 'lista' && <Text>Lista de Medicamentos (Em desenvolvimento)</Text>}
          {activeTab === 'relatorios' && <Text>Relatórios (Em desenvolvimento)</Text>}
        </Container>
      </AppShell>
    </MantineProvider>
  );
}