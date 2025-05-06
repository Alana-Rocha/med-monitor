"use client"

import { useState, useMemo } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FilterControls, type FilterValues } from "@/components/filter-controls"

const allImpactData = [
  { mes: "Jan", adesaoAntes: 60, adesaoDepois: 65, faixaEtaria: [20, 60], medicationType: "cardiac", user: "user1" },
  { mes: "Fev", adesaoAntes: 60, adesaoDepois: 68, faixaEtaria: [30, 70], medicationType: "diabetes", user: "user2" },
  { mes: "Mar", adesaoAntes: 60, adesaoDepois: 72, faixaEtaria: [25, 65], medicationType: "pressure", user: "user1" },
  { mes: "Abr", adesaoAntes: 60, adesaoDepois: 75, faixaEtaria: [40, 80], medicationType: "cardiac", user: "user3" },
  { mes: "Mai", adesaoAntes: 60, adesaoDepois: 78, faixaEtaria: [35, 75], medicationType: "other", user: "user2" },
  { mes: "Jun", adesaoAntes: 60, adesaoDepois: 82, faixaEtaria: [20, 90], medicationType: "diabetes", user: "user1" },
]

const allRegionData = [
  {
    regiao: "Norte",
    adesao: 75,
    reducaoEsquecimentos: 15,
    faixaEtaria: [20, 60],
    medicationType: "cardiac",
    user: "user1",
    timeOfDay: ["morning", "afternoon"],
  },
  {
    regiao: "Nordeste",
    adesao: 80,
    reducaoEsquecimentos: 20,
    faixaEtaria: [30, 70],
    medicationType: "diabetes",
    user: "user2",
    timeOfDay: ["afternoon", "night"],
  },
  {
    regiao: "Centro-Oeste",
    adesao: 78,
    reducaoEsquecimentos: 18,
    faixaEtaria: [25, 65],
    medicationType: "pressure",
    user: "user3",
    timeOfDay: ["morning", "night"],
  },
  {
    regiao: "Sudeste",
    adesao: 85,
    reducaoEsquecimentos: 25,
    faixaEtaria: [40, 80],
    medicationType: "cardiac",
    user: "user1",
    timeOfDay: ["night"],
  },
  {
    regiao: "Sul",
    adesao: 82,
    reducaoEsquecimentos: 22,
    faixaEtaria: [35, 75],
    medicationType: "other",
    user: "user2",
    timeOfDay: ["morning"],
  },
]

const allAgeImpactData = [
  {
    faixa: "18-30",
    adesao: 70,
    reducaoEsquecimentos: 15,
    medicationType: "cardiac",
    user: "user1",
    timeOfDay: ["night"],
  },
  {
    faixa: "31-45",
    adesao: 75,
    reducaoEsquecimentos: 18,
    medicationType: "diabetes",
    user: "user2",
    timeOfDay: ["morning", "afternoon"],
  },
  {
    faixa: "46-60",
    adesao: 80,
    reducaoEsquecimentos: 22,
    medicationType: "pressure",
    user: "user3",
    timeOfDay: ["afternoon"],
  },
  {
    faixa: "61-75",
    adesao: 78,
    reducaoEsquecimentos: 20,
    medicationType: "cardiac",
    user: "user1",
    timeOfDay: ["morning", "night"],
  },
  {
    faixa: "76+",
    adesao: 72,
    reducaoEsquecimentos: 16,
    medicationType: "other",
    user: "user2",
    timeOfDay: ["afternoon", "night"],
  },
]

const getFaixaEtariaRange = (faixa: string): [number, number] => {
  if (faixa === "18-30") return [18, 30]
  if (faixa === "31-45") return [31, 45]
  if (faixa === "46-60") return [46, 60]
  if (faixa === "61-75") return [61, 75]
  if (faixa === "76+") return [76, 100]
  return [0, 100]
}

