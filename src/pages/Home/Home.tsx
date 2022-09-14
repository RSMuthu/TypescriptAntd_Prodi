import { FilterOutlined, TagsOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="home-base">
        <h2 style={{ fontSize: '45px', color: '#ababab' }}>
          Welcome To Call Log Insights
        </h2>
        <h2 className="home-animate" style={{ fontWeight: 600 }}>
          select your desire ...
        </h2>
        <Link to="/call/filter">
          <Button
            style={{ margin: '10px' }}
            size="large"
            icon={<FilterOutlined />}
            type="default"
            shape="round"
          >
            {' '}
            Call Filter{' '}
          </Button>
        </Link>
        <Link to="/call/label">
          <Button
            style={{ margin: '10px' }}
            size="large"
            icon={<TagsOutlined />}
            type="default"
            shape="round"
          >
            {' '}
            Call Label{' '}
          </Button>
        </Link>
      </div>
    </div>
  );
}
export default Home;
