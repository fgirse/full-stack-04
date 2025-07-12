"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw } from "lucide-react"

interface DatabaseBrowserProps {
  model: string
}

export function DatabaseBrowser({ model }: DatabaseBrowserProps) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/database/browse/${model}?page=${page}&limit=${limit}&search=${searchTerm}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [model, page, limit])

  const handleSearch = () => {
    setPage(1)
    fetchData()
  }

  if (!data.length && !loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{model} Browser</CardTitle>
          <CardDescription>No data found for this model</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const columns = data.length > 0 ? Object.keys(data[0]) : []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {model} Browser
          <Button onClick={fetchData} size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Select value={limit.toString()} onValueChange={(value) => setLimit(Number.parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      {typeof row[column] === "object" ? JSON.stringify(row[column]) : String(row[column] || "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <Button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1 || loading} size="sm">
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page}</span>
          <Button onClick={() => setPage(page + 1)} disabled={data.length < limit || loading} size="sm">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
