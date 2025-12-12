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
import RepFeeItems from './pages/RepFeeItems';
import RepUnitsInvite from './pages/RepUnitsInvite';
import TenantMyUnit from './pages/TenantMyUnit';
import TenantMyBills from './pages/TenantMyBills';
import TenantMyPayments from './pages/TenantMyPayments';
import RepBillingMonthlyEdit from './pages/RepBillingMonthlyEdit';
import RepBillingUnitCharges from './pages/RepBillingUnitCharges';
import RepBillingSend from './pages/RepBillingSend';
import RepPaymentsManage from './pages/RepPaymentsManage';
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
    "RepFeeItems": RepFeeItems,
    "RepUnitsInvite": RepUnitsInvite,
    "TenantMyUnit": TenantMyUnit,
    "TenantMyBills": TenantMyBills,
    "TenantMyPayments": TenantMyPayments,
    "RepBillingMonthlyEdit": RepBillingMonthlyEdit,
    "RepBillingUnitCharges": RepBillingUnitCharges,
    "RepBillingSend": RepBillingSend,
    "RepPaymentsManage": RepPaymentsManage,
}

export const pagesConfig = {
    mainPage: "Onboarding",
    Pages: PAGES,
    Layout: __Layout,
};