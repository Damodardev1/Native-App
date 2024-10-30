import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios';
import { WebView } from 'react-native-webview';

import API_BASE_URL from '../apiconfig';
import Header from '../components/Header';

const CompanyDashboard = () => {
  const route = useRoute();
  const { dbName, compName, companyData } = route.params;
  const [selectedDashboard, setSelectedDashboard] = useState('');
  const [graphInfo, setGraphInfo] = useState([]);	
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const chartTypes = [
    { type: 'line', title: 'Line Chart' },
    { type: 'area', title: 'Area Chart' },
    { type: 'bar', title: 'Bar Chart' },
    { type: 'column', title: 'Column Chart' },
    { type: 'pie', title: 'Pie Chart' },
    { type: 'spline', title: 'Spline Chart' },
    { type: 'polar', title: 'Polar Chart' },
    { type: 'scatter', title: 'Scatter Chart' },
    { type: 'gauge', title: 'Gauge Chart' },
    { type: 'solidgauge', title: 'Solid Gauge' },
    { type: 'funnel', title: 'Funnel Chart' },
    { type: 'waterfall', title: 'Waterfall Chart' },
    { type: 'treemap', title: 'Treemap' },
    { type: 'sankey', title: 'Sankey Chart' },
    { type: 'radar', title: 'Radar Chart' },
    { type: 'combo', title: 'Combo Chart' },
    { type: 'bubble', title: 'Bubble Chart' }, // New chart type
    { type: 'heatmap', title: 'Heatmap' }, // New chart type
    { type: 'boxplot', title: 'Boxplot' }, // New chart type
    { type: 'rangebar', title: 'Range Bar Chart' }, // New chart type
];

const generateChartConfig = (type, title) => `
<html>
<head>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script src="https://code.highcharts.com/highcharts-more.js"></script>
  <script src="https://code.highcharts.com/modules/solid-gauge.js"></script>
  <script src="https://code.highcharts.com/modules/funnel.js"></script>
  <script src="https://code.highcharts.com/modules/sankey.js"></script>
  <script src="https://code.highcharts.com/modules/treemap.js"></script>
  <script src="https://code.highcharts.com/modules/waterfall.js"></script>
  <script src="https://code.highcharts.com/modules/scatter.js"></script>
  <script src="https://code.highcharts.com/modules/gauge.js"></script>
  <script src="https://code.highcharts.com/modules/bubble.js"></script>
  <script src="https://code.highcharts.com/modules/heatmap.js"></script>
  <script src="https://code.highcharts.com/modules/boxplot.js"></script>
  <script src="https://code.highcharts.com/modules/rangebar.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      Highcharts.chart('container', {
        chart: {
          type: '${type}'
        },
        title: {
          text: '${title}'
        },
        series: [{
          data: [1, 2, 3, 4, 5] // Please verify this data
        }]
      });
    });
  </script>
</head>
<body>
  <div id="container" style="width:100%; height:100%;"></div>
</body>
</html>
`;

  const loadDesktopCharts = async (graphId) => {
    if (!graphId) return;

    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('Token not available');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/${dbName}/load-desktop-graphs`,
        {
          dashboard_id: graphId,
          mode: 'load',
          width: 414,
          _token: token,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Load Desktop Graphs Response:', response.data);
    } catch (error) {
      console.error('Error loading desktop charts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get Dashboard Graph API Call
  const getDashboardGraphData = async (graphId) => {
    if (!graphId) return;

    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      console.error('Token not available');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/${dbName}/get-dashboard-graph-data`,
        {
          graph_id: 11,
          graph_type: 'datatable',
          is_dummy: false,
          _token: token,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data.data;
      setColumns(data[0]);
      setRows(data[1]);
      setGraphInfo(data);
      console.log('Dashboard Graph Data:', data);
    } catch (error) {
      console.error('Error getting dashboard graph data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDashboard) {
      loadDesktopCharts(selectedDashboard);
      getDashboardGraphData(selectedDashboard);
    }
  }, [selectedDashboard]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
                <Header />
            </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.text}>Database Name: {dbName}</Text>
          <Text style={styles.text}>Company Name: {compName}</Text>

          {/* Dashboard Picker */}
          <View style={styles.dropdownContainer}>
            <Text style={styles.text}>Select a Dashboard:</Text>
            <Picker
              selectedValue={selectedDashboard}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedDashboard(itemValue)}
            >
              {companyData.user_graphdashboards?.map((dashboard) => (
                <Picker.Item 
                  key={dashboard.id} 
                  label={dashboard.dashboard_name} 
                  value={dashboard.id} 
                />
              ))}
            </Picker>
          </View>

          {/* Loading Indicator */}
          <ScrollView style={{ flex: 1 }}>
      {chartTypes.map((chart, index) => (
        <View key={index} style={{ height: 400, marginBottom: 20 }}>
          <WebView
            originWhitelist={['*']}
            source={{ html: generateChartConfig(chart.type, chart.title) }}
            style={{ flex: 1 }}
          />
        </View>
      ))}
    </ScrollView>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>

              {/* Data Table */}
              {columns.length > 0 && rows.length > 0 ? (
                <ScrollView horizontal>
                  <DataTable>
                    <DataTable.Header>
                      {columns.map((column, index) => (
                        <DataTable.Title key={index}>{column}</DataTable.Title>
                      ))}
                    </DataTable.Header>

                    {rows.map((row, rowIndex) => (
                      <DataTable.Row key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <DataTable.Cell key={cellIndex}>{cell}</DataTable.Cell>
                        ))}
                      </DataTable.Row>
                    ))}
                  </DataTable>
                </ScrollView>
              ) : (
                <Text style={styles.text}>No data available</Text>
              )}
            </>
          )}

          {/* Buttons */}
      
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: { position: 'absolute', backgroundColor: '#fff', height: '100%', zIndex: 2, top: 0, left: 0 },
  scrollContainer: {
    padding: 20,
    paddingTop: 10,
  },
  content: { 
    backgroundColor: '#fff', 
    borderRadius: 8 
  },
  text: { 
    fontSize: 18, 
    textAlign: 'center', 
    color: '#333', 
    marginVertical: 5 
  },
  dropdownContainer: { 
    marginTop: 20, 
    marginBottom: 20 
  },
  picker: { 
    height: 50, 
    width: '100%' 
  },
  chartTitle: { 
    fontSize: 16, 
    marginTop: 20, 
    marginBottom: 10, 
    textAlign: 'center' 
  },
  chartStyle: { 
    marginVertical: 8, 
    borderRadius: 16 
  },
  buttonContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    marginTop: 20 
  },
  button: { 
    backgroundColor: '#2196f3', 
    padding: 10, 
    borderRadius: 5, 
    flexBasis: '48%', // Two buttons per row
    marginVertical: 5 
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center' 
  },
});

export default CompanyDashboard;