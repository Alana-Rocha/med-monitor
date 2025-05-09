"use client"

import { useState, useRef, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FilterControls, type FilterValues } from "@/components/filter-controls"
import { Download, FileText, Printer, Info } from "lucide-react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const allReportData = [
  {
    id: 1,
    paciente: "Maria Silva",
    idade: 65,
    medicamentos: 3,
    tiposMedicamentos: ["Cardíacos", "Pressão", "Diabetes"],
    adesao: 85,
    adesaoAnterior: 78,
    alertasIgnorados: 5,
    ultimaAtualizacao: "2023-05-01",
    regiao: "Sudeste",
    genero: "Feminino",
    tempoUso: 6, // meses
    horarioEsquecimento: ["Noite"],
    observacoes: "Paciente com melhora significativa na adesão após ajuste de horários",
  },
  {
    id: 2,
    paciente: "João Santos",
    idade: 72,
    medicamentos: 5,
    tiposMedicamentos: ["Cardíacos", "Pressão", "Colesterol", "Tireoide", "Dor"],
    adesao: 68,
    adesaoAnterior: 62,
    alertasIgnorados: 12,
    ultimaAtualizacao: "2023-05-03",
    regiao: "Sul",
    genero: "Masculino",
    tempoUso: 4, // meses
    horarioEsquecimento: ["Manhã", "Noite"],
    observacoes: "Paciente com dificuldade de adesão em múltiplos medicamentos",
  },
  {
    id: 3,
    paciente: "Ana Oliveira",
    idade: 58,
    medicamentos: 2,
    tiposMedicamentos: ["Pressão", "Ansiedade"],
    adesao: 92,
    adesaoAnterior: 90,
    alertasIgnorados: 2,
    ultimaAtualizacao: "2023-05-02",
    regiao: "Nordeste",
    genero: "Feminino",
    tempoUso: 8, // meses
    horarioEsquecimento: ["Tarde"],
    observacoes: "Excelente adesão, usa lembretes adicionais",
  },
  {
    id: 4,
    paciente: "Carlos Pereira",
    idade: 67,
    medicamentos: 4,
    tiposMedicamentos: ["Cardíacos", "Pressão", "Diabetes", "Colesterol"],
    adesao: 65,
    adesaoAnterior: 55,
    alertasIgnorados: 15,
    ultimaAtualizacao: "2023-05-04",
    regiao: "Centro-Oeste",
    genero: "Masculino",
    tempoUso: 3, // meses
    horarioEsquecimento: ["Manhã", "Tarde", "Noite"],
    observacoes: "Necessita de acompanhamento mais próximo, muitos esquecimentos",
  },
  {
    id: 5,
    paciente: "Lúcia Ferreira",
    idade: 70,
    medicamentos: 3,
    tiposMedicamentos: ["Pressão", "Colesterol", "Osteoporose"],
    adesao: 88,
    adesaoAnterior: 80,
    alertasIgnorados: 4,
    ultimaAtualizacao: "2023-05-01",
    regiao: "Sudeste",
    genero: "Feminino",
    tempoUso: 7, // meses
    horarioEsquecimento: ["Noite"],
    observacoes: "Boa evolução na adesão após ajuste de dosagem",
  },
  {
    id: 6,
    paciente: "Roberto Almeida",
    idade: 62,
    medicamentos: 2,
    tiposMedicamentos: ["Pressão", "Dor"],
    adesao: 79,
    adesaoAnterior: 75,
    alertasIgnorados: 7,
    ultimaAtualizacao: "2023-05-03",
    regiao: "Norte",
    genero: "Masculino",
    tempoUso: 5, // meses
    horarioEsquecimento: ["Tarde"],
    observacoes: "Adesão melhorando gradualmente",
  },
  {
    id: 7,
    paciente: "Fernanda Costa",
    idade: 55,
    medicamentos: 1,
    tiposMedicamentos: ["Tireoide"],
    adesao: 95,
    adesaoAnterior: 92,
    alertasIgnorados: 1,
    ultimaAtualizacao: "2023-05-02",
    regiao: "Sudeste",
    genero: "Feminino",
    tempoUso: 10, // meses
    horarioEsquecimento: [],
    observacoes: "Excelente adesão, quase sem esquecimentos",
  },
  {
    id: 8,
    paciente: "Paulo Ribeiro",
    idade: 75,
    medicamentos: 6,
    tiposMedicamentos: ["Cardíacos", "Pressão", "Diabetes", "Colesterol", "Próstata", "Dor"],
    adesao: 60,
    adesaoAnterior: 50,
    alertasIgnorados: 18,
    ultimaAtualizacao: "2023-05-04",
    regiao: "Sul",
    genero: "Masculino",
    tempoUso: 2, // meses
    horarioEsquecimento: ["Manhã", "Tarde", "Noite"],
    observacoes: "Muita dificuldade com múltiplos medicamentos, necessita assistência",
  },
]

