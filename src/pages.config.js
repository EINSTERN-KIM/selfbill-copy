import BuildingSetupWizard from './pages/BuildingSetupWizard';
import Home from './pages/Home';
import MyBuildings from './pages/MyBuildings';
import Onboarding from './pages/Onboarding';
import RepBankAccount from './pages/RepBankAccount';
import RepBillingMonthlyEdit from './pages/RepBillingMonthlyEdit';
import RepBillingSend from './pages/RepBillingSend';
import RepBillingSettings from './pages/RepBillingSettings';
import RepBillingUnitCharges from './pages/RepBillingUnitCharges';
import RepBuildingSetup from './pages/RepBuildingSetup';
import RepDashboard from './pages/RepDashboard';
import RepFeeItems from './pages/RepFeeItems';
import RepPaymentsManage from './pages/RepPaymentsManage';
import RepPlan from './pages/RepPlan';
import RepReportsTotalFee from './pages/RepReportsTotalFee';
import RepReportsUnitFee from './pages/RepReportsUnitFee';
import RepReportsUnitPayments from './pages/RepReportsUnitPayments';
import RepRoleChange from './pages/RepRoleChange';
import RepUnits from './pages/RepUnits';
import RepUnitsInvite from './pages/RepUnitsInvite';
import RepUnitsReview from './pages/RepUnitsReview';
import TenantDashboard from './pages/TenantDashboard';
import TenantMyBills from './pages/TenantMyBills';
import TenantMyPayments from './pages/TenantMyPayments';
import TenantMyUnit from './pages/TenantMyUnit';
import __Layout from './Layout.jsx';


export const PAGES = {
    "BuildingSetupWizard": BuildingSetupWizard,
    "Home": Home,
    "MyBuildings": MyBuildings,
    "Onboarding": Onboarding,
    "RepBankAccount": RepBankAccount,
    "RepBillingMonthlyEdit": RepBillingMonthlyEdit,
    "RepBillingSend": RepBillingSend,
    "RepBillingSettings": RepBillingSettings,
    "RepBillingUnitCharges": RepBillingUnitCharges,
    "RepBuildingSetup": RepBuildingSetup,
    "RepDashboard": RepDashboard,
    "RepFeeItems": RepFeeItems,
    "RepPaymentsManage": RepPaymentsManage,
    "RepPlan": RepPlan,
    "RepReportsTotalFee": RepReportsTotalFee,
    "RepReportsUnitFee": RepReportsUnitFee,
    "RepReportsUnitPayments": RepReportsUnitPayments,
    "RepRoleChange": RepRoleChange,
    "RepUnits": RepUnits,
    "RepUnitsInvite": RepUnitsInvite,
    "RepUnitsReview": RepUnitsReview,
    "TenantDashboard": TenantDashboard,
    "TenantMyBills": TenantMyBills,
    "TenantMyPayments": TenantMyPayments,
    "TenantMyUnit": TenantMyUnit,
}

export const pagesConfig = {
    mainPage: "Onboarding",
    Pages: PAGES,
    Layout: __Layout,
};