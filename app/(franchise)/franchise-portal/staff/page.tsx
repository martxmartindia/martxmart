import { StaffManagement } from "@/components/franchise/staff-management"

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
        <p className="text-muted-foreground">Manage your franchise team members and their roles</p>
      </div>
      <StaffManagement />
    </div>
  )
}
