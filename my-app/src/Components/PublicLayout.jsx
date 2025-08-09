// components/PublicLayout.jsx
import Navbar from './navbar';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

export default PublicLayout;
