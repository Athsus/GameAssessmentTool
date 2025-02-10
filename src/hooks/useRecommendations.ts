import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useCart, CartItem } from '../contexts/CartContext';

export interface RecommendationProduct {
  id: string;
  code: string;
  category: string;
  subcategory: string;
  product: string;
  price_range: string;
  website: string;
  image_url: string | null;
}

interface UseRecommendationsProps {
  tableName: string;  // 数据库表名
  getCode?: (checkboxId: string) => string; // 添加可选的代码映射函数
}

export const useRecommendations = ({ 
  tableName,
  getCode = getRecommendationCode // 使用默认的 getRecommendationCode 作为后备
}: UseRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<RecommendationProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<RecommendationProduct | null>(null);
  const { addItem } = useCart();

  // 获取推荐产品
  const fetchRecommendations = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('code', code);

      if (error) throw error;
      if (data) {
        setRecommendations(prev => [...prev, ...data]);
      }
    } catch (error) {
      console.error(`Error fetching recommendations from ${tableName}:`, error);
    }
  };

  // 移除推荐产品
  const removeRecommendations = (code: string) => {
    setRecommendations(prev => prev.filter(rec => rec.code !== code));
  };

  // 处理复选框变化
  const handleCheckboxChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;
    if (checked) {
      const code = getCode(id);  // 使用传入的 getCode 函数
      if (code) {
        await fetchRecommendations(code);
      }
    } else {
      const code = getCode(id);  // 使用传入的 getCode 函数
      removeRecommendations(code);
    }
  };

  // 处理产品点击
  const handleProductClick = (product: RecommendationProduct) => {
    setSelectedProduct(product);
  };

  // 处理添加到购物车
  const handleAddToCart = (product: RecommendationProduct) => {
    const cartItem: CartItem = {
      id: product.id,
      code: product.code,
      product: product.product,
      description: product.subcategory,
      website: product.website,
      image_url: product.image_url
    };
    addItem(cartItem);
  };

  // 关闭产品详情
  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  return {
    recommendations,
    selectedProduct,
    handleCheckboxChange,
    handleProductClick,
    handleAddToCart,
    handleCloseDetail
  };
};

// 获取推荐代码的辅助函数 - 可以根据需要在具体组件中覆盖
export const getRecommendationCode = (checkboxId: string): string => {
  const codeMap: { [key: string]: string } = {
    // 默认的代码映射
    'default': '1.0'
  };
  return codeMap[checkboxId] || '';
}; 