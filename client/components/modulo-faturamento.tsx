'use client'

import React, { createContext, useContext, useReducer } from 'react'
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Pagination } from "@/components/ui/pagination"
import { PlusCircle, FileText, DollarSign, Edit, Trash2 } from 'lucide-react'

// Tipos
interface Fatura {
  id: number
  cliente: string
  valor: number
  data: string
  status: 'Pendente' | 'Paga' | 'Atrasada'
  itens: Array<{ descricao: string; valor: number }>
  impostos: number
  desconto: number
  metodoPagamento: string
}

interface FaturaState {
  faturas: Fatura[]
  filtro: string
  paginaAtual: number
}

// Context
const FaturaContext = createContext<{
  state: FaturaState
  dispatch: React.Dispatch<any>
} | undefined>(undefined)

// Reducer
function faturaReducer(state: FaturaState, action: any) {
  switch (action.type) {
    case 'SET_FATURAS':
      return { ...state, faturas: action.payload }
    case 'SET_FILTRO':
      return { ...state, filtro: action.payload }
    case 'SET_PAGINA':
      return { ...state, paginaAtual: action.payload }
    default:
      return state
  }
}

// Provider
function FaturaProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(faturaReducer, {
    faturas: [],
    filtro: '',
    paginaAtual: 1
  })

  return (
    <FaturaContext.Provider value={{ state, dispatch }}>
      {children}
    </FaturaContext.Provider>
  )
}

// Hook personalizado
function useFatura() {
  const context = useContext(FaturaContext)
  if (context === undefined) {
    throw new Error('useFatura must be used within a FaturaProvider')
  }
  return context
}

// API simulada
const api = {
  getFaturas: async (page: number, filtro: string) => {
    // Simula uma chamada API
    await new Promise(resolve => setTimeout(resolve, 500))
    const todasFaturas: Fatura[] = [
      { 
        id: 1, 
        cliente: 'Empresa A', 
        valor: 1000, 
        data: '2023-05-15', 
        status: 'Pendente',
        itens: [{ descricao: 'Serviço 1', valor: 1000 }],
        impostos: 100,
        desconto: 0,
        metodoPagamento: 'Boleto'
      },
      { 
        id: 2, 
        cliente: 'Empresa B', 
        valor: 1500, 
        data: '2023-05-10', 
        status: 'Paga',
        itens: [{ descricao: 'Produto 1', valor: 1500 }],
        impostos: 150,
        desconto: 50,
        metodoPagamento: 'Cartão de Crédito'
      },
      { 
        id: 3, 
        cliente: 'Empresa C', 
        valor: 2000, 
        data: '2023-05-05', 
        status: 'Atrasada',
        itens: [{ descricao: 'Consultoria', valor: 2000 }],
        impostos: 200,
        desconto: 0,
        metodoPagamento: 'Transferência Bancária'
      },
    ]
    const faturasFiltradas = todasFaturas.filter(f => 
      f.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
      f.status.toLowerCase().includes(filtro.toLowerCase())
    )
    return {
      faturas: faturasFiltradas.slice((page - 1) * 10, page * 10),
      total: faturasFiltradas.length
    }
  },
  criarFatura: async (fatura: Omit<Fatura, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { ...fatura, id: Math.floor(Math.random() * 1000) }
  },
  atualizarFatura: async (fatura: Fatura) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return fatura
  },
  deletarFatura: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return { success: true }
  }
}

// Componente principal
export function ModuloFaturamento() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <FaturaProvider>
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">Módulo de Faturamento</h1>
          <NovaFatura />
          <ListaFaturas />
          <ResumoFinanceiro />
        </div>
      </FaturaProvider>
      <ToastContainer />
    </QueryClientProvider>
  )
}

