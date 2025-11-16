import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Alert, 
  TextInput, 
  ScrollView 
} from 'react-native';
import { useState } from 'react';

export default function App() {
  // 상태 관리
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // 전화번호 포맷팅 함수 (010-1234-5678)
  const formatPhoneNumber = (number) => {
    // 숫자만 추출
    const cleaned = number.replace(/\D/g, '');
    
    // 11자리 숫자를 010-1234-5678 형식으로
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    }
    // 10자리 숫자를 010-123-4567 형식으로
    else if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
    // 그 외는 그대로 반환
    return cleaned;
  };

  // 전화번호 입력 핸들러 (숫자만 입력)
  const handlePhoneInput = (text) => {
    // 숫자만 추출
    const numbersOnly = text.replace(/\D/g, '');
    // 최대 11자리까지만
    const limited = numbersOnly.slice(0, 11);
    setPhone(limited);
  };

  // 연락처 추가
  const handleAddContact = () => {
    if (!name || !phone) {
      Alert.alert('⚠️ 입력 오류', '이름과 전화번호를 모두 입력해주세요.');
      return;
    }

    // 전화번호 길이 체크 (10-11자리)
    if (phone.length < 10 || phone.length > 11) {
      Alert.alert('⚠️ 입력 오류', '올바른 전화번호를 입력해주세요.\n(10-11자리 숫자)');
      return;
    }

    const newContact = {
      id: Date.now().toString(),
      name: name,
      phone: formatPhoneNumber(phone), // 포맷팅해서 저장
    };

    setContacts([...contacts, newContact]);
    setName('');
    setPhone('');
    setShowAddForm(false);
    Alert.alert('✅ 추가 완료', `${name}님이 연락처에 추가되었습니다.`);
  };

  // 연락처 삭제
  const handleDeleteContact = (id, contactName) => {
    Alert.alert(
      '🗑️ 연락처 삭제',
      `${contactName}님을 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: () => {
            setContacts(contacts.filter(c => c.id !== id));
            Alert.alert('✅ 삭제 완료');
          }
        }
      ]
    );
  };

  // 비상 연락
  const handleEmergency = () => {
    if (contacts.length === 0) {
      Alert.alert('⚠️ 연락처 없음', '먼저 비상 연락처를 추가해주세요.');
      return;
    }

    const contactList = contacts.map(c => `${c.name}: ${c.phone}`).join('\n');
    Alert.alert(
      '🚨 비상 신호 발송',
      `다음 연락처로 비상 신호를 보냅니다:\n\n${contactList}`,
      [
        { text: '취소', style: 'cancel' },
        { text: '발송', onPress: () => Alert.alert('✅ 발송 완료!') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>🛡️ KeepMe</Text>
        <Text style={styles.subtitle}>비상 연락 앱</Text>
      </View>

      {/* 메인 컨텐츠 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* 비상 버튼 */}
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={handleEmergency}
        >
          <Text style={styles.emergencyButtonText}>🚨 비상 연락하기</Text>
        </TouchableOpacity>

        {/* 연락처 추가 버튼 */}
        {!showAddForm && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={styles.addButtonText}>➕ 연락처 추가</Text>
          </TouchableOpacity>
        )}

        {/* 연락처 추가 폼 */}
        {showAddForm && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>새 연락처 추가</Text>
            
            <TextInput
              style={styles.input}
              placeholder="이름"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="전화번호"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={handlePhoneInput}
              keyboardType="numeric"
              maxLength={11}
            />
            
            {/* 전화번호 입력 안내 */}
            <Text style={styles.helpText}>
              💡 전화번호만 연속으로 입력해주세요 (예: 01012345678)
            </Text>
            
            {/* 전화번호 미리보기 */}
            {phone.length >= 10 && (
              <View style={styles.preview}>
                <Text style={styles.previewLabel}>저장될 번호:</Text>
                <Text style={styles.previewNumber}>{formatPhoneNumber(phone)}</Text>
              </View>
            )}

            <View style={styles.formButtons}>
              <TouchableOpacity 
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddForm(false);
                  setName('');
                  setPhone('');
                }}
              >
                <Text style={styles.formButtonText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.formButton, styles.saveButton]}
                onPress={handleAddContact}
              >
                <Text style={styles.formButtonText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 연락처 목록 */}
        <View style={styles.contactList}>
          <Text style={styles.listTitle}>
            비상 연락처 ({contacts.length}명)
          </Text>
          
          {contacts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                📱 아직 등록된 연락처가 없습니다
              </Text>
              <Text style={styles.emptySubText}>
                비상 시 연락할 사람을 추가해주세요!
              </Text>
            </View>
          ) : (
            contacts.map((contact) => (
              <View key={contact.id} style={styles.contactCard}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteContact(contact.id, contact.name)}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  emergencyButton: {
    backgroundColor: '#ff6b9d',
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  emergencyButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#667eea',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addForm: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  helpText: {
    fontSize: 12,
    color: '#667eea',
    marginBottom: 10,
    marginTop: -5,
    paddingHorizontal: 5,
  },
  preview: {
    backgroundColor: '#e8f4ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  previewLabel: {
    fontSize: 12,
    color: '#667eea',
    marginBottom: 3,
  },
  previewNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  saveButton: {
    backgroundColor: '#667eea',
  },
  formButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactList: {
    marginBottom: 30,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 24,
  },
});