const passesFilter = (item: any, filters: FilterValues): boolean => {
  if (filters.user !== "all") {
    const userMapping = {
      user1: item.id % 2 === 0,
      user2: item.id % 2 !== 0,
      user3: item.id > 6,
    }
    if (!userMapping[filters.user as keyof typeof userMapping]) {
      return false
    }
  }

  if (filters.medicationType !== "all") {
    const medicationTypeMapping = {
      cardiac: item.tiposMedicamentos.includes("Cardíacos"),
      diabetes: item.tiposMedicamentos.includes("Diabetes"),
      pressure: item.tiposMedicamentos.includes("Pressão"),
      other:
        !item.tiposMedicamentos.includes("Cardíacos") &&
        !item.tiposMedicamentos.includes("Diabetes") &&
        !item.tiposMedicamentos.includes("Pressão"),
    }
    if (!medicationTypeMapping[filters.medicationType as keyof typeof medicationTypeMapping]) {
      return false
    }
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

  if (item.idade < filters.ageRange[0] || item.idade > filters.ageRange[1]) {
    return false
  }

  if (filters.timeOfDay.length > 0) {
    const timeMapping = {
      morning: item.horarioEsquecimento.includes("Manhã"),
      afternoon: item.horarioEsquecimento.includes("Tarde"),
      night: item.horarioEsquecimento.includes("Noite"),
    }

    const hasMatchingTime = filters.timeOfDay.some((time) => timeMapping[time as keyof typeof timeMapping])

    if (!hasMatchingTime && item.horarioEsquecimento.length > 0) {
      return false
    }
  }

  return true
}

export function ReportsPage() {
  const [reportType, setReportType] = useState("adherence")
  const tableRef = useRef<HTMLDivElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const [filters, setFilters] = useState<FilterValues>({
    user: "all",
    medicationType: "all",
    adherenceRate: "all",
    ageRange: [0, 100],
    timeOfDay: [],
  })

  const filteredReportData = useMemo(() => {
    return allReportData.filter((item) => passesFilter(item, filters))
  }, [filters])

  const statistics = useMemo(() => {
    if (filteredReportData.length === 0) {
      return {
        adesaoMedia: 0,
        alertasTotal: 0,
        medicamentosMedia: 0,
        idadeMedia: 0,
        melhoriaMedia: 0,
        pacientesAltoRisco: 0,
        distribuicaoGenero: { Masculino: 0, Feminino: 0 },
        distribuicaoRegiao: { Norte: 0, Nordeste: 0, "Centro-Oeste": 0, Sudeste: 0, Sul: 0 },
      }
    }

    const adesaoMedia = filteredReportData.reduce((acc, item) => acc + item.adesao, 0) / filteredReportData.length

    const alertasTotal = filteredReportData.reduce((acc, item) => acc + item.alertasIgnorados, 0)

    const medicamentosMedia =
      filteredReportData.reduce((acc, item) => acc + item.medicamentos, 0) / filteredReportData.length

    const idadeMedia = filteredReportData.reduce((acc, item) => acc + item.idade, 0) / filteredReportData.length

    const melhoriaMedia =
      filteredReportData.reduce((acc, item) => acc + (item.adesao - item.adesaoAnterior), 0) / filteredReportData.length

    const pacientesAltoRisco = filteredReportData.filter((item) => item.adesao < 70 && item.medicamentos > 3).length

    const distribuicaoGenero = filteredReportData.reduce((acc: Record<string, number>, item) => {
      acc[item.genero] = (acc[item.genero] || 0) + 1
      return acc
    }, {})

    const distribuicaoRegiao = filteredReportData.reduce((acc: Record<string, number>, item) => {
      acc[item.regiao] = (acc[item.regiao] || 0) + 1
      return acc
    }, {})

    return {
      adesaoMedia,
      alertasTotal,
      medicamentosMedia,
      idadeMedia,
      melhoriaMedia,
      pacientesAltoRisco,
      distribuicaoGenero,
      distribuicaoRegiao,
    }
  }, [filteredReportData])

  const exportToCSV = () => {
    return alert('Não foi possível processar sua solicitação! Tente novamente mais tarde!');

    let csvContent =
      "ID,Paciente,Idade,Gênero,Região,Medicamentos,Tipos de Medicamentos,Taxa de Adesão (%),Taxa Anterior (%),Melhoria (%),Alertas Ignorados,Tempo de Uso (meses),Horários de Esquecimento,Observações,Última Atualização\n"

    filteredReportData.forEach((row) => {
      csvContent += `${row.id},`
      csvContent += `"${row.paciente}",`
      csvContent += `${row.idade},`
      csvContent += `"${row.genero}",`
      csvContent += `"${row.regiao}",`
      csvContent += `${row.medicamentos},`
      csvContent += `"${row.tiposMedicamentos.join("; ")}",`
      csvContent += `${row.adesao},`
      csvContent += `${row.adesaoAnterior},`
      csvContent += `${(row.adesao - row.adesaoAnterior).toFixed(1)},`
      csvContent += `${row.alertasIgnorados},`
      csvContent += `${row.tempoUso},`
      csvContent += `"${row.horarioEsquecimento.join("; ")}",`
      csvContent += `"${row.observacoes}",`
      csvContent += `${row.ultimaAtualizacao}\n`
    })

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `relatorio_adesao_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = async (type = "table") => {
    return alert('Não foi possível processar sua solicitação! Tente novamente mais tarde!');
    
    const contentRef = type === "table" ? tableRef : summaryRef

    if (!contentRef.current) return

    try {
      const doc = new jsPDF("p", "mm", "a4")
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      doc.setFillColor(52, 152, 219) 
      doc.rect(0, 0, pageWidth, 20, "F")
      doc.setTextColor(255, 255, 255) 
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text("MedMonitor - Sistema de Monitoramento de Adesão", pageWidth / 2, 10, { align: "center" })

      doc.setTextColor(0, 0, 0) 
      doc.setFontSize(14)
      const title =
        type === "table" ? "Relatório Detalhado de Adesão a Medicamentos" : "Resumo de Adesão a Medicamentos"
      doc.text(title, pageWidth / 2, 30, { align: "center" })

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.text(`Data de geração: ${new Date().toLocaleDateString("pt-BR")}`, 15, 40)
      doc.text(
        `Período: ${reportType === "adherence" ? "Taxa de Adesão" : reportType === "alerts" ? "Alertas Ignorados" : "Relatório Completo"}`,
        15,
        45,
      )
      doc.text(`Total de pacientes: ${filteredReportData.length}`, 15, 50)

      if (
        filters.user !== "all" ||
        filters.medicationType !== "all" ||
        filters.adherenceRate !== "all" ||
        filters.ageRange[0] > 0 ||
        filters.ageRange[1] < 100 ||
        filters.timeOfDay.length > 0
      ) {
        doc.text("Filtros aplicados:", 15, 55)
        let filterText = ""
        if (filters.user !== "all") filterText += `Usuário: ${filters.user}, `
        if (filters.medicationType !== "all") filterText += `Tipo de Medicamento: ${filters.medicationType}, `
        if (filters.adherenceRate !== "all") filterText += `Taxa de Adesão: ${filters.adherenceRate}, `
        filterText += `Faixa Etária: ${filters.ageRange[0]}-${filters.ageRange[1]}, `
        if (filters.timeOfDay.length > 0) filterText += `Horários: ${filters.timeOfDay.join(", ")}`

        const splitText = doc.splitTextToSize(filterText, pageWidth - 30)
        doc.text(splitText, 15, 60)
      }

      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })
      const imgData = canvas.toDataURL("image/png")

      const imgWidth = pageWidth - 30
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let yPosition = 70
      if (
        filters.user !== "all" ||
        filters.medicationType !== "all" ||
        filters.adherenceRate !== "all" ||
        filters.ageRange[0] > 0 ||
        filters.ageRange[1] < 100 ||
        filters.timeOfDay.length > 0
      ) {
        yPosition = 70
      }

      doc.addImage(imgData, "PNG", 15, yPosition, imgWidth, imgHeight)

      const footerPosition = pageHeight - 10
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100) 
      doc.text("MedMonitor © 2025 - Todos os direitos reservados", pageWidth / 2, footerPosition, { align: "center" })
      doc.text(`Página 1 de 1`, pageWidth - 20, footerPosition)

      const fileName =
        type === "table"
          ? `relatorio_adesao_${new Date().toISOString().split("T")[0]}.pdf`
          : `resumo_adesao_${new Date().toISOString().split("T")[0]}.pdf`
      doc.save(fileName)
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      alert("Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.")
    }
  }

  const printReport = () => {
    window.print()
  }

  const getAdesaoColor = (adesao: number) => {
    if (adesao >= 80) return "bg-green-100 dark:bg-green-900"
    if (adesao >= 50) return "bg-yellow-100 dark:bg-yellow-900"
    return "bg-red-100 dark:bg-red-900"
  }

  const getAdesaoTextColor = (adesao: number) => {
    if (adesao >= 80) return "text-green-800 dark:text-green-200"
    if (adesao >= 50) return "text-yellow-800 dark:text-yellow-200"
    return "text-red-800 dark:text-red-200"
  }

  const getTendenciaBadge = (atual: number, anterior: number) => {
    const diff = atual - anterior
    if (diff > 5) return <Badge className="bg-green-500">↑ Melhorando</Badge>
    if (diff < -5) return <Badge className="bg-red-500">↓ Piorando</Badge>
    return <Badge className="bg-yellow-500">→ Estável</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">Exporte e analise dados de adesão a medicamentos</p>
        </div>
        <div className="flex items-center gap-2">
        </div>
      </div>

      <FilterControls onFilterChange={setFilters} />

      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Tabela</TabsTrigger>
          <TabsTrigger value="summary">Resumo</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Dados de Adesão a Medicamentos</CardTitle>
                <CardDescription>
                  {reportType === "adherence" && "Relatório de taxa de adesão por paciente"}
                  {reportType === "alerts" && "Relatório de alertas ignorados por paciente"}
                  {reportType === "complete" && "Relatório completo com todos os dados"}
                </CardDescription>
              </div>
              <div className="flex gap-2 print:hidden">
                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={exportToCSV}>
                  <Download className="h-4 w-4" />
                  <span>CSV</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => exportToPDF("table")}
                >
                  <FileText className="h-4 w-4" />
                  <span>PDF</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={printReport}>
                  <Printer className="h-4 w-4" />
                  <span>Imprimir</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div ref={tableRef}>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Paciente</TableHead>
                        <TableHead>Idade</TableHead>
                        <TableHead>Região</TableHead>
                        <TableHead>Medicamentos</TableHead>
                        <TableHead className="text-center">Taxa de Adesão</TableHead>
                        <TableHead className="text-center">Tendência</TableHead>
                        <TableHead className="text-right">Alertas Ignorados</TableHead>
                        <TableHead className="text-right">Detalhes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReportData.length > 0 ? (
                        filteredReportData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className="font-medium">{row.paciente}</TableCell>
                            <TableCell>{row.idade}</TableCell>
                            <TableCell>{row.regiao}</TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-help underline decoration-dotted">{row.medicamentos}</span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{row.tiposMedicamentos.join(", ")}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`px-2 py-1 rounded-md ${getAdesaoColor(row.adesao)} ${getAdesaoTextColor(row.adesao)}`}
                              >
                                {row.adesao}%
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              {getTendenciaBadge(row.adesao, row.adesaoAnterior)}
                            </TableCell>
                            <TableCell className="text-right">{row.alertasIgnorados}</TableCell>
                            <TableCell className="text-right">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="w-80">
                                    <div className="space-y-2">
                                      <p>
                                        <strong>Gênero:</strong> {row.genero}
                                      </p>
                                      <p>
                                        <strong>Tempo de uso:</strong> {row.tempoUso} meses
                                      </p>
                                      <p>
                                        <strong>Horários de esquecimento:</strong>{" "}
                                        {row.horarioEsquecimento.length > 0
                                          ? row.horarioEsquecimento.join(", ")
                                          : "Nenhum"}
                                      </p>
                                      <p>
                                        <strong>Observações:</strong> {row.observacoes}
                                      </p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            Nenhum dado encontrado com os filtros selecionados.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                {filteredReportData.length > 0 && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    Mostrando {filteredReportData.length} de {allReportData.length} pacientes
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="summary" className="space-y-4">
          <div ref={summaryRef}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Adesão Média</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.adesaoMedia.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {statistics.melhoriaMedia > 0
                      ? `+${statistics.melhoriaMedia.toFixed(1)}% de melhoria`
                      : `${statistics.melhoriaMedia.toFixed(1)}% de variação`}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alertas Ignorados (Total)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.alertasTotal}</div>
                  <p className="text-xs text-muted-foreground">
                    Média de {(statistics.alertasTotal / filteredReportData.length || 0).toFixed(1)} por paciente
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Média de Medicamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.medicamentosMedia.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">
                    {statistics.pacientesAltoRisco} pacientes com alto risco
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Idade Média</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.idadeMedia.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">Faixa predominante: 60-75 anos</p>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Resumo do Relatório</CardTitle>
                <CardDescription>Principais métricas e KPIs para análise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-medium">Distribuição por Gênero</h3>
                    <div className="rounded-md border p-4">
                      {Object.entries(statistics.distribuicaoGenero).map(([genero, quantidade]) => (
                        <div key={genero} className="flex justify-between items-center mb-2">
                          <span>{genero}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                              <div
                                className="bg-primary h-2.5 rounded-full"
                                style={{ width: `${(quantidade / filteredReportData.length) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">
                              {quantidade} ({((quantidade / filteredReportData.length) * 100).toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Distribuição por Região</h3>
                    <div className="rounded-md border p-4">
                      {Object.entries(statistics.distribuicaoRegiao).map(([regiao, quantidade]) => (
                        <div key={regiao} className="flex justify-between items-center mb-2">
                          <span>{regiao}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                              <div
                                className="bg-primary h-2.5 rounded-full"
                                style={{ width: `${(quantidade / filteredReportData.length) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">
                              {quantidade} ({((quantidade / filteredReportData.length) * 100).toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Observações:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Pacientes com mais de 3 medicamentos têm taxa de adesão média de{" "}
                      {(
                        filteredReportData.filter((p) => p.medicamentos > 3).reduce((acc, p) => acc + p.adesao, 0) /
                        (filteredReportData.filter((p) => p.medicamentos > 3).length || 1)
                      ).toFixed(1)}
                      %
                    </li>
                    <li>
                      Pacientes com menos de 3 medicamentos têm taxa de adesão média de{" "}
                      {(
                        filteredReportData.filter((p) => p.medicamentos < 3).reduce((acc, p) => acc + p.adesao, 0) /
                        (filteredReportData.filter((p) => p.medicamentos < 3).length || 1)
                      ).toFixed(1)}
                      %
                    </li>
                    <li>A faixa etária acima de 70 anos apresenta maior número de alertas ignorados</li>
                    <li>
                      Horário com maior taxa de esquecimento: {(() => {
                        const horarios = filteredReportData.flatMap((p) => p.horarioEsquecimento)
                        const counts = horarios.reduce((acc: Record<string, number>, horario) => {
                          acc[horario] = (acc[horario] || 0) + 1
                          return acc
                        }, {})
                        const maxHorario = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
                        return maxHorario
                          ? `${maxHorario[0]} (${Math.round((maxHorario[1] / horarios.length) * 100)}% dos casos)`
                          : "N/A"
                      })()}
                    </li>
                  </ul>
                </div>
                <div className="pt-4 print:hidden">
                  <Button className="flex items-center gap-2" onClick={() => exportToPDF("summary")}>
                    <FileText className="h-4 w-4" />
                    <span>Exportar Relatório Completo</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
