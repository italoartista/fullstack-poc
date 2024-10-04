"use client"

import { useState, useCallback, useEffect, useRef } from 'react'
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  NodeTypes,
  OnConnect,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { v4 as uuidv4 } from 'uuid'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MessageCircle,
  User,
  Bot,
  Zap,
  Clock,
  BarChart2,
  Save,
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'

const IntentNode = ({ data }) => (
  <div className="p-4 border rounded-lg bg-blue-100">
    <MessageCircle className="mb-2" />
    <h3 className="font-bold">{data.label}</h3>
    <p>{data.description}</p>
  </div>
)

const UserResponseNode = ({ data }) => (
  <div className="p-4 border rounded-lg bg-green-100">
    <User className="mb-2" />
    <h3 className="font-bold">{data.label}</h3>
    <p>{data.responseOptions.join(', ')}</p>
  </div>
)

const BotReplyNode = ({ data }) => (
  <div className="p-4 border rounded-lg bg-yellow-100">
    <Bot className="mb-2" />
    <h3 className="font-bold">{data.label}</h3>
    <p>{data.message}</p>
  </div>
)

const ConditionalNode = ({ data }) => (
  <div className="p-4 border rounded-lg bg-purple-100">
    <Zap className="mb-2" />
    <h3 className="font-bold">{data.label}</h3>
    <p>{data.condition}</p>
  </div>
)

const DelayNode = ({ data }) => (
  <div className="p-4 border rounded-lg bg-gray-100">
    <Clock className="mb-2" />
    <h3 className="font-bold">{data.label}</h3>
    <p>{data.delay} segundos</p>
  </div>
)

const nodeTypes: NodeTypes = {
  intent: IntentNode,
  userResponse: UserResponseNode,
  botReply: BotReplyNode,
  conditional: ConditionalNode,
  delay: DelayNode,
}

