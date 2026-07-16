import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const customerUrl =
  import.meta.env.VITE_CUSTOMER_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000"
const employeeUrl =
  import.meta.env.VITE_EMPLOYEE_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8004"

export function EmployeeApiPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Customer Reception</CardTitle>
          <CardDescription>Existing endpoint used by the Customer workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row label="Method" value="POST" />
          <Row label="URL" value={`${customerUrl}/reception`} />
          <Row label="Body" value='{ "customer_id": string, "message": string }' />
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge variant="blue">intent</Badge>
            <Badge variant="blue">sentiment</Badge>
            <Badge variant="purple">confidence</Badge>
            <Badge variant="secondary">reply</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee Reception</CardTitle>
          <CardDescription>Existing endpoint used by the Employee workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row label="Method" value="POST" />
          <Row label="URL" value={`${employeeUrl}/reception`} />
          <Row label="Body" value='{ "employee_id": string, "message": string }' />
          <div className="flex flex-wrap gap-1.5 pt-1">
            <Badge variant="green">intent</Badge>
            <Badge variant="green">sentiment</Badge>
            <Badge variant="amber">priority</Badge>
            <Badge variant="outline">ticket_id</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Environment</CardTitle>
          <CardDescription>
            Configure API hosts in <code>.env</code> without renaming backend routes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-emerald-300">
{`VITE_CUSTOMER_API_URL=${customerUrl}
VITE_EMPLOYEE_API_URL=${employeeUrl}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
      <code className="text-slate-700">{value}</code>
    </div>
  )
}
