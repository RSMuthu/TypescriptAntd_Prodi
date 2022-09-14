import { Suspense, lazy } from 'react';

import { HomeOutlined, FilterOutlined, TagsOutlined } from '@ant-design/icons';
import { Layout, Menu, Skeleton } from 'antd';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import '@static/css/App.css';
import '@static/css/home.css';

const Page404 = lazy(() => import('@pages/Page404'));
const Home = lazy(() => import('@pages/Home'));
const CallFilter = lazy(() => import('@pages/CallFilter'));
const CallLabel = lazy(() => import('@pages/CallLabel'));

const { Header } = Layout;

function App() {
  return (
    <Layout className="layout">
      <Router>
        <Header className="nav">
          <div style={{ color: '#1890ff' }} className="logo">
            MYFirm
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={[
              {
                label: <Link to="/">Home</Link>,
                title: 'Home',
                key: 'home',
                icon: <HomeOutlined />,
              },
              {
                label: <Link to="/call/filter">Call Filter</Link>,
                title: 'Call Filter',
                key: 'filter',
                icon: <FilterOutlined />,
              },
              {
                label: <Link to="/call/label">Call Label</Link>,
                title: 'Call Label',
                key: 'label',
                icon: <TagsOutlined />,
              },
            ]}
          />
        </Header>
        <Suspense fallback={<Skeleton active />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/call/filter" element={<CallFilter />} />
            <Route path="/call/label" element={<CallLabel />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Suspense>
      </Router>
    </Layout>
  );
}

export default App;
