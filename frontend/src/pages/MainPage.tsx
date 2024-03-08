import React from "react";
import { Menu } from "antd";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AttractionsIcon from '@mui/icons-material/Attractions';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BadgeIcon from '@mui/icons-material/Badge';

// Helper function to generate menu items
function getItem(label: string, key: string, icon: React.ReactNode, children?: React.ReactNode[], type?: string) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

// Definition of menu items using the helper function
const items = [//this gets all the tabs for the menu bar
  getItem('Attractions', '1', <AttractionsIcon />),//this will take to a page that displays the rides
  getItem('Tickets', '2', <LocalActivityIcon />),//this will allow the user to buy tickets
  getItem('Events', '3', <EventOutlinedIcon />),//this will show what the upcoming schedule is
  getItem('Restaurants', '4', <RestaurantIcon />),//this is the list of the restauraunts and the cousine adn stuff
  getItem('Gift Shop', '5', <StorefrontIcon />),//this will take to gift shop (optional)
  getItem('Support', '6', <HelpCenterIcon />),//this is where you go to contact the park staff
  getItem('Employee Portal', '7', <BadgeIcon />),//this is where the employees can log on
  getItem('Admin', '8', <AdminPanelSettingsOutlinedIcon />)//this is admin control
];

// Dashboard component definition
const Dashboard = () => {

  return (
    <div style={{
      display: 'flex', 
      width: 256, 
      height: '100vh', 
      position: 'fixed', 
      left: 0,
      top: 0,
      overflow: 'auto'
      
    }}>
      <div style={{
        //width: collapsed ? '80px' : '256px',
        transition: 'width 0.2s'
      }}>
      </div>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        items={items}
        style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          fontSize: '15px'
       }}
      />
    </div>
  );
};

export default Dashboard;
