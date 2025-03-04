import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import styles from './Authentication.module.css';

interface AuthenticationProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const Authentication: React.FC<AuthenticationProps> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 使用简单的密码验证，实际生产环境应使用更安全的方法
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 尝试使用预设的管理员账户登录
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com', // 在 Supabase 中预先创建的管理员邮箱
        password: password
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        // 在本地存储设置认证标记
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminSession', JSON.stringify(data.session));
        onSuccess();
      }
    } catch (error: any) {
      setError(error.message || 'Login failed, please check your password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.authModal}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Please enter the admin password"
              autoFocus
            />
          </div>
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              onClick={onCancel} 
              className={styles.cancelButton}
              disabled={loading}
            >
                Cancel
            </button>
            <button 
              type="submit" 
              className={styles.loginButton}
              disabled={loading || !password}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Authentication; 