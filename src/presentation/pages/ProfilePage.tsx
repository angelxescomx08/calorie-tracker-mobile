import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import type { ActivityLevel, Gender } from '@/domain/entities'
import { useAuth } from '@/presentation/context/AuthContext'
import { useProfile, useUpdateProfile } from '@/presentation/hooks/useProfile'

const schema = z.object({
  birth_date: z.string().min(1, 'Required'),
  gender: z.enum(['male', 'female']),
  height_cm: z.coerce.number().min(50, 'Invalid height').max(300),
  activity_level: z.enum([
    'sedentary',
    'lightly_active',
    'moderately_active',
    'very_active',
    'extra_active',
  ]),
})
type FormData = z.infer<typeof schema>

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary',
  lightly_active: 'Lightly Active',
  moderately_active: 'Moderately Active',
  very_active: 'Very Active',
  extra_active: 'Extra Active',
}

export function ProfilePage() {
  const { user, logout } = useAuth()
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { gender: 'male', activity_level: 'moderately_active' },
  })

  const gender = watch('gender')
  const activityLevel = watch('activity_level')

  useEffect(() => {
    if (profile) {
      reset({
        birth_date: profile.birth_date,
        gender: profile.gender,
        height_cm: profile.height_cm,
        activity_level: profile.activity_level,
      })
    }
  }, [profile, reset])

  const onSubmit = (data: FormData) => {
    updateProfile.mutate(data, {
      onSuccess: () => toast.success('Profile updated'),
      onError: () => toast.error('Failed to update profile'),
    })
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // ignore
    }
  }

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 bg-background/95 px-4 py-3 backdrop-blur">
        <h2 className="text-lg font-semibold">Profile</h2>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <Avatar className="size-14">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" asChild>
          <Link to="/goals">Manage Goal</Link>
        </Button>

        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-sm">Body Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <div>
                  <Label className="text-xs">Date of Birth</Label>
                  <Input type="date" className="mt-1" {...register('birth_date')} />
                  {errors.birth_date && <p className="text-xs text-destructive">{errors.birth_date.message}</p>}
                </div>

                <div>
                  <Label className="text-xs">Gender</Label>
                  <Select value={gender} onValueChange={(v) => setValue('gender', v as Gender)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Height (cm)</Label>
                  <Input type="number" step="0.5" className="mt-1" {...register('height_cm')} />
                  {errors.height_cm && <p className="text-xs text-destructive">{errors.height_cm.message}</p>}
                </div>

                <div>
                  <Label className="text-xs">Activity Level</Label>
                  <Select
                    value={activityLevel}
                    onValueChange={(v) => setValue('activity_level', v as ActivityLevel)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(ACTIVITY_LABELS) as [ActivityLevel, string][]).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Button variant="destructive" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  )
}
