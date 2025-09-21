import { Navigate, createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'

import AuthenticatedRoutes from './components/Auth/AuthenticatedRoutes'
import UnauthenticatedRoutes from './components/Auth/UnauthenticatedRoutes'
import AccessDenied from './pages/auth/AccessDenied'
import ChangPassword from './pages/auth/ChangPassword'
import ForgotPassword from './pages/auth/ForgotPassword'
import RegisterSuccess from './pages/auth/RegisterSuccess'
import SignIn from './pages/auth/SignIn'
import SignInSSO from './pages/auth/SignInSSO'
import SignInwithGoogle from './pages/auth/SignInwithGoogle'
import TenantSignUp from './pages/auth/TenantSignUp'
import TokenCall from './pages/auth/TokenCall'
import NewPage from './pages/SourceAndCollection/Sources/NewPage'
import SourceRuleChats from './pages/SourceAndCollection/Sources/SourceRuleChats'

const Homepage = lazy(() => import('./pages/datavault/Homepage'))
const CompanyProfile = lazy(() => import('./pages/company-profile/CompanyProfile'))
const AddRepository = lazy(() => import('./pages/datavault/AddRepository'))
const ChatScreen = lazy(() => import('./pages/datavault/ChatScreen'))
const ChatView = lazy(() => import('./pages/datavault/ChatView'))
const CrownJewel = lazy(() => import('./pages/datavault/CrownJewel'))
const DataSource = lazy(() => import('./pages/datavault/DataSource'))
const DataVaultModel = lazy(() => import('./pages/datavault/DataVaultModel'))
const DataVaultPage = lazy(() => import('./pages/datavault/DataVaultPage'))
const DataVaultsPage = lazy(() => import('./pages/datavault/DataVaultsPage'))
const DataIngestion = lazy(() => import('./pages/datavault/Dataingestion'))
const FeedyIntegration = lazy(() => import('./pages/datavault/FeedyIntegration'))
const FieldConnection = lazy(() => import('./pages/datavault/FieldConnection'))
const InsightCard = lazy(() => import('./pages/datavault/InsightCard'))
const Repository = lazy(() => import('./pages/datavault/Repository'))
const SelectCtiRepo = lazy(() => import('./pages/datavault/SelectCtiRepo'))
const UserRole = lazy(() => import('./pages/datavault/UserRole'))
const VaultPermission = lazy(() => import('./pages/datavault/Vaultpermission'))
const ChatOnePage = lazy(() => import('./pages/history/ChatOne'))
const ChatTwoPage = lazy(() => import('./pages/history/ChatTwo'))
const Crmmarketing = lazy(() => import('./pages/history/Crmmarketing'))
const HistoryPage = lazy(() => import('./pages/history/HistoryPage'))
const SelectSource = lazy(() => import('./pages/history/SelectSource'))
const ConnectorsDetails = lazy(() => import('./pages/integrations/ConnectorDetails'))
const ConnectorDocuments = lazy(() => import('./pages/integrations/ConnectorDocuments'))
const ConnectorsPage = lazy(() => import('./pages/integrations/ConnectorsPage'))
const IntegrationsPage = lazy(() => import('./pages/integrations/IntegrationsPage'))
const PoliciesPage = lazy(() => import('./pages/policies/PoliciesPage'))
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'))
const SupportPage = lazy(() => import('./pages/support/SupportPage'))
const CVE = lazy(() => import('./pages/threatBriefs/CVE'))
const ThreatActor = lazy(() => import('./pages/threatBriefs/ThreatActor'))
const WorkBench = lazy(() => import('./pages/Chats/WorkBench'))
const AddFeedly = lazy(() => import('./pages/addNewFiles/AddFeedly'))
const AddFiles = lazy(() => import('./pages/addNewFiles/AddFiles'))
const AddPdf = lazy(() => import('./pages/addNewFiles/AddPdf'))
const AddUrl = lazy(() => import('./pages/addNewFiles/AddUrl'))
const AdminConsle = lazy(() => import('./pages/admin/AdminConsole'))
const AuditPage = lazy(() => import('./pages/audit/AuditPage'))
const UserData = lazy(() => import('./components/Screens/UserData'))
const ErrorPage = lazy(() => import('./pages/errors/ErrrorPage'))
const BasedOnThreatActor = lazy(() => import('./pages/threatBriefs/BasedOnThreatActor'))
const RepositoryGlobalSearch = lazy(() => import('./pages/datavault/RepositoryGlobalSearch'))
const SigmaFileGlobalSearch = lazy(() => import('./pages/datavault/SigmaFileGlobalSearch'))
const Repositoryintropage = lazy(() => import('./pages/Repositorys/Repositoryintropage'))
const SigmaFilesView = lazy(() => import('./pages/SigmaFiles/SigmaFilesView'))
const SourcesHomepage = lazy(() => import('./pages/SourceAndCollection/Sources/SourcesHomepage'))
const InsightsPagesHomePages = lazy(
  () => import('./pages/SourceAndCollection/Sources/InsightsPagesHomePages'),
)
const CollectionsHome = lazy(() => import('./pages/SourceAndCollection/Collection/CollectionsHome'))
const CommenSigmarule = lazy(() => import('./pages/SourceAndCollection/Collection/CommenSigmarule'))
const SecurityRule = lazy(() => import('./pages/SourceAndCollection/Collection/SecurityRule'))
const RepoInsightsPages = lazy(
  () => import('./pages/SourceAndCollection/Sources/RepoInsightsPages'),
)
const SigmaRuleView = lazy(() => import('./pages/SigmaFiles/SigmaRuleView'))
const SigmaRuleChats = lazy(() => import('./pages/SigmaFiles/SigmaRuleChats'))
const RuleAgentChat = lazy(() => import('./pages/Chats/RuleAgentChat'))
const LandingPage = lazy(() => import('./pages/datavault/LandingPage'))
const ChatWorkBench = lazy(() => import('./pages/Chats/ChatWorkBench'))

const routes = createBrowserRouter([
  {
    path: '/',
    element:
      window.location.hostname.toLowerCase() == 'mvp.systemtwosecurity.com' ? (
        <UnauthenticatedRoutes>
          <SignInSSO />
        </UnauthenticatedRoutes>
      ) : (
        <UnauthenticatedRoutes>
          <SignIn />
        </UnauthenticatedRoutes>
      ),
  },
  {
    path: '/tokencall',
    element: (
      <UnauthenticatedRoutes>
        <TokenCall />
      </UnauthenticatedRoutes>
    ),
  },
  {
    path: '/accessdenied',
    element: <AccessDenied />,
  },
  {
    path: '/admin',
    element: <AdminConsle />,
  },
  {
    path: '/signin',
    element: (
      <UnauthenticatedRoutes>
        <SignIn />
      </UnauthenticatedRoutes>
    ),
  },
  {
    path: '/forgetPassword',
    element: (
      <UnauthenticatedRoutes>
        <ForgotPassword />
      </UnauthenticatedRoutes>
    ),
  },
  {
    path: '/signInSSo',
    element: (
      <UnauthenticatedRoutes>
        <SignInSSO />
      </UnauthenticatedRoutes>
    ),
  },
  {
    path: '/signInwithGoogle',
    element: (
      <UnauthenticatedRoutes>
        <SignInwithGoogle />
      </UnauthenticatedRoutes>
    ),
  },
  {
    path: '/signup',
    element: (
      <UnauthenticatedRoutes>
        <TenantSignUp />
      </UnauthenticatedRoutes>
    ),
  },
  {
    path: '/RegisterSuccess',
    element: (
      <UnauthenticatedRoutes>
        <RegisterSuccess />
      </UnauthenticatedRoutes>
    ),
  },
  {
    path: '/thankYoupage',
    element: (
      <UnauthenticatedRoutes>
        <RegisterSuccess />
      </UnauthenticatedRoutes>
    ),
  },
  {
    path: '/changePassword',
    element: (
      <UnauthenticatedRoutes>
        <ChangPassword />
      </UnauthenticatedRoutes>
    ),
  },
  {
    path: '/*',
    element: <Navigate to='/' replace />,
  },
  {
    path: '/app',
    element: <AuthenticatedRoutes />,
    children: [
      {
        path: 'overview',
        element: <Homepage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'integrations',
        element: <IntegrationsPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'feedyintegration',
        element: <FeedyIntegration />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'feedlyForm',
        element: <FieldConnection />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'splunkForm',
        element: <FieldConnection />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'history/newchat',
        element: <HistoryPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'history/newchat/:id',
        element: <HistoryPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'history/:id',
        element: <HistoryPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'policies',
        element: <PoliciesPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'audit',
        element: <AuditPage />,
        errorElement: <ErrorPage />,
      },
      // {
      //   path: "users",
      //   element: <UsersPage />,
      // },
      {
        path: 'users',
        element: <UserData />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'datavault',
        element: <DataVaultPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'datavaults',
        element: <DataVaultsPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'datavaults/:id',
        element: <DataVaultsPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'datavaultmodel',
        element: <DataVaultModel />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'userrole',
        element: <UserRole />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'Repository',
        element: <Repository />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'Repository/:id',
        element: <Repository />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'repositoryintropage',
        element: <Repositoryintropage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'repositorysearch',
        element: <RepositoryGlobalSearch />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'sigmafilesearch',
        element: <SigmaFileGlobalSearch />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'VaultPermission',
        element: <VaultPermission />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'VaultPermission/:id',
        element: <VaultPermission />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'Dataingestion',
        element: <DataIngestion />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'Dataingestion/:id',
        element: <DataIngestion />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'chatOne',
        element: <ChatOnePage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'chattwo',
        element: <ChatTwoPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'selectsource',
        element: <SelectSource />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'Crmmarketing',
        element: <Crmmarketing />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'support',
        element: <SupportPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'connectors',
        element: <ConnectorsPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'connectors/details/:id',
        element: <ConnectorsDetails />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'connectors/documents',
        element: <ConnectorDocuments />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'selectsource/:id',
        element: <SelectSource />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'selectsource/Crmmarketing/:id',
        element: <Crmmarketing />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'selectsource/:id/Crmmarketing/:id',
        element: <Crmmarketing />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'addRepository',
        element: <AddRepository />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'workbench/:id',
        element: <WorkBench />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'workbench',
        element: <WorkBench />,
        errorElement: <ErrorPage />,
      },

      {
        path: 'addRepository/:id',
        element: <AddRepository />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'addFiles/:id',
        element: <AddFiles />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'addFeedly/:id',
        element: <AddFeedly />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'addUrl/:id',
        element: <AddUrl />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'addPdf/:id',
        element: <AddPdf />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'insightCard/:id',
        element: <InsightCard />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'ChatView/:id',
        element: <ChatView />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'selectecti/:id',
        element: <SelectCtiRepo />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'chatscreen',
        element: <ChatScreen />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'threatactor/:id',
        element: <ThreatActor />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'cve',
        element: <CVE />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'companyprofile',
        element: <CompanyProfile />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'crownjewel',
        element: <CrownJewel />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'datasource',
        element: <DataSource />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'basedonthreatactor',
        element: <BasedOnThreatActor />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'sigmafilesview/:id',
        element: <SigmaFilesView />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'sourcespage',
        element: <SourcesHomepage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'insightspages/:id',
        element: <InsightsPagesHomePages />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'insightspages',
        element: <InsightsPagesHomePages />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'collections',
        element: <CollectionsHome />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'sigmaruleview/:id',
        element: <SigmaRuleView />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'sigmarulechats',
        element: <SigmaRuleChats />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'sigmarulechats/:id',
        element: <SigmaRuleChats />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'collectionsigmarule/:id',
        element: <CommenSigmarule />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'SecurityRule',
        element: <SecurityRule />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'repoinsightspages/:id',
        element: <RepoInsightsPages />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'landingpage',
        element: <LandingPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'ruleagentchat',
        element: <RuleAgentChat />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'ruleagentchat/:id',
        element: <RuleAgentChat />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'chatworkbench',
        element: <ChatWorkBench />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'chatworkbench/:id',
        element: <ChatWorkBench />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'newpage',
        element: <NewPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'sourcerulechats',
        element: <SourceRuleChats />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'sourcerulechats/:id',
        element: <SourceRuleChats />,
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to='/' replace />,
  },
])

export default routes
