import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = '@museum_user_id';

export async function getOrCreateUserId(): Promise<string> {
  try {
    let userId = await AsyncStorage.getItem(USER_ID_KEY);

    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem(USER_ID_KEY, userId);
    }

    return userId;
  } catch (error) {
    console.error('Error managing user ID:', error);
    return `temp_${Date.now()}`;
  }
}
