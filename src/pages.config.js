/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import BuildingSetupWizard from './pages/BuildingSetupWizard';
import Home from './pages/Home';
import MyBuildings from './pages/MyBuildings';
import Onboarding from './pages/Onboarding';
import Privacy from './pages/Privacy';
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
import TenantAdditionalInfo from './pages/TenantAdditionalInfo';
import TenantDashboard from './pages/TenantDashboard';
import TenantInviteCheck from './pages/TenantInviteCheck';
import TenantMyBills from './pages/TenantMyBills';
import TenantMyPayments from './pages/TenantMyPayments';
import TenantMyUnit from './pages/TenantMyUnit';
import Terms from './pages/Terms';
import RepSettings from './pages/RepSettings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "BuildingSetupWizard": BuildingSetupWizard,
    "Home": Home,
    "MyBuildings": MyBuildings,
    "Onboarding": Onboarding,
    "Privacy": Privacy,
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
    "TenantAdditionalInfo": TenantAdditionalInfo,
    "TenantDashboard": TenantDashboard,
    "TenantInviteCheck": TenantInviteCheck,
    "TenantMyBills": TenantMyBills,
    "TenantMyPayments": TenantMyPayments,
    "TenantMyUnit": TenantMyUnit,
    "Terms": Terms,
    "RepSettings": RepSettings,
}

export const pagesConfig = {
    mainPage: "Onboarding",
    Pages: PAGES,
    Layout: __Layout,
};