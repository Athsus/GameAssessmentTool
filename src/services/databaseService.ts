import { supabase } from '../supabaseClient';

// 通用的数据库服务接口
export interface DatabaseService {
  getRecommendationsByCode: (code: string) => Promise<any[]>;
  addRecommendation: (data: any) => Promise<any>;
  updateRecommendation: (id: string, data: any) => Promise<any>;
  deleteRecommendation: (id: string) => Promise<void>;
}

// 根据代码前缀确定表名
export const getTableNameByCode = (code: string): string => {
  if (code.startsWith('1.') || code.startsWith('3.') || code.startsWith('4.')) {
    return 'keyboard_recommendations';
  } else if (code.startsWith('2.')) {
    return 'physical_recommendations';
  } else if (code.startsWith('5.')) {
    return 'sensory_recommendation';
  } else if (code.startsWith('6.3')) {
    return 'severe_impairment_alter';
  } else if (code === 'AS-1') {
    return 'adaptive_switches';
  } else {
    // 默认返回键盘推荐表
    return 'keyboard_recommendations';
  }
};

// 创建通用的数据库服务
export const createDatabaseService = (tableName: string): DatabaseService => {
  return {
    getRecommendationsByCode: async (code: string) => {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('code', code);
        
      if (error) throw error;
      return data || [];
    },
    
    addRecommendation: async (data: any) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert([data])
        .select();
        
      if (error) throw error;
      return result?.[0];
    },
    
    updateRecommendation: async (id: string, data: any) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select();
        
      if (error) throw error;
      return result?.[0];
    },
    
    deleteRecommendation: async (id: string) => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    }
  };
};
