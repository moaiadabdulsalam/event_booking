import { Booking } from "@prisma/client";

export interface IAdminRepository {
  getState(): Promise<{
    totalBooking: number;
    totalRevenue: number;
    totalEvents: number;
    totalUsers: number;
  }>;


  getRecentBookings():Promise<any[]>;

  getRevenueAnalytics():Promise<any>;
}
