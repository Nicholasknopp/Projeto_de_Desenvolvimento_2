import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextInput,
  NumberInput,
  Textarea,
  Button,
  Group,
  Stack,
  Container,
  Title,
  DateInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

const medicamentoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  quantidade: z.number().min(0, 'Quantidade não pode ser negativa'),
  validade: z.date().min(new Date(), 'Data de validade deve ser futura'),
  lote: z.string().min(1, 'Número do lote é obrigatório'),
  fabricante: z.string().min(1, 'Fabricante é obrigatório'),
  concentracao: z.string().min(1, 'Concentração é obrigatória'),
  formaFarmaceutica: z.string().min(1, 'Forma farmacêutica é obrigatória'),
  posologia: z.string().min(1, 'Posologia é obrigatória'),
  viaAdministracao: z.string().min(1, 'Via de administração é obrigatória'),
  descricao: z.string().optional(),
  contraindicacoes: z.string().optional(),
  efeitosColaterais: z.string().optional(),
  intervalo: z.string().min(1, 'Intervalo é obrigatório'),
  duracaoTratamento: z.string().optional(),
  interacoesMedicamentosas: z.array(z.string()).optional(),
  alertasEspeciais: z.array(z.string()).optional(),
  necessitaReceita: z.boolean().default(false),
  estoqueMinimo: z.number().min(0).default(5),
  instrucoesPreparo: z.string().optional(),
  condicoesArmazenamento: z.string().optional(),
  categoriasTerapeuticas: z.array(z.string()).optional(),
  principiosAtivos: z.array(z.string()).min(1, 'Pelo menos um princípio ativo é obrigatório'),
  registroAnvisa: z.string().optional()
});

type MedicamentoForm = z.infer<typeof medicamentoSchema>;

export function CadastroMedicamento() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicamentoForm>({
    resolver: zodResolver(medicamentoSchema),
  });

  const onSubmit = async (data: MedicamentoForm) => {
    try {
      const response = await fetch('http://localhost:3000/api/medicamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar medicamento');
      }

      notifications.show({
        title: 'Sucesso',
        message: 'Medicamento cadastrado com sucesso!',
        color: 'green',
      });
      reset();
    } catch (error) {
      notifications.show({
        title: 'Erro',
        message: 'Erro ao cadastrar medicamento. Tente novamente.',
        color: 'red',
      });
    }
  };

  return (
    <Container size="sm">
      <Stack spacing="lg">
        <Title order={2}>Cadastro de Medicamento</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="Nome do Medicamento"
              placeholder="Digite o nome do medicamento"
              required
              {...register('nome')}
              error={errors.nome?.message}
            />

            <Group grow>
              <NumberInput
                label="Quantidade"
                placeholder="0"
                required
                min={0}
                {...register('quantidade', { valueAsNumber: true })}
                error={errors.quantidade?.message}
              />

              <DateInput
                label="Data de Validade"
                placeholder="Selecione a data"
                required
                {...register('validade')}
                error={errors.validade?.message}
              />
            </Group>

            <Group grow>
              <TextInput
                label="Concentração"
                placeholder="Ex: 500mg"
                required
                {...register('concentracao')}
                error={errors.concentracao?.message}
              />

              <TextInput
                label="Forma Farmacêutica"
                placeholder="Ex: Comprimido"
                required
                {...register('formaFarmaceutica')}
                error={errors.formaFarmaceutica?.message}
              />
            </Group>

            <Group grow>
              <TextInput
                label="Via de Administração"
                placeholder="Ex: Oral"
                required
                {...register('viaAdministracao')}
                error={errors.viaAdministracao?.message}
              />

              <TextInput
                label="Intervalo"
                placeholder="Ex: 8 em 8 horas"
                required
                {...register('intervalo')}
                error={errors.intervalo?.message}
              />
            </Group>

            <TextInput
              label="Posologia"
              placeholder="Ex: 1 comprimido"
              required
              {...register('posologia')}
              error={errors.posologia?.message}
            />

            <Group grow>
              <TextInput
                label="Número do Lote"
                placeholder="Digite o número do lote"
                required
                {...register('lote')}
                error={errors.lote?.message}
              />

              <TextInput
                label="Fabricante"
                placeholder="Digite o nome do fabricante"
                required
                {...register('fabricante')}
                error={errors.fabricante?.message}
              />
            </Group>

            <Textarea
              label="Descrição"
              placeholder="Digite uma descrição do medicamento"
              {...register('descricao')}
              error={errors.descricao?.message}
            />

            <Textarea
              label="Instruções de Preparo"
              placeholder="Digite as instruções de preparo do medicamento"
              {...register('instrucoesPreparo')}
              error={errors.instrucoesPreparo?.message}
            />

            <Textarea
              label="Condições de Armazenamento"
              placeholder="Digite as condições de armazenamento"
              {...register('condicoesArmazenamento')}
              error={errors.condicoesArmazenamento?.message}
            />

            <TextInput
              label="Registro ANVISA"
              placeholder="Digite o número do registro na ANVISA"
              {...register('registroAnvisa')}
              error={errors.registroAnvisa?.message}
            />

            <NumberInput
              label="Estoque Mínimo"
              placeholder="Digite o estoque mínimo"
              min={0}
              {...register('estoqueMinimo', { valueAsNumber: true })}
              error={errors.estoqueMinimo?.message}
            />

            <Group position="right" mt="md">
              <Button variant="light" onClick={() => reset()}>Limpar</Button>
              <Button type="submit">Cadastrar</Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}