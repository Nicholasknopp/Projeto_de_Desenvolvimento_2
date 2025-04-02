import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, NumberInput, Textarea, Button, Group, Stack, DateInput, Notification } from '@mantine/core';
import { notifications } from '@mantine/notifications';

const medicamentoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  quantidade: z.number().min(0, 'Quantidade não pode ser negativa'),
  validade: z.date().min(new Date(), 'Data de validade deve ser futura'),
  lote: z.string().min(1, 'Número do lote é obrigatório'),
  fabricante: z.string().min(2, 'Nome do fabricante deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
});

type MedicamentoFormData = z.infer<typeof medicamentoSchema>;

export function MedicamentoForm() {
  const form = useForm<MedicamentoFormData>({
    resolver: zodResolver(medicamentoSchema),
    defaultValues: {
      nome: '',
      quantidade: 0,
      lote: '',
      fabricante: '',
      descricao: '',
    },
  });

  const handleSubmit = async (data: MedicamentoFormData) => {
    try {
      const response = await fetch('/api/medicamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar medicamento');
      }

      form.reset();
      notifications.show({
        title: 'Sucesso',
        message: 'Medicamento cadastrado com sucesso!',
        color: 'green',
      });
    } catch (error) {
      console.error('Erro:', error);
      notifications.show({
        title: 'Erro',
        message: 'Erro ao cadastrar medicamento. Tente novamente.',
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Stack spacing="md">
        <TextInput
          label="Nome do Medicamento"
          placeholder="Digite o nome do medicamento"
          required
          {...form.register('nome')}
          error={form.formState.errors.nome?.message}
        />

        <Group grow>
          <NumberInput
            label="Quantidade"
            placeholder="0"
            required
            min={0}
            {...form.register('quantidade', { valueAsNumber: true })}
            error={form.formState.errors.quantidade?.message}
          />

          <DateInput
            label="Data de Validade"
            placeholder="Selecione a data"
            required
            minDate={new Date()}
            value={form.watch('validade')}
            onChange={(date) => form.setValue('validade', date, { shouldValidate: true })}
            error={form.formState.errors.validade?.message}
          />
        </Group>

        <Group grow>
          <TextInput
            label="Número do Lote"
            placeholder="Digite o número do lote"
            required
            {...form.register('lote')}
            error={form.formState.errors.lote?.message}
          />

          <TextInput
            label="Fabricante"
            placeholder="Digite o nome do fabricante"
            required
            {...form.register('fabricante')}
            error={form.formState.errors.fabricante?.message}
          />
        </Group>

        <Textarea
          label="Descrição"
          placeholder="Digite uma descrição do medicamento"
          {...form.register('descricao')}
          error={form.formState.errors.descricao?.message}
        />

        <Group position="right" mt="md">
          <Button variant="subtle" onClick={() => form.reset()}>Limpar</Button>
          <Button type="submit">Cadastrar</Button>
        </Group>
      </Stack>
    </form>
  );
}