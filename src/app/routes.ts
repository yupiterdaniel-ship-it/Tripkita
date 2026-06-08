import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { PackageList } from './components/PackageList';
import { PackageDetail } from './components/PackageDetail';
import { BookingForm } from './components/BookingForm';
import { CMSDashboard } from './components/cms/CMSDashboard';
import { CMSPackages } from './components/cms/CMSPackages';
import { CMSBookings } from './components/cms/CMSBookings';
import { CMSCustomers } from './components/cms/CMSCustomers';
import { NotFound } from './components/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'packages', Component: PackageList },
      { path: 'packages/:id', Component: PackageDetail },
      { path: 'booking/:id', Component: BookingForm },
      { path: 'cms', Component: CMSDashboard },
      { path: 'cms/packages', Component: CMSPackages },
      { path: 'cms/bookings', Component: CMSBookings },
      { path: 'cms/customers', Component: CMSCustomers },
      { path: '*', Component: NotFound },
    ],
  },
]);