export function ChatbotFlowDashboardComponent() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedTab, setSelectedTab] = useState('editor')
  const [version, setVersion] = useState(1)
  const [versionHistory, setVersionHistory] = useState([])
  const [collaborators, setCollaborators] = useState([])
  const [comments, setComments] = useState([])
  const [showOnboarding, setShowOnboarding] = useState(true)
  const { toast } = useToast()
  const reactFlowWrapper = useRef(null)

  const onConnect: OnConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const addNode = (type) => {
    const newNode = {
      id: uuidv4(),
      type,
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: { label: `Novo nó ${type}` },
    }
    setNodes((nds) => nds.concat(newNode))
  }

  const updateNodeData = (id, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...newData } }
        }
        return node
      })
    )
  }

  const saveVersion = () => {
    const newVersion = {
      version: version + 1,
      nodes: nodes,
      edges: edges,
    }
    setVersionHistory((history) => [...history, newVersion])
    setVersion(version + 1)
    toast({
      title: "Versão Salva",
      description: `Versão ${version + 1} do fluxo foi salva.`,
    })
  }

  const loadVersion = (selectedVersion) => {
    const loadedVersion = versionHistory.find((v) => v.version === selectedVersion)
    if (loadedVersion) {
      setNodes(loadedVersion.nodes)
      setEdges(loadedVersion.edges)
      setVersion(selectedVersion)
      toast({
        title: "Versão Carregada",
        description: `Versão ${selectedVersion} do fluxo foi carregada.`,
      })
    }
  }

  const addComment = (nodeId, comment) => {
    setComments((prevComments) => [...prevComments, { nodeId, comment, id: uuidv4() }])
  }

  const addCollaborator = (name, email) => {
    setCollaborators((prevCollaborators) => [...prevCollaborators, { name, email, id: uuidv4() }])
    toast({
      title: "Colaborador Adicionado",
      description: `${name} (${email}) foi adicionado como colaborador.`,
    })
  }

  useEffect(() => {
    const initialNodes = [
      {
        id: '1',
        type: 'intent',
        position: { x: 250, y: 5 },
        data: { label: 'Intenção de Boas-vindas', description: 'Saudação inicial' },
      },
      {
        id: '2',
        type: 'botReply',
        position: { x: 100, y: 100 },
        data: { label: 'Mensagem de Boas-vindas', message: 'Olá! Como posso ajudar você hoje?' },
      },
    ]
    const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }]
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [])

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData('application/reactflow')

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }

      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: { label: `Nó ${type}` },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [setNodes]
  )

  const analyticsData = [
    { name: 'Engajamento', value: 400 },
    { name: 'Taxa de Sucesso', value: 300 },
    { name: 'Tempo Médio', value: 200 },
    { name: 'Conclusão', value: 278 },
  ]

  const handleCloseOnboarding = useCallback(() => {
    setShowOnboarding(false)
  }, [])

  return (
    <TooltipProvider>
      <div className="flex h-screen">
        <div className="w-3/4 h-full">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="editor">Editor de Fluxo</TabsTrigger>
              <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
              <TabsTrigger value="analytics">Análises</TabsTrigger>
            </TabsList>
            <TabsContent value="editor">
              <div className="h-full" ref={reactFlowWrapper}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  onNodeClick={(_, node) => setSelectedNode(node)}
                  minZoom={0.2}
                  maxZoom={4}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                >
                  <Controls />
                  <MiniMap />
                  <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
              </div>
            </TabsContent>
            <TabsContent value="preview">
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Pré-visualização da Conversa</h2>
                <div className="border p-4 rounded-lg h-96 overflow-y-auto">
                  <p>Este é um espaço reservado para a pré-visualização da conversa. Implemente a funcionalidade real de pré-visualização aqui.</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="analytics">
              <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Painel de Análises</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-1/4 p-4 border-l overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Caixa de Ferramentas</h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { type: 'intent', label: 'Intenção', icon: MessageCircle },
              { type: 'userResponse', label: 'Resposta do Usuário', icon: User },
              { type: 'botReply', label: 'Resposta do Bot', icon: Bot },
              { type: 'conditional', label: 'Condicional', icon: Zap },
              { type: 'delay', label: 'Atraso', icon: Clock },
            ].map(({ type, label, icon: Icon }) => (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <Button
                    onDragStart={(event) => event.dataTransfer.setData('application/reactflow', type)}
                    draggable
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Arraste e solte para adicionar um nó {label.toLowerCase()}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          {selectedNode && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Editar Nó</h3>
              <Label htmlFor="nodeLabel">Rótulo</Label>
              <Input
                id="nodeLabel"
                value={selectedNode.data.label}
                onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
                className="mb-2"
              />
              {selectedNode.type === 'intent' && (
                <>
                  <Label htmlFor="intentDescription">Descrição</Label>
                  <Textarea
                    id="intentDescription"
                    value={selectedNode.data.description}
                    onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
                    className="mb-2"
                  />
                </>
              )}
              {selectedNode.type === 'userResponse' && (
                <>
                  <Label htmlFor="responseOptions">Opções de Resposta (separadas por vírgula)</Label>
                  <Input
                    id="responseOptions"
                    value={selectedNode.data.responseOptions?.join(', ')}
                    onChange={(e) => updateNodeData(selectedNode.id, { responseOptions: e.target.value.split(', ') })}
                    className="mb-2"
                  />
                </>
              )}
              {selectedNode.type === 'botReply' && (
                <>
                  <Label htmlFor="botMessage">Mensagem</Label>
                  <Textarea
                    id="botMessage"
                    value={selectedNode.data.message}
                    onChange={(e) => updateNodeData(selectedNode.id, { message: e.target.value })}
                    className="mb-2"
                  />
                </>
              )}
              {selectedNode.type === 'conditional' && (
                <>
                  <Label htmlFor="condition">Condição</Label>
                  <Input
                    id="condition"
                    value={selectedNode.data.condition}
                    onChange={(e) => updateNodeData(selectedNode.id, { condition: e.target.value })}
                    className="mb-2"
                  />
                </>
              )}
              {selectedNode.type === 'delay' && (
                <>
                  <Label htmlFor="delay">Atraso (segundos)</Label>
                  <Input
                    id="delay"
                    type="number"
                    value={selectedNode.data.delay}
                    onChange={(e) => updateNodeData(selectedNode.id, { delay: parseInt(e.target.value) })}
                    className="mb-2"
                  />
                </>
              )}
              <div className="mt-4">
                <Label htmlFor="nodeComment">Adicionar Comentário</Label>
                <div className="flex space-x-2">
                  <Input
                    id="nodeComment"
                    placeholder="Digite um comentário"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addComment(selectedNode.id, e.target.value)
                        e.target.value = ''
                      }
                    }}
                  />
                  <Button onClick={() => {
                    const comment = document.getElementById('nodeComment').value
                    addComment(selectedNode.id, comment)
                    document.getElementById('nodeComment').value = ''
                  }}>
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Controle de Versão</h3>
            <div className="flex space-x-2 mb-2">
              <Button onClick={saveVersion}>
                <Save className="mr-2 h-4 w-4" /> Salvar Versão
              </Button>
              <Select onValueChange={loadVersion}>
                <SelectTrigger>
                  <SelectValue placeholder="Carregar Versão" />
                </SelectTrigger>
                <SelectContent>
                  {versionHistory.map((v) => (
                    <SelectItem key={v.version} value={v.version}>
                      Versão {v.version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Colaboradores</h3>
            <div className="flex space-x-2 mb-2">
              <Input placeholder="Nome" id="collaboratorName" />
              <Input placeholder="Email" id="collaboratorEmail" />
              <Button onClick={() => {
                const name = document.getElementById('collaboratorName').value
                const email = document.getElementById('collaboratorEmail').value
                addCollaborator(name, email)
                document.getElementById('collaboratorName').value = ''
                document.getElementById('collaboratorEmail').value = ''
              }}>
                Adicionar
              </Button>
            </div>
            <ul className="list-disc pl-5">
              {collaborators.map((collaborator) => (
                <li key={collaborator.id}>{collaborator.name} ({collaborator.email})</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {showOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4">Bem-vindo ao Construtor de Fluxo de Chatbot</h2>
            <p className="mb-4">Esta ferramenta permite que você crie fluxos de conversação complexos para o seu chatbot. Aqui está um guia rápido:</p>
            <ol className="list-decimal pl-5 mb-4">
              <li>Arraste e solte nós da caixa de ferramentas para criar seu fluxo</li>
              <li>Conecte os nós para definir o caminho da conversa</li>
              <li>Edite as propriedades dos nós na barra lateral</li>
              <li>Use a aba de pré-visualização para testar sua conversa</li>
              <li>Verifique a aba de análises para obter insights</li>
            </ol>
            <Button onClick={handleCloseOnboarding}>Começar</Button>
          </div>
        </div>
      )}
    </TooltipProvider>
  )
}