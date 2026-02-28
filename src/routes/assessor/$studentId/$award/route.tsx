import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
export const Route = createFileRoute('/assessor/$studentId/$award')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Outlet />
}
