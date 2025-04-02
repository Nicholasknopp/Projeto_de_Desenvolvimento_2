import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Movimentacao {
  id: number;
  tipo: string;
  quantidade: number;
  data: string;
  responsavel: string;
  observacao?: string;
  medicamento: {
    id: number;
    nome: string;
  };
}

interface FiltroHistorico {
  dataInicio?: string;
  dataFim?: string;
  medicamentoId?: number;
}

export const HistoricoMedicamentos: React.FC = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [medicamentos, setMedicamentos] = useState<{ id: number; nome: string; }[]>([]);
  const [filtros, setFiltros] = useState<FiltroHistorico>({});

  useEffect(() => {
    carregarMedicamentos();
    carregarMovimentacoes();
  }, []);

  const carregarMedicamentos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/medicamentos', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMedicamentos(data);
    } catch (error) {
      console.error('Erro ao carregar medicamentos:', error);
    }
  };

  const carregarMovimentacoes = async () => {
    try {
      let url = 'http://localhost:3000/api/movimentacoes';
      const params = new URLSearchParams();

      if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
      if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
      if (filtros.medicamentoId) params.append('medicamentoId', String(filtros.medicamentoId));

      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setMovimentacoes(data);
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
    }
  };

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const aplicarFiltros = (e: React.FormEvent) => {
    e.preventDefault();
    carregarMovimentacoes();
  };

  const processarDadosGrafico = () => {
    const dadosPorData: { [key: string]: number } = {};

    movimentacoes.forEach(mov => {
      const data = mov.data.split('T')[0];
      if (!dadosPorData[data]) {
        dadosPorData[data] = 0;
      }
      dadosPorData[data] += mov.tipo === 'saida' ? mov.quantidade : 0;
    });

    const labels = Object.keys(dadosPorData).sort();
    const valores = labels.map(data => dadosPorData[data]);

    return { labels, valores };
  };

  const dadosGrafico = processarDadosGrafico();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Histórico de Movimentações</h1>

      <form onSubmit={aplicarFiltros} className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Data Início</label>
          <input
            type="date"
            name="dataInicio"
            value={filtros.dataInicio || ''}
            onChange={handleFiltroChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Data Fim</label>
          <input
            type="date"
            name="dataFim"
            value={filtros.dataFim || ''}
            onChange={handleFiltroChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Medicamento</label>
          <select
            name="medicamentoId"
            value={filtros.medicamentoId || ''}
            onChange={handleFiltroChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Todos</option>
            {medicamentos.map(med => (
              <option key={med.id} value={med.id}>{med.nome}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <button
            type="submit"
            className="w-full md:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Aplicar Filtros
          </button>
        </div>
      </form>

      <div className="mb-8">
        <Line
          data={{
            labels: dadosGrafico.labels,
            datasets: [
              {
                label: 'Consumo de Medicamentos',
                data: dadosGrafico.valores,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }
            ]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: true,
                text: 'Consumo de Medicamentos por Data'
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observação</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movimentacoes.map(mov => (
              <tr key={mov.id}>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(mov.data).toLocaleString('pt-BR')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{mov.medicamento.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap">{mov.quantidade}</td>
                <td className="px-6 py-4 whitespace-nowrap">{mov.tipo}</td>
                <td className="px-6 py-4 whitespace-nowrap">{mov.responsavel}</td>
                <td className="px-6 py-4 whitespace-nowrap">{mov.observacao || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};