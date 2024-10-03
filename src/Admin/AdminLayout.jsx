import { Outlet } from 'react-router-dom'
import Sidenav from './Sidenav'
import './Csss/AdminLayout.css' // Import the CSS file

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidenav className="sidenav" />
      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
