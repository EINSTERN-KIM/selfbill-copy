import Onboarding from './pages/Onboarding';
import MyBuildings from './pages/MyBuildings';
import BuildingCreate from './pages/BuildingCreate';
import RepDashboard from './pages/RepDashboard';
import TenantDashboard from './pages/TenantDashboard';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Onboarding": Onboarding,
    "MyBuildings": MyBuildings,
    "BuildingCreate": BuildingCreate,
    "RepDashboard": RepDashboard,
    "TenantDashboard": TenantDashboard,
}

export const pagesConfig = {
    mainPage: "Onboarding",
    Pages: PAGES,
    Layout: __Layout,
};