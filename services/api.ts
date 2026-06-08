import { ModelInput } from '../types';

// TODO: Connect real Flask RF model trained on 500+ biosorption articles
// URL: process.env.EXPO_PUBLIC_API_URL
export async function callRealModel(_input: ModelInput): Promise<never> {
  throw new Error('Real model not implemented yet');
}
