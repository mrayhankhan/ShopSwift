import { users } from '@/lib/data';
import CustomerDashboardClient from './customer-dashboard-client';

export async function generateStaticParams() {
  return users.map((user) => ({
    customerId: user.id,
  }));
}

export default async function CustomerDashboard({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params;
  return <CustomerDashboardClient />;
}
