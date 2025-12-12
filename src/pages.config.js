import Onboarding from './pages/Onboarding';
import MyBuildings from './pages/MyBuildings';
import BuildingCreate from './pages/BuildingCreate';
import RepDashboard from './pages/RepDashboard';
import TenantDashboard from './pages/TenantDashboard';
import RepBuildingSetup from './pages/RepBuildingSetup';
import RepBillingSettings from './pages/RepBillingSettings';
import RepBankAccount from './pages/RepBankAccount';
import RepUnits from './pages/RepUnits';
import RepPlan from './pages/RepPlan';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Onboarding": Onboarding,
    "MyBuildings": MyBuildings,
    "BuildingCreate": BuildingCreate,
    "RepDashboard": RepDashboard,
    "TenantDashboard": TenantDashboard,
    "RepBuildingSetup": RepBuildingSetup,
    "RepBillingSettings": RepBillingSettings,
    "RepBankAccount": RepBankAccount,
    "RepUnits": RepUnits,
    "RepPlan": RepPlan,
}

export const pagesConfig = {
    mainPage: "Onboarding",
    Pages: PAGES,
    Layout: __Layout,
};