import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';

const { Content } = Layout;

const UserLayout = () => {

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Layout>
                <Navbar />

                {/* CONTENT */}
                <Content>
                    <div className='user-layout'>
                        <Outlet></Outlet>
                    </div>
                </Content>

                {/* FOOTER */}
                <Footer />
            </Layout>
        </div>

    )
}
export default UserLayout