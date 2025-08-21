// kv_store.ts
import { createClient } from '@supabase/supabase-js';

// Use Node environment variables
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Set a key-value pair
export const set = async (key: string, value: any): Promise<void> => {
  const { error } = await supabase.from('kv_store_764b8bb4').upsert({
    key,
    value,
  });
  if (error) throw new Error(error.message);
};

// Get a key-value pair
export const get = async (key: string): Promise<any> => {
  const { data, error } = await supabase
    .from('kv_store_764b8bb4')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.value;
};

// Delete a key-value pair
export const del = async (key: string): Promise<void> => {
  const { error } = await supabase.from('kv_store_764b8bb4').delete().eq('key', key);
  if (error) throw new Error(error.message);
};

// Set multiple key-value pairs
export const mset = async (keys: string[], values: any[]): Promise<void> => {
  const { error } = await supabase.from('kv_store_764b8bb4').upsert(
    keys.map((k, i) => ({ key: k, value: values[i] }))
  );
  if (error) throw new Error(error.message);
};

// Get multiple key-value pairs
export const mget = async (keys: string[]): Promise<any[]> => {
  const { data, error } = await supabase
    .from('kv_store_764b8bb4')
    .select('value')
    .in('key', keys);
  if (error) throw new Error(error.message);
  return data?.map(d => d.value) ?? [];
};

// Delete multiple key-value pairs
export const mdel = async (keys: string[]): Promise<void> => {
  const { error } = await supabase.from('kv_store_764b8bb4').delete().in('key', keys);
  if (error) throw new Error(error.message);
};

// Get by prefix
export const getByPrefix = async (prefix: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('kv_store_764b8bb4')
    .select('key, value')
    .like('key', `${prefix}%`);
  if (error) throw new Error(error.message);
  return data?.map(d => d.value) ?? [];
};
