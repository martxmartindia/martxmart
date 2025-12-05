"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Edit, Filter, MapPin, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"

interface Territory {
  id: string
  name: string
  city: string
  state: string
  zipCodes: string[]
  population: number | null
  businessPotential: number | null
  isExclusive: boolean
  createdAt: string
  updatedAt: string
}

export function TerritoryManagement() {
  const [territories, setTerritories] = useState<Territory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [openNewTerritory, setOpenNewTerritory] = useState(false)
  const [editingTerritory, setEditingTerritory] = useState<Territory | null>(null)
  const [territoryFormData, setTerritoryFormData] = useState({
    name: "",
    city: "",
    state: "",
    zipCodes: "",
    population: "",
    businessPotential: "",
    isExclusive: false,
  })

  // Fetch territories on component mount
  useEffect(() => {
    fetchTerritories()
  }, [])

  const fetchTerritories = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/franchise-portal/territories")
      if (!response.ok) {
        throw new Error("Failed to fetch territories")
      }
      const data = await response.json()
      setTerritories(data.territories)
    } catch (error) {
      console.error("Error fetching territories:", error)
      toast.error("Failed to load territories. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTerritory = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const zipCodesArray = territoryFormData.zipCodes
        .split(",")
        .map(code => code.trim())
        .filter(code => code.length > 0)

      const response = await fetch("/api/franchise-portal/territories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...territoryFormData,
          zipCodes: zipCodesArray,
          population: territoryFormData.population ? parseInt(territoryFormData.population) : null,
          businessPotential: territoryFormData.businessPotential || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create territory")
      }

      const data = await response.json()

      // Add the new territory to the list
      setTerritories([data.territory, ...territories])

      // Reset form and close dialog
      resetForm()
      setOpenNewTerritory(false)

      toast.success("Territory has been added successfully.")
    } catch (error) {
      console.error("Error adding territory:", error)
      toast.error(error instanceof Error ? error.message : "Failed to add territory. Please try again.")
    }
  }

  const handleEditTerritory = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingTerritory) return

    try {
      const zipCodesArray = territoryFormData.zipCodes
        .split(",")
        .map(code => code.trim())
        .filter(code => code.length > 0)

      const response = await fetch(`/api/franchise-portal/territories/${editingTerritory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...territoryFormData,
          zipCodes: zipCodesArray,
          population: territoryFormData.population ? parseInt(territoryFormData.population) : null,
          businessPotential: territoryFormData.businessPotential || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update territory")
      }

      const data = await response.json()

      // Update the territory in the list
      setTerritories(territories.map(t => t.id === editingTerritory.id ? data.territory : t))

      // Reset form and close dialog
      resetForm()
      setEditingTerritory(null)

      toast.success("Territory has been updated successfully.")
    } catch (error) {
      console.error("Error updating territory:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update territory. Please try again.")
    }
  }

  const handleDeleteTerritory = async (territoryId: string) => {
    if (!confirm("Are you sure you want to delete this territory?")) return

    try {
      const response = await fetch(`/api/franchise-portal/territories/${territoryId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete territory")
      }

      // Remove the territory from the list
      setTerritories(territories.filter(t => t.id !== territoryId))

      toast.success("Territory has been deleted successfully.")
    } catch (error) {
      console.error("Error deleting territory:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete territory. Please try again.")
    }
  }

  const resetForm = () => {
    setTerritoryFormData({
      name: "",
      city: "",
      state: "",
      zipCodes: "",
      population: "",
      businessPotential: "",
      isExclusive: false,
    })
  }

  const openEditDialog = (territory: Territory) => {
    setEditingTerritory(territory)
    setTerritoryFormData({
      name: territory.name,
      city: territory.city,
      state: territory.state,
      zipCodes: territory.zipCodes.join(", "),
      population: territory.population?.toString() || "",
      businessPotential: territory.businessPotential?.toString() || "",
      isExclusive: territory.isExclusive,
    })
  }

  const filteredTerritories = territories.filter(
    (territory) =>
      territory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      territory.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      territory.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      territory.zipCodes.some(code => code.includes(searchQuery)),
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Territory Management</CardTitle>
          <CardDescription>Manage your franchise territories and market areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search territories..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Dialog open={openNewTerritory} onOpenChange={setOpenNewTerritory}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Territory
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Territory</DialogTitle>
                    <DialogDescription>
                      Define a new territory for your franchise operations.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddTerritory}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Territory Name</Label>
                          <Input
                            id="name"
                            required
                            value={territoryFormData.name}
                            onChange={(e) => setTerritoryFormData({ ...territoryFormData, name: e.target.value })}
                            placeholder="e.g., North Delhi"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            required
                            value={territoryFormData.city}
                            onChange={(e) => setTerritoryFormData({ ...territoryFormData, city: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            required
                            value={territoryFormData.state}
                            onChange={(e) => setTerritoryFormData({ ...territoryFormData, state: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="population">Population</Label>
                          <Input
                            id="population"
                            type="number"
                            value={territoryFormData.population}
                            onChange={(e) => setTerritoryFormData({ ...territoryFormData, population: e.target.value })}
                            placeholder="Optional"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCodes">ZIP Codes</Label>
                        <Textarea
                          id="zipCodes"
                          rows={2}
                          value={territoryFormData.zipCodes}
                          onChange={(e) => setTerritoryFormData({ ...territoryFormData, zipCodes: e.target.value })}
                          placeholder="Enter ZIP codes separated by commas (e.g., 110001, 110002, 110003)"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="businessPotential">Business Potential (₹)</Label>
                          <Input
                            id="businessPotential"
                            type="number"
                            value={territoryFormData.businessPotential}
                            onChange={(e) => setTerritoryFormData({ ...territoryFormData, businessPotential: e.target.value })}
                            placeholder="Optional"
                          />
                        </div>
                        <div className="flex items-center space-x-2 pt-8">
                          <input
                            type="checkbox"
                            id="isExclusive"
                            checked={territoryFormData.isExclusive}
                            onChange={(e) => setTerritoryFormData({ ...territoryFormData, isExclusive: e.target.checked })}
                          />
                          <Label htmlFor="isExclusive">Exclusive Territory</Label>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Territory</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Territory</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>ZIP Codes</TableHead>
                    <TableHead>Population</TableHead>
                    <TableHead>Business Potential</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTerritories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No territories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTerritories.map((territory) => (
                      <TableRow key={territory.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{territory.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {territory.city}, {territory.state}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[150px] truncate" title={territory.zipCodes.join(", ")}>
                            {territory.zipCodes.join(", ")}
                          </div>
                        </TableCell>
                        <TableCell>
                          {territory.population ? territory.population.toLocaleString() : "N/A"}
                        </TableCell>
                        <TableCell>
                          {territory.businessPotential ? formatCurrency(territory.businessPotential) : "N/A"}
                        </TableCell>
                        <TableCell>
                          {territory.isExclusive ? (
                            <Badge className="bg-green-100 text-green-800">Exclusive</Badge>
                          ) : (
                            <Badge variant="outline">Shared</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openEditDialog(territory)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteTerritory(territory.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Territory Dialog */}
      <Dialog open={!!editingTerritory} onOpenChange={() => setEditingTerritory(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Territory</DialogTitle>
            <DialogDescription>
              Update territory information and settings.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditTerritory}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Territory Name</Label>
                  <Input
                    id="edit-name"
                    required
                    value={territoryFormData.name}
                    onChange={(e) => setTerritoryFormData({ ...territoryFormData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    required
                    value={territoryFormData.city}
                    onChange={(e) => setTerritoryFormData({ ...territoryFormData, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-state">State</Label>
                  <Input
                    id="edit-state"
                    required
                    value={territoryFormData.state}
                    onChange={(e) => setTerritoryFormData({ ...territoryFormData, state: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-population">Population</Label>
                  <Input
                    id="edit-population"
                    type="number"
                    value={territoryFormData.population}
                    onChange={(e) => setTerritoryFormData({ ...territoryFormData, population: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-zipCodes">ZIP Codes</Label>
                <Textarea
                  id="edit-zipCodes"
                  rows={2}
                  value={territoryFormData.zipCodes}
                  onChange={(e) => setTerritoryFormData({ ...territoryFormData, zipCodes: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-businessPotential">Business Potential (₹)</Label>
                  <Input
                    id="edit-businessPotential"
                    type="number"
                    value={territoryFormData.businessPotential}
                    onChange={(e) => setTerritoryFormData({ ...territoryFormData, businessPotential: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    id="edit-isExclusive"
                    checked={territoryFormData.isExclusive}
                    onChange={(e) => setTerritoryFormData({ ...territoryFormData, isExclusive: e.target.checked })}
                  />
                  <Label htmlFor="edit-isExclusive">Exclusive Territory</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Territory</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}