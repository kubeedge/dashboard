import KeepAliveTabs from '@/components/KeepAliveTabs';
import defaultSettings from '../../config/defaultSettings';

const { tabsLayout } = defaultSettings;

const TabsLayout: React.FC = (props) => {
  const renderTabs = () => {
    if(tabsLayout)
      return <KeepAliveTabs />;
    else
      return null;
  }
  return (
    <div>
      {renderTabs()}
      <div>{props.children}</div>
    </div>
  );
};

export default TabsLayout;
