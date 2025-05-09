"use client"

import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Filter, X } from "lucide-react"

export type FilterValues = {
  user: string
  medicationType: string
  adherenceRate: string
  ageRange: number[]
  timeOfDay: string[]
}

type FilterControlsProps = {
  onFilterChange: (filters: FilterValues) => void
  defaultValues?: Partial<FilterValues>
}

export function FilterControls({ onFilterChange, defaultValues }: FilterControlsProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [user, setUser] = useState(defaultValues?.user || "all")
  const [medicationType, setMedicationType] = useState(defaultValues?.medicationType || "all")
  const [adherenceRate, setAdherenceRate] = useState(defaultValues?.adherenceRate || "all")
  const [ageRange, setAgeRange] = useState(defaultValues?.ageRange || [20, 70])
  const [timeOfDay, setTimeOfDay] = useState<string[]>(defaultValues?.timeOfDay || [])

  useEffect(() => {
    onFilterChange({
      user,
      medicationType,
      adherenceRate,
      ageRange,
      timeOfDay,
    })
  }, [user, medicationType, adherenceRate, ageRange, timeOfDay, onFilterChange])

  const toggleTimeOfDay = (value: string) => {
    setTimeOfDay(timeOfDay.includes(value) ? timeOfDay.filter((item) => item !== value) : [...timeOfDay, value])
  }

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
        {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
        {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
      </Button>

      {showFilters && (
        <Card className="p-4">
          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>Filtros Básicos</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="user">Usuário</Label>
                    <Select value={user} onValueChange={setUser}>
                      <SelectTrigger id="user">
                        <SelectValue placeholder="Todos os usuários" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os usuários</SelectItem>
                        <SelectItem value="user1">Usuário 1</SelectItem>
                        <SelectItem value="user2">Usuário 2</SelectItem>
                        <SelectItem value="user3">Usuário 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medication">Tipo de Medicamento</Label>
                    <Select value={medicationType} onValueChange={setMedicationType}>
                      <SelectTrigger id="medication">
                        <SelectValue placeholder="Todos os tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os tipos</SelectItem>
                        <SelectItem value="cardiac">Cardíacos</SelectItem>
                        <SelectItem value="diabetes">Diabetes</SelectItem>
                        <SelectItem value="pressure">Pressão</SelectItem>
                        <SelectItem value="other">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adherence">Taxa de Adesão</Label>
                    <Select value={adherenceRate} onValueChange={setAdherenceRate}>
                      <SelectTrigger id="adherence">
                        <SelectValue placeholder="Todas as taxas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as taxas</SelectItem>
                        <SelectItem value="high">Alta (&gt;80%)</SelectItem>
                        <SelectItem value="medium">Média (50-80%)</SelectItem>
                        <SelectItem value="low">Baixa (&lt;50%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Filtros Avançados</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>
                        Faixa Etária: {ageRange[0]} - {ageRange[1]} anos
                      </Label>
                    </div>
                    <Slider
                      defaultValue={[20, 70]}
                      max={100}
                      min={0}
                      step={1}
                      value={ageRange}
                      onValueChange={setAgeRange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Horários mais esquecidos</Label>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="morning"
                          checked={timeOfDay.includes("morning")}
                          onCheckedChange={() => toggleTimeOfDay("morning")}
                        />
                        <label
                          htmlFor="morning"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Manhã
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="afternoon"
                          checked={timeOfDay.includes("afternoon")}
                          onCheckedChange={() => toggleTimeOfDay("afternoon")}
                        />
                        <label
                          htmlFor="afternoon"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Tarde
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="night"
                          checked={timeOfDay.includes("night")}
                          onCheckedChange={() => toggleTimeOfDay("night")}
                        />
                        <label
                          htmlFor="night"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Noite
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      )}
    </div>
  )
}