const passesFilter = (item: any, filters: FilterValues): boolean => {
  if (filters.user !== "all" && item.user !== filters.user) {
    return false
  }

  if (filters.medicationType !== "all" && item.medicationType !== filters.medicationType) {
    return false
  }

  if (filters.adherenceRate !== "all") {
    if (filters.adherenceRate === "high" && item.adesao < 80) {
      return false
    }
    if (filters.adherenceRate === "medium" && (item.adesao < 50 || item.adesao > 80)) {
      return false
    }
    if (filters.adherenceRate === "low" && item.adesao >= 50) {
      return false
    }
  }

  if (item.faixaEtaria) {
    if (item.faixaEtaria[1] < filters.ageRange[0] || item.faixaEtaria[0] > filters.ageRange[1]) {
      return false
    }
  } else if (item.faixa) {
    const range = getFaixaEtariaRange(item.faixa)
    if (range[1] < filters.ageRange[0] || range[0] > filters.ageRange[1]) {
      return false
    }
  }

  if (filters.timeOfDay.length > 0 && item.timeOfDay) {
    const hasMatchingTime = filters.timeOfDay.some((time) => item.timeOfDay.includes(time))
    if (!hasMatchingTime) {
      return false
    }
  }

  return true
}

export function SocialImpactPage() {
  const [period, setPeriod] = useState("6months")
  const [filters, setFilters] = useState<FilterValues>({
    user: "all",
    medicationType: "all",
    adherenceRate: "all",
    ageRange: [0, 100],
    timeOfDay: [],
  })

  const filteredImpactData = useMemo(() => {
    return allImpactData.filter((item) => passesFilter(item, filters))
  }, [filters])

  const filteredRegionData = useMemo(() => {
    return allRegionData.filter((item) => passesFilter(item, filters))
  }, [filters])

  const filteredAgeImpactData = useMemo(() => {
    return allAgeImpactData.filter((item) => passesFilter(item, filters))
  }, [filters])

  const metrics = useMemo(() => {
    if (filteredImpactData.length === 0) {
      return {
        aumentoAdesao: 0,
        reducaoEsquecimentos: 0,
        pacientesBeneficiados: 0,
        satisfacaoUsuarios: 0,
      }
    }

    const aumentoAdesao =
      filteredImpactData.reduce((acc, item) => acc + (item.adesaoDepois - item.adesaoAntes), 0) /
      filteredImpactData.length

    const reducaoEsquecimentos =
      filteredRegionData.length > 0
        ? filteredRegionData.reduce((acc, item) => acc + item.reducaoEsquecimentos, 0) / filteredRegionData.length
        : 0

    const pacientesBeneficiados = Math.round(245 * (filteredImpactData.length / allImpactData.length))

    const satisfacaoUsuarios = 92

    return {
      aumentoAdesao,
      reducaoEsquecimentos,
      pacientesBeneficiados,
      satisfacaoUsuarios,
    }
  }, [filteredImpactData, filteredRegionData])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Impacto Social</h1>
          <p className="text-muted-foreground">Análise do impacto do uso do aplicativo na adesão a medicamentos</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Últimos 3 meses</SelectItem>
              <SelectItem value="6months">Últimos 6 meses</SelectItem>
              <SelectItem value="1year">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <FilterControls onFilterChange={setFilters} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aumento na Adesão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{metrics.aumentoAdesao.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Desde o início do uso do aplicativo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redução de Esquecimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-{metrics.reducaoEsquecimentos.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Comparado ao período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Beneficiados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pacientesBeneficiados}</div>
            <p className="text-xs text-muted-foreground">No período selecionado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação dos Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.satisfacaoUsuarios}%</div>
            <p className="text-xs text-muted-foreground">Baseado em pesquisas de feedback</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="regional">Impacto Regional</TabsTrigger>
          <TabsTrigger value="demographic">Impacto Demográfico</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução da Taxa de Adesão</CardTitle>
              <CardDescription>Comparação antes e depois do uso do aplicativo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredImpactData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="adesaoAntes" stroke="#8884d8" name="Antes do App (%)" />
                  <Line type="monotone" dataKey="adesaoDepois" stroke="#82ca9d" name="Depois do App (%)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Impacto Social Acumulado</CardTitle>
              <CardDescription>Crescimento do impacto ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={filteredImpactData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="adesaoDepois"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name="Taxa de Adesão (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="regional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Impacto por Região</CardTitle>
              <CardDescription>Taxa de adesão e redução de esquecimentos por região</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredRegionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="regiao" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="adesao" fill="#8884d8" name="Taxa de Adesão (%)" />
                  <Bar dataKey="reducaoEsquecimentos" fill="#82ca9d" name="Redução de Esquecimentos (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="demographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Impacto por Faixa Etária</CardTitle>
              <CardDescription>Taxa de adesão e redução de esquecimentos por idade</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredAgeImpactData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="faixa" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="adesao" fill="#8884d8" name="Taxa de Adesão (%)" />
                  <Bar dataKey="reducaoEsquecimentos" fill="#82ca9d" name="Redução de Esquecimentos (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
