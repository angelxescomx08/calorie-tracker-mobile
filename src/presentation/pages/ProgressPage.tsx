import { zodResolver } from '@hookform/resolvers/zod'
import { format, parseISO } from 'date-fns'
import { Trash2, Weight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useCreateMeasurement,
  useDeleteMeasurement,
  useMeasurements,
} from '@/presentation/hooks/useMeasurements'
import {
  useCreateWeightLog,
  useDeleteWeightLog,
  useWeightLogs,
} from '@/presentation/hooks/useWeightLogs'

// ── Weight ────────────────────────────────────────────────────────────────────
const weightSchema = z.object({
  logged_date: z.string().min(1),
  weight_kg: z.coerce.number().positive('Must be positive'),
  notes: z.string().optional(),
})
type WeightForm = z.infer<typeof weightSchema>

function WeightTab() {
  const { data, isLoading } = useWeightLogs({ limit: 60 })
  const createWeight = useCreateWeightLog()
  const deleteWeight = useDeleteWeightLog()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<WeightForm>({
    resolver: zodResolver(weightSchema),
    defaultValues: { logged_date: format(new Date(), 'yyyy-MM-dd') },
  })

  const onSubmit = (values: WeightForm) => {
    createWeight.mutate(values, {
      onSuccess: () => { toast.success('Weight logged'); reset({ logged_date: format(new Date(), 'yyyy-MM-dd') }) },
      onError: () => toast.error('Failed to log weight'),
    })
  }

  const chartData = [...(data?.items ?? [])]
    .sort((a, b) => a.logged_date.localeCompare(b.logged_date))
    .map((w) => ({ date: w.logged_date, kg: w.weight_kg }))

  return (
    <div className="flex flex-col gap-4 p-4">
      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : chartData.length > 1 ? (
        <Card>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => format(parseISO(d), 'MMM d')}
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  width={36}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  formatter={(v) => typeof v === 'number' ? [`${v.toFixed(1)} kg`, 'Weight'] : ['', '']}
                  labelFormatter={(l) => format(parseISO(String(l)), 'MMM d, yyyy')}
                />
                <Line
                  type="monotone"
                  dataKey="kg"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-sm">Log Weight</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Date</Label>
                <Input type="date" className="mt-1" {...register('logged_date')} />
              </div>
              <div>
                <Label className="text-xs">Weight (kg)</Label>
                <Input type="number" step="0.1" placeholder="0.0" className="mt-1" {...register('weight_kg')} />
                {errors.weight_kg && <p className="text-xs text-destructive">{errors.weight_kg.message}</p>}
              </div>
            </div>
            <Button type="submit" size="sm" disabled={createWeight.isPending}>
              {createWeight.isPending ? 'Saving...' : 'Save'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <ScrollArea className="h-64">
          <div className="flex flex-col gap-0">
            {[...(data?.items ?? [])]
              .sort((a, b) => b.logged_date.localeCompare(a.logged_date))
              .map((w) => (
                <div key={w.id} className="flex items-center justify-between border-b py-2 last:border-0">
                  <div>
                    <span className="text-sm font-medium">{w.weight_kg} kg</span>
                    {w.notes && <p className="text-xs text-muted-foreground">{w.notes}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(w.logged_date), 'MMM d, yyyy')}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteWeight.mutate(w.id, { onError: () => toast.error('Failed') })}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            {!isLoading && !data?.items.length && (
              <div className="flex flex-col items-center py-8 text-center">
                <Weight className="mb-2 size-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No weight entries yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

// ── Measurements ──────────────────────────────────────────────────────────────
const measureSchema = z.object({
  measured_date: z.string().min(1),
  neck_cm: z.coerce.number().positive().optional().or(z.literal('')),
  waist_cm: z.coerce.number().positive().optional().or(z.literal('')),
  hip_cm: z.coerce.number().positive().optional().or(z.literal('')),
  notes: z.string().optional(),
})
type MeasureForm = z.infer<typeof measureSchema>

function MeasurementsTab() {
  const { data, isLoading } = useMeasurements()
  const createM = useCreateMeasurement()
  const deleteM = useDeleteMeasurement()

  const { register, handleSubmit, reset } = useForm<MeasureForm>({
    defaultValues: { measured_date: format(new Date(), 'yyyy-MM-dd') },
  })

  const onSubmit = (values: MeasureForm) => {
    createM.mutate(
      {
        measured_date: values.measured_date,
        neck_cm: values.neck_cm ? Number(values.neck_cm) : null,
        waist_cm: values.waist_cm ? Number(values.waist_cm) : null,
        hip_cm: values.hip_cm ? Number(values.hip_cm) : null,
        notes: values.notes || null,
      },
      {
        onSuccess: () => { toast.success('Measurements saved'); reset({ measured_date: format(new Date(), 'yyyy-MM-dd') }) },
        onError: () => toast.error('Failed to save'),
      },
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Card>
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-sm">Add Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <div>
              <Label className="text-xs">Date</Label>
              <Input type="date" className="mt-1" {...register('measured_date')} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'neck_cm', label: 'Neck (cm)' },
                { key: 'waist_cm', label: 'Waist (cm)' },
                { key: 'hip_cm', label: 'Hip (cm)' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <Label className="text-xs">{label}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    className="mt-1"
                    {...register(key as keyof MeasureForm)}
                  />
                </div>
              ))}
            </div>
            <Button type="submit" size="sm" disabled={createM.isPending}>
              {createM.isPending ? 'Saving...' : 'Save'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="flex flex-col gap-2">
          {[...(data?.items ?? [])]
            .sort((a, b) => b.measured_date.localeCompare(a.measured_date))
            .map((m) => (
              <Card key={m.id}>
                <CardContent className="py-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        {format(parseISO(m.measured_date), 'MMM d, yyyy')}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {m.neck_cm && <span className="text-xs">Neck: <b>{m.neck_cm}</b> cm</span>}
                        {m.waist_cm && <span className="text-xs">Waist: <b>{m.waist_cm}</b> cm</span>}
                        {m.hip_cm && <span className="text-xs">Hip: <b>{m.hip_cm}</b> cm</span>}
                        {m.body_fat_percentage && (
                          <span className="text-xs">Body fat: <b>{m.body_fat_percentage.toFixed(1)}</b>%</span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteM.mutate(m.id, { onError: () => toast.error('Failed') })}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          {!isLoading && !data?.items.length && (
            <p className="py-8 text-center text-sm text-muted-foreground">No measurements yet</p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function ProgressPage() {
  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 bg-background/95 px-4 py-3 backdrop-blur">
        <h2 className="text-lg font-semibold">Progress</h2>
      </div>
      <Tabs defaultValue="weight" className="flex-1">
        <TabsList className="mx-4 w-[calc(100%-2rem)]">
          <TabsTrigger value="weight" className="flex-1">Weight</TabsTrigger>
          <TabsTrigger value="measurements" className="flex-1">Measurements</TabsTrigger>
        </TabsList>
        <TabsContent value="weight"><WeightTab /></TabsContent>
        <TabsContent value="measurements"><MeasurementsTab /></TabsContent>
      </Tabs>
    </div>
  )
}
