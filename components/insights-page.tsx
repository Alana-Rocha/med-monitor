"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"

// Dados de exemplo
const insightsData = [
  {
    id: 1,
    title: "Pacientes com 3+ medicamentos têm mais dificuldades",
    description: "Pacientes que tomam 3 ou mais medicamentos têm taxa de adesão 25% menor que os demais.",
    impact: "high",
    trend: "stable",
    category: "medication",
  },
  {
    id: 2,
    title: "Horário noturno é o mais problemático",
    description: "45% dos esquecimentos ocorrem no período noturno, especialmente entre 20h e 22h.",
    impact: "medium",
    trend: "increasing",
    category: "time",
  },
  {
    id: 3,
    title: "Idosos acima de 75 anos precisam de mais lembretes",
    description: "Pacientes acima de 75 anos respondem melhor a lembretes múltiplos (2-3) por dose.",
    impact: "medium",
    trend: "stable",
    category: "age",
  },
  {
    id: 4,
    title: "Alertas visuais são mais eficazes que sonoros",
    description: "Alertas com ícones e cores têm taxa de resposta 30% maior que alertas apenas sonoros.",
    impact: "high",
    trend: "improving",
    category: "alert",
  },
  {
    id: 5,
    title: "Pacientes da região Sudeste têm melhor adesão",
    description: "A região Sudeste apresenta taxa de adesão 8% superior à média nacional.",
    impact: "low",
    trend: "stable",
    category: "region",
  },
]

// Dados de recomendações
const recommendationsData = [
  {
    id: 1,
    title: "Implementar lembretes múltiplos para pacientes com 3+ medicamentos",
    description: "Aumentar a frequência de lembretes para pacientes com múltiplos medicamentos pode melhorar a adesão.",
    difficulty: "medium",
    impact: "high",
  },
  {
    id: 2,
    title: "Reforçar alertas noturnos",
    description: "Criar alertas especiais para o período noturno, com sons mais altos ou luzes piscantes.",
    difficulty: "easy",
    impact: "high",
  },
  {
    id: 3,
    title: "Personalizar interface para idosos",
    description: "Desenvolver uma interface simplificada com botões maiores e instruções mais claras para idosos.",
    difficulty: "hard",
    impact: "medium",
  },
  {
    id: 4,
    title: "Priorizar alertas visuais",
    description: "Redesenhar o sistema de alertas para priorizar elementos visuais sobre sonoros.",
    difficulty: "medium",
    impact: "high",
  },
]

export function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Insights Automáticos</h1>
        <p className="text-muted-foreground">Análises e recomendações baseadas nos dados de adesão</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 novos esta semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insights de Alto Impacto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Prioridade para implementação</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendências Positivas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Métricas em melhoria</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendências Negativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Métricas em piora</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Principais Insights</CardTitle>
          <CardDescription>Padrões e tendências identificados nos dados de adesão</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Insight</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Impacto</TableHead>
                <TableHead>Tendência</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insightsData.map((insight) => (
                <TableRow key={insight.id}>
                  <TableCell>
                    <div className="font-medium">{insight.title}</div>
                    <div className="text-sm text-muted-foreground">{insight.description}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {insight.category === "medication" && "Medicamentos"}
                      {insight.category === "time" && "Horário"}
                      {insight.category === "age" && "Idade"}
                      {insight.category === "alert" && "Alertas"}
                      {insight.category === "region" && "Região"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {insight.impact === "high" && <Badge className="bg-red-500 hover:bg-red-600">Alto</Badge>}
                    {insight.impact === "medium" && <Badge className="bg-yellow-500 hover:bg-yellow-600">Médio</Badge>}
                    {insight.impact === "low" && <Badge className="bg-green-500 hover:bg-green-600">Baixo</Badge>}
                  </TableCell>
                  <TableCell>
                    {insight.trend === "increasing" && (
                      <div className="flex items-center gap-1 text-red-500">
                        <TrendingUp className="h-4 w-4" />
                        <span>Piorando</span>
                      </div>
                    )}
                    {insight.trend === "stable" && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Estável</span>
                      </div>
                    )}
                    {insight.trend === "improving" && (
                      <div className="flex items-center gap-1 text-green-500">
                        <TrendingDown className="h-4 w-4" />
                        <span>Melhorando</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recomendações</CardTitle>
          <CardDescription>Sugestões baseadas nos insights para melhorar a adesão</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendationsData.map((recommendation) => (
              <Card key={recommendation.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{recommendation.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        Dificuldade: {recommendation.difficulty === "easy" && "Fácil"}
                        {recommendation.difficulty === "medium" && "Média"}
                        {recommendation.difficulty === "hard" && "Difícil"}
                      </Badge>
                      {recommendation.impact === "high" && (
                        <Badge className="bg-green-500 hover:bg-green-600">Alto Impacto</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{recommendation.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
