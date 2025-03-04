import React from 'react';
import styles from './ExportButton.module.css';

interface ExportButtonProps {
  title: string;
  contentId: string;
  filename?: string; // 可选，因为浏览器打印不需要预设文件名
  formType?: 'gefpt' | 'initial' | 'keyboard' | 'sensory' | 'physical';
}

const ExportButton: React.FC<ExportButtonProps> = ({
  title,
  contentId
}) => {
  const handleExport = () => {
    const contentElement = document.getElementById(contentId);
    
    if (!contentElement) {
      console.error(`Element with ID "${contentId}" not found`);
      alert('Could not find content to print. Please try again.');
      return;
    }

    // 创建打印样式
    const printStyle = document.createElement('style');
    printStyle.id = 'print-style';
    
    // 简化打印样式，避免使用 visibility
    printStyle.innerHTML = `
      @media print {
        body > *:not(#${contentId}) {
          display: none !important;
        }
        
        /* 显示目标内容 */
        #${contentId} {
          display: block !important;
          position: static;
          width: 100%;
          margin: 0;
          padding: 20px;
        }
        
        /* 隐藏不需要打印的元素 */
        button, 
        .no-print,
        .recommendationsSection,
        nav,
        footer {
          display: none !important;
        }
        
        /* 确保内容可见 */
        #${contentId} * {
          color: black !important;
          background: white !important;
        }
        
        /* 改善表格打印效果 */
        table {
          page-break-inside: avoid;
        }
        
        /* 避免标题被分页 */
        h1, h2, h3, h4, h5, h6 {
          page-break-after: avoid;
        }
      }
    `;
    
    document.head.appendChild(printStyle);
    
    // 调用打印
    window.print();
    
    // 清理打印样式
    document.head.removeChild(printStyle);
  };

  return (
    <button 
      className={styles.exportButton}
      onClick={handleExport}
    >
      Print {title}
    </button>
  );
};

export default ExportButton; 