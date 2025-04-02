import { useState, useEffect } from 'react';
import {
  TextInput,
  Table,
  Container,
  Title,
  Stack,
  Group,
  Text,
  Select,
  Paper,
  LoadingOverlay,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

interface Medicamento {
  id: number;
  nome: string;
  quantidade: number;
  validade: string;
  lote: string;
  fabricante: string;
  descricao?: string;
}

export function BuscarMedicamento() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('nome');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof Medicamento | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const itemsPerPage = 10;

  const sortData = (data: Medicamento[]) => {
    if (!sortBy) return data;
    return [...data].sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return reverseSortDirection ? 1 : -1;
      if (a[sortBy] > b[sortBy]) return reverseSortDirection ? -1 : 1;
      return 0;
    });
  };

  const paginatedData = sortData(filteredMedicamentos).slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredMedicamentos.length / itemsPerPage);

  useEffect(() => {
    fetchMedicamentos();
  }, []);

  const fetchMedicamentos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/medicamentos');
      if (!response.ok) {
        throw new Error('Erro ao buscar medicamentos');
      }
      const data = await response.json();
      setMedicamentos(data);
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao buscar medicamentos. Tente novamente.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicamentos = medicamentos.filter((med) => {
    const searchValue = searchTerm.toLowerCase();
    switch (filterBy) {
      case 'nome':
        return med.nome.toLowerCase().includes(searchValue);
      case 'lote':
        return med.lote.toLowerCase().includes(searchValue);
      case 'fabricante':
        return med.fabricante.toLowerCase().includes(searchValue);
      default:
        return true;
    }
  });

  return (
    <Container size="lg">
      <Stack spacing="lg">
        <Title order={2}>Buscar Medicamentos</Title>

        <Group grow>
          <TextInput
            placeholder="Digite para pesquisar..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
          />
          <Select
            value={filterBy}
            onChange={(value) => setFilterBy(value || 'nome')}
            data={[
              { value: 'nome', label: 'Nome' },
              { value: 'lote', label: 'Lote' },
              { value: 'fabricante', label: 'Fabricante' },
            ]}
            placeholder="Filtrar por"
          />
        </Group>

        <Paper shadow="xs" p="md" pos="relative">
          <LoadingOverlay visible={loading} />
          {filteredMedicamentos.length > 0 ? (
            <>
              <Table highlightOnHover withBorder withColumnBorders>
                <thead>
                  <tr>
                    <th style={{ cursor: 'pointer' }} onClick={() => {
                      setSortBy('nome');
                      setReverseSortDirection(!reverseSortDirection);
                    }}>Nome {sortBy === 'nome' && (reverseSortDirection ? '↑' : '↓')}</th>
                    <th style={{ cursor: 'pointer' }} onClick={() => {
                      setSortBy('quantidade');
                      setReverseSortDirection(!reverseSortDirection);
                    }}>Quantidade {sortBy === 'quantidade' && (reverseSortDirection ? '↑' : '↓')}</th>
                    <th style={{ cursor: 'pointer' }} onClick={() => {
                      setSortBy('validade');
                      setReverseSortDirection(!reverseSortDirection);
                    }}>Validade {sortBy === 'validade' && (reverseSortDirection ? '↑' : '↓')}</th>
                    <th style={{ cursor: 'pointer' }} onClick={() => {
                      setSortBy('lote');
                      setReverseSortDirection(!reverseSortDirection);
                    }}>Lote {sortBy === 'lote' && (reverseSortDirection ? '↑' : '↓')}</th>
                    <th style={{ cursor: 'pointer' }} onClick={() => {
                      setSortBy('fabricante');
                      setReverseSortDirection(!reverseSortDirection);
                    }}>Fabricante {sortBy === 'fabricante' && (reverseSortDirection ? '↑' : '↓')}</th>
                    <th>Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((med) => (
                    <tr key={med.id}>
                      <td>{med.nome}</td>
                      <td>{med.quantidade}</td>
                      <td>{new Date(med.validade).toLocaleDateString()}</td>
                      <td>{med.lote}</td>
                      <td>{med.fabricante}</td>
                      <td>{med.descricao || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Group position="center" mt="md">
                <Text>Página {page} de {totalPages}</Text>
                <Group spacing="xs">
                  <Button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    variant="light"
                  >
                    Anterior
                  </Button>
                  <Button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    variant="light"
                  >
                    Próxima
                  </Button>
                </Group>
              </Group>
            </>
          ) : (
            <Text align="center" color="dimmed">
              {loading ? 'Carregando...' : 'Nenhum medicamento encontrado'}
            </Text>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}