// Componente para criar nova fatura
function NovaFatura() {
  const queryClient = useQueryClient()
  const schema = yup.object().shape({
    cliente: yup.string().required('Cliente é obrigatório'),
    valor: yup.number().positive('Valor deve ser positivo').required('Valor é obrigatório'),
    data: yup.date().required('Data é obrigatória'),
    status: yup.string().oneOf(['Pendente', 'Paga', 'Atrasada']).required('Status é obrigatório'),
    itens: yup.array().of(
      yup.object().shape({
        descricao: yup.string().required('Descrição do item é obrigatória'),
        valor: yup.number().positive('Valor do item deve ser positivo').required('Valor do item é obrigatório')
      })
    ).required('Pelo menos um item é obrigatório'),
    impostos: yup.number().min(0, 'Impostos não podem ser negativos').required('Impostos são obrigatórios'),
    desconto: yup.number().min(0, 'Desconto não pode ser negativo').required('Desconto é obrigatório'),
    metodoPagamento: yup.string().required('Método de pagamento é obrigatório')
  })

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  const mutation = useMutation(api.criarFatura, {
    onSuccess: () => {
      queryClient.invalidateQueries('faturas')
      toast.success('Fatura criada com sucesso!')
      reset()
    },
    onError: () => {
      toast.error('Erro ao criar fatura')
    }
  })

  const onSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Nova Fatura</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Input id="cliente" {...register('cliente')} />
              {errors.cliente && <p className="text-red-500">{errors.cliente.message}</p>}
            </div>
            <div>
              <Label htmlFor="valor">Valor</Label>
              <Input id="valor" type="number" {...register('valor')} />
              {errors.valor && <p className="text-red-500">{errors.valor.message}</p>}
            </div>
            <div>
              <Label htmlFor="data">Data</Label>
              <Input id="data" type="date" {...register('data')} />
              {errors.data && <p className="text-red-500">{errors.data.message}</p>}
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <Select.Trigger>
                      <Select.Value placeholder="Selecione o status" />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="Pendente">Pendente</Select.Item>
                      <Select.Item value="Paga">Paga</Select.Item>
                      <Select.Item value="Atrasada">Atrasada</Select.Item>
                    </Select.Content>
                  </Select>
                )}
              />
              {errors.status && <p className="text-red-500">{errors.status.message}</p>}
            </div>
          </div>
          <div>
            <Label>Itens</Label>
            <Controller
              name="itens"
              control={control}
              defaultValue={[{ descricao: '', valor: 0 }]}
              render={({ field }) => (
                <div>
                  {field.value.map((item: any, index: number) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        placeholder="Descrição"
                        value={item.descricao}
                        onChange={(e) => {
                          const newItens = [...field.value]
                          newItens[index].descricao = e.target.value
                          field.onChange(newItens)
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Valor"
                        value={item.valor}
                        onChange={(e) => {
                          const newItens = [...field.value]
                          newItens[index].valor = Number(e.target.value)
                          field.onChange(newItens)
                        }}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => field.onChange([...field.value, { descricao: '', valor: 0 }])}
                    className="mt-2"
                  >
                    Adicionar Item
                  </Button>
                </div>
              )}
            />
            {errors.itens && <p className="text-red-500">{errors.itens.message}</p>}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="impostos">Impostos</Label>
              <Input id="impostos" type="number" {...register('impostos')} />
              {errors.impostos && <p className="text-red-500">{errors.impostos.message}</p>}
            </div>
            <div>
              <Label htmlFor="desconto">Desconto</Label>
              <Input id="desconto" type="number" {...register('desconto')} />
              {errors.desconto && <p className="text-red-500">{errors.desconto.message}</p>}
            </div>
            <div>
              <Label htmlFor="metodoPagamento">Método de Pagamento</Label>
              <Input id="metodoPagamento" {...register('metodoPagamento')} />
              {errors.metodoPagamento && <p className="text-red-500">{errors.metodoPagamento.message}</p>}
            </div>
          </div>
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Criando...' : 'Criar Fatura'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Componente para listar faturas
function ListaFaturas() {
  const { state, dispatch } = useFatura()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery(
    ['faturas', state.paginaAtual, state.filtro],
    () => api.getFaturas(state.paginaAtual, state.filtro),
    { keepPreviousData: true }
  )

  const deleteMutation = useMutation(api.deletarFatura, {
    onSuccess: () => {
      queryClient.invalidateQueries('faturas')
      toast.success('Fatura deletada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao deletar fatura')
    }
  })

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro ao carregar faturas</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Faturas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Filtrar faturas..."
            value={state.filtro}
            onChange={(e) => dispatch({ type: 'SET_FILTRO', payload: e.target.value })}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.faturas.map((fatura: Fatura) => (
              <TableRow key={fatura.id}>
                <TableCell>{fatura.id}</TableCell>
                <TableCell>{fatura.cliente}</TableCell>
                <TableCell>R$ {fatura.valor.toFixed(2)}</TableCell>
                
                <TableCell>{fatura.data}</TableCell>
                <TableCell>{fatura.status}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <DetalhesFatura fatura={fatura} />
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteMutation.mutate(fatura.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          className="mt-4"
          currentPage={state.paginaAtual}
          totalPages={Math.ceil((data?.total || 0) / 10)}
          onPageChange={(page) => dispatch({ type: 'SET_PAGINA', payload: page })}
        />
      </CardContent>
    </Card>
  )
}

// Componente para exibir detalhes da fatura
function DetalhesFatura({ fatura }: { fatura: Fatura }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <FileText className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da Fatura</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <p><strong>ID:</strong> {fatura.id}</p>
          <p><strong>Cliente:</strong> {fatura.cliente}</p>
          <p><strong>Valor Total:</strong> R$ {fatura.valor.toFixed(2)}</p>
          <p><strong>Data:</strong> {fatura.data}</p>
          <p><strong>Status:</strong> {fatura.status}</p>
          <p><strong>Método de Pagamento:</strong> {fatura.metodoPagamento}</p>
          <div>
            <strong>Itens:</strong>
            <ul className="list-disc list-inside">
              {fatura.itens.map((item, index) => (
                <li key={index}>{item.descricao} - R$ {item.valor.toFixed(2)}</li>
              ))}
            </ul>
          </div>
          <p><strong>Impostos:</strong> R$ {fatura.impostos.toFixed(2)}</p>
          <p><strong>Desconto:</strong> R$ {fatura.desconto.toFixed(2)}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Componente para exibir resumo financeiro
function ResumoFinanceiro() {
  const { data } = useQuery('faturas', () => api.getFaturas(1, ''))

  const totalFaturado = data?.faturas.reduce((sum, fatura) => sum + fatura.valor, 0) || 0
  const faturasPendentes = data?.faturas.filter(f => f.status === 'Pendente').length || 0
  const faturasAtrasadas = data?.faturas.filter(f => f.status === 'Atrasada').length || 0

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Resumo Financeiro</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div>
            <p className="text-lg font-semibold">Total Faturado</p>
            <p className="text-3xl font-bold text-green-600">
              <DollarSign className="inline-block mr-1 h-8 w-8" />
              R$ {totalFaturado.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold">Faturas Pendentes</p>
            <p className="text-3xl font-bold text-yellow-600">{faturasPendentes}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Faturas Atrasadas</p>
            <p className="text-3xl font-bold text-red-600">{faturasAtrasadas}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}