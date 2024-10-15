"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Search, Filter, Plus, Info } from 'lucide-react'

// Tipos
type ItemType = 'Arma' | 'Armadura' | 'Poção' | 'Consumível' | 'Outro'
type Rarity = 'Comum' | 'Incomum' | 'Raro' | 'Épico' | 'Lendário'
type Availability = 'Disponível' | 'Em Uso'

interface Item {
  id: number
  name: string
  description: string
  type: ItemType
  rarity: Rarity
  quantity: number
  price: number
  availability: Availability
  lore?: string
}

export default function InventoryManagement() {
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<ItemType | 'Todos'>('Todos')
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'Todos'>('Todos')
  const [availabilityFilter, setAvailabilityFilter] = useState<Availability | 'Todos'>('Todos')
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  // Efeito para carregar itens (simulado)
  useEffect(() => {
    // Simular carregamento de itens de uma API
    const mockItems: Item[] = [
      { id: 1, name: 'Espada Longa', description: 'Uma espada longa afiada', type: 'Arma', rarity: 'Comum', quantity: 5, price: 100, availability: 'Disponível', lore: 'Forjada pelos mestres ferreiros de Azeroth.' },
      { id: 2, name: 'Poção de Cura', description: 'Restaura 50 pontos de vida', type: 'Poção', rarity: 'Comum', quantity: 10, price: 50, availability: 'Disponível', lore: 'Destilada com ervas raras da Floresta Negra.' },
      { id: 3, name: 'Armadura de Placas', description: 'Armadura pesada', type: 'Armadura', rarity: 'Raro', quantity: 1, price: 500, availability: 'Em Uso', lore: 'Pertenceu a um lendário cavaleiro da Ordem da Luz.' },
    ]
    setItems(mockItems)
    setFilteredItems(mockItems)
  }, [])

  // Efeito para filtrar itens
  useEffect(() => {
    let result = items
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (typeFilter !== 'Todos') {
      result = result.filter(item => item.type === typeFilter)
    }
    if (rarityFilter !== 'Todos') {
      result = result.filter(item => item.rarity === rarityFilter)
    }
    if (availabilityFilter !== 'Todos') {
      result = result.filter(item => item.availability === availabilityFilter)
    }
    setFilteredItems(result)
  }, [items, searchTerm, typeFilter, rarityFilter, availabilityFilter])

  const handleAddItem = (newItem: Omit<Item, 'id'>) => {
    const id = Math.max(...items.map(item => item.id), 0) + 1
    setItems([...items, { ...newItem, id }])
    setIsFormOpen(false)
  }

  const handleEditItem = (updatedItem: Item) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item))
    setIsFormOpen(false)
    setEditingItem(null)
  }

  const handleDeleteItem = (item: Item) => {
    setItemToDelete(item)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      setItems(items.filter(item => item.id !== itemToDelete.id))
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const openDetails = (item: Item) => {
    setSelectedItem(item)
    setIsDetailsOpen(true)
  }

  // Cálculos para o resumo do inventário
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const itemsByType = items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + item.quantity
    return acc
  }, {} as Record<ItemType, number>)
  const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Gestão de Inventário</h1>
      
      {/* Resumo do Inventário */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumo do Inventário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">Total de Itens:</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Itens por Tipo:</p>
              {Object.entries(itemsByType).map(([type, count]) => (
                <p key={type}>{type}: {count}</p>
              ))}
            </div>
            <div>
              <p className="text-sm font-medium">Valor Total Estimado:</p>
              <p className="text-2xl font-bold">{totalValue} Moedas de Ouro</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Barra de Busca e Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Buscar itens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ItemType | 'Todos')}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os Tipos</SelectItem>
            <SelectItem value="Arma">Arma</SelectItem>
            <SelectItem value="Armadura">Armadura</SelectItem>
            <SelectItem value="Poção">Poção</SelectItem>
            <SelectItem value="Consumível">Consumível</SelectItem>
            <SelectItem value="Outro">Outro</SelectItem>
          </SelectContent>
        </Select>
        <Select value={rarityFilter} onValueChange={(value) => setRarityFilter(value as Rarity | 'Todos')}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Raridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todas as Raridades</SelectItem>
            <SelectItem value="Comum">Comum</SelectItem>
            <SelectItem value="Incomum">Incomum</SelectItem>
            <SelectItem value="Raro">Raro</SelectItem>
            <SelectItem value="Épico">Épico</SelectItem>
            <SelectItem value="Lendário">Lendário</SelectItem>
          </SelectContent>
        </Select>
        <Select value={availabilityFilter} onValueChange={(value) => setAvailabilityFilter(value as Availability | 'Todos')}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Disponibilidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todas</SelectItem>
            <SelectItem value="Disponível">Disponível</SelectItem>
            <SelectItem value="Em Uso">Em Uso</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => { setEditingItem(null); setIsFormOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Item
        </Button>
      </div>

      {/* Lista de Itens */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Itens</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Raridade</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <Badge variant={item.rarity === 'Comum' ? 'secondary' : 
                                    item.rarity === 'Incomum' ? 'default' :
                                    item.rarity === 'Raro' ? 'info' :
                                    item.rarity === 'Épico' ? 'warning' : 'destructive'}>
                      {item.rarity}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => openDetails(item)}>
                        <Info className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => { setEditingItem(item); setIsFormOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteItem(item)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Formulário de Criação/Edição de Item */}
           <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar Item' : 'Adicionar Novo Item'}</DialogTitle>
          </DialogHeader>
          <ItemForm item={editingItem} onSubmit={editingItem ? handleEditItem : handleAddItem} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o item "{itemToDelete?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[550px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label>Descrição</Label>
              <p>{selectedItem?.description}</p>
            </div>
            <div>
              <Label>Tipo</Label>
              <p>{selectedItem?.type}</p>
            </div>
            <div>
              <Label>Raridade</Label>
              <p>{selectedItem?.rarity}</p>
            </div>
            <div>
              <Label>Quantidade</Label>
              <p>{selectedItem?.quantity}</p>
            </div>
            <div>
              <Label>Preço</Label>
              <p>{selectedItem?.price} Moedas de Ouro</p>
            </div>
            <div>
              <Label>Disponibilidade</Label>
              <p>{selectedItem?.availability}</p>
            </div>
            <div>
              <Label>História (Lore)</Label>
              <p>{selectedItem?.lore || 'Nenhuma história disponível.'}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Componente do Formulário de Item
function ItemForm({ item, onSubmit }: { item: Item | null, onSubmit:  (item: Omit<Item, 'id'>) => void }) {
  const [formData, setFormData] = useState<Omit<Item, 'id'>>(
    item || {
      name: '',
      description: '',
      type: 'Outro',
      rarity: 'Comum',
      quantity: 1,
      price: 0,
      availability: 'Disponível',
      lore: ''
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nome
          </Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Descrição
          </Label>
          <Input id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="type" className="text-right">
            Tipo
          </Label>
          <Select name="type" value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as ItemType }))}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arma">Arma</SelectItem>
              <SelectItem value="Armadura">Armadura</SelectItem>
              <SelectItem value="Poção">Poção</SelectItem>
              <SelectItem value="Consumível">Consumível</SelectItem>
              <SelectItem value="Outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="rarity" className="text-right">
            Raridade
          </Label>
          <Select name="rarity" value={formData.rarity} onValueChange={(value) => setFormData(prev => ({ ...prev, rarity: value as Rarity }))}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione a raridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Comum">Comum</SelectItem>
              <SelectItem value="Incomum">Incomum</SelectItem>
              <SelectItem value="Raro">Raro</SelectItem>
              <SelectItem value="Épico">Épico</SelectItem>
              <SelectItem value="Lendário">Lendário</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="quantity" className="text-right">
            Quantidade
          </Label>
          <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} className="col-span-3" required min="0" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Preço
          </Label>
          <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} className="col-span-3" required min="0" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="availability" className="text-right">
            Disponibilidade
          </Label>
          <Select name="availability" value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value as Availability }))}>
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Selecione a disponibilidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Disponível">Disponível</SelectItem>
              <SelectItem value="Em Uso">Em Uso</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="lore" className="text-right">
            História (Lore)
          </Label>
          <Input id="lore" name="lore" value={formData.lore} onChange={handleChange} className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Salvar</Button>
      </DialogFooter>
    </form>
  )
}