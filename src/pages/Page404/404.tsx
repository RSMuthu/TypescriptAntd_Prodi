import { HomeOutlined } from '@ant-design/icons';
import { Button } from 'antd';

function Page() {
  return (
    <div id="pageNotFound" style={{ textAlign: 'center' }}>
      <div className="home-base">
        <div className="txt-disp">
          <h1>404</h1>
        </div>
        <h2>Oops!! Page not found!</h2>
        <p>the page you are looking for, is currently unavailable</p>
        <Button icon={<HomeOutlined />} type="primary" shape="round" href="/">
          {' '}
          Back To Homepage{' '}
        </Button>
      </div>
    </div>
  );
}
export default Page;
