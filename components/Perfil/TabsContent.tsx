import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TabInformationUser from './UserInfo';

interface TabContentProps {
  activeTab: string;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  return (
    <View style={styles.tabContentContainer}>
      {activeTab === 'info' && <TabInformationUser />}
      {activeTab === 'posts' && <Text>Contenido para Tab 2</Text>}
      {activeTab === 'friends' && <Text>Contenido para Tab 3</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContentContainer: {
    padding: 20,
  },
});

export default TabContent;