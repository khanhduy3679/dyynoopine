import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ScrollToTop from './ScrollToTop';

/**
 * AdminLayout — Layout chung cho khu vực quản trị /admin/*
 *
 * Bọc Sidebar + Header (từ Figma) bên ngoài, phần nội dung trang
 * được render thông qua <Outlet /> của react-router-dom.
 */

const sectionTitles = {
  '/admin/dashboard': 'Tổng quan',
  '/admin/booking': 'Đặt lịch mới',
  '/admin/appointments': 'Quản lý lịch hẹn',
  '/admin/customers': 'Khách hàng',
  '/admin/staff': 'Nhân viên',
  '/admin/services': 'Dịch vụ',
  '/admin/payments': 'Thanh toán',
  '/admin/notifications': 'Thông báo',
  '/admin/reviews': 'Đánh giá',
  '/admin/account': 'Tài khoản',
  '/admin/reports': 'Báo cáo doanh thu',
};

export default function AdminLayout() {
  const location = useLocation();
  const title = sectionTitles[location.pathname] || 'Trang quản trị';

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Header title={title} />
        <main className="main-body">
          <Outlet />
        </main>
        <ScrollToTop />
      </div>
    </div>
  );
}
