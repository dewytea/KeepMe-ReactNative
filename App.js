import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  const handleEmergencyPress = () => {
    Alert.alert(
      '🚨 비상 신호',
      '비상 연락을 발송하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '확인', onPress: () => Alert.alert('✅ 발송 완료!') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛡️ KeepMe</Text>
      <Text style={styles.subtitle}>나를 지켜주는 비상 연락 앱</Text>
      
      <TouchableOpacity 
        style={styles.emergencyButton}
        onPress={handleEmergencyPress}
      >
        <Text style={styles.buttonText}>📞 비상 연락하기</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>✅ React Native 성공!</Text>
        <Text style={styles.infoText}>🚀 PWA → 진짜 앱으로!</Text>
      </View>
      
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 50,
    textAlign: 'center',
  },
  emergencyButton: {
    backgroundColor: '#ff6b9d',
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  infoBox: {
    marginTop: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 15,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 5,
  },
});
