import { FormConfig } from '../components/ProductForm';

// Keyboard recommendation form configuration
export const keyboardRecommendationConfig: FormConfig = {
  tableName: 'keyboard_recommendations',
  title: 'Add Keyboard Recommendation',
  fields: [
    {
      name: 'code',
      label: 'Code',
      type: 'text',
      required: true,
      placeholder: 'e.g., 1.1',
      readOnly: true
    },
    {
      name: 'category',
      label: 'Category',
      type: 'text',
      required: true,
      placeholder: 'e.g., ergonomic, split, one_hand',
      readOnly: true
    },
    {
      name: 'subcategory',
      label: 'Subcategory',
      type: 'text',
      required: true,
      placeholder: 'Specific type within category',
      readOnly: true
    },
    {
      name: 'product',
      label: 'Product Name',
      type: 'text',
      required: true,
      placeholder: 'Product name'
    },
    {
      name: 'price_range',
      label: 'Price Range',
      type: 'text',
      placeholder: 'e.g., $50-$100'
    },
    {
      name: 'website',
      label: 'Website',
      type: 'text',
      placeholder: 'Product website URL'
    },
    {
      name: 'image_url',
      label: 'Image URL',
      type: 'text',
      placeholder: 'Product image URL'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Product description'
    }
  ],
  getPresetValues: (code: string) => {
    const presets: Record<string, Record<string, string>> = {
      '1.1': {
        category: 'rom',
        subcategory: 'ergonomic_keyboard'
      },
      '1.2': {
        category: 'rom',
        subcategory: 'split_keyboard'
      },
      '1.3': {
        category: 'rom',
        subcategory: 'gaming_keyboard'
      },
      '1.4': {
        category: 'rom',
        subcategory: 'compact_keyboard'
      },
      '1.5': {
        category: 'rom',
        subcategory: 'ergonomic_mouse'
      },
      '1.6': {
        category: 'rom',
        subcategory: 'gaming_mouse'
      },
      '2.1': {
        category: 'Dexterity',
        subcategory: 'alternative_input'
      },
      '2.2': {
        category: 'Dexterity',
        subcategory: 'key_guard'
      },
      '2.3': {
        category: 'Dexterity',
        subcategory: 'trackball_mouse'
      },
      '3.1': {
        category: 'Strength',
        subcategory: 'low_force_keyboard'
      },
      '3.2': {
        category: 'Strength',
        subcategory: 'low_force_mouse'
      },
      '4.1': {
        category: 'Vision',
        subcategory: 'large_key_keyboard'
      },
      '4.2': {
        category: 'Vision',
        subcategory: 'braille_keyboard'
      },
      '5.1': {
        category: 'Severe',
        subcategory: 'head_mouth_stick'
      },
      '5.2': {
        category: 'Severe',
        subcategory: 'wearable_keyboard'
      },
      '5.3': {
        category: 'Severe',
        subcategory: 'head_mouse'
      }
    };
    
    return presets[code] || {};
  }
};

// Physical limitation form configuration
export const physicalRecommendationConfig: FormConfig = {
  tableName: 'physical_recommendations',
  title: 'Add Physical Limitation Recommendation',
  fields: [
    {
      name: 'code',
      label: 'Code',
      type: 'text',
      required: true,
      placeholder: 'e.g., 2.1',
      readOnly: true
    },
    {
      name: 'category',
      label: 'Category',
      type: 'text',
      required: true,
      placeholder: 'e.g., alternative_input, key_guard',
      readOnly: true
    },
    {
      name: 'subcategory',
      label: 'Subcategory',
      type: 'text',
      required: true,
      placeholder: 'Specific type within category',
      readOnly: true
    },
    {
      name: 'product',
      label: 'Product Name',
      type: 'text',
      required: true,
      placeholder: 'Product name'
    },
    {
      name: 'price_range',
      label: 'Price Range',
      type: 'text',
      placeholder: 'e.g., $50-$100'
    },
    {
      name: 'website',
      label: 'Website',
      type: 'text',
      placeholder: 'Product website URL'
    },
    {
      name: 'image_url',
      label: 'Image URL',
      type: 'text',
      placeholder: 'Product image URL'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Product description'
    }
  ],
  getPresetValues: (code: string) => {
    const presets: Record<string, Record<string, string>> = {
      '1.1.1': {
        category: 'rom',
        subcategory: 'thumbstick_extenders'
      },
      '1.2.1': {
        category: 'rom',
        subcategory: 'adjustable_trigger'
      },
      '1.2.2': {
        category: 'rom',
        subcategory: 'flight_joystick'
      },
      '1.2.3': {
        category: 'rom',
        subcategory: 'gyroscopic_controllers'
      },
      '1.2.4': {
        category: 'rom',
        subcategory: 'paddle_attachments'
      },
      '1.2.5': {
        category: 'rom',
        subcategory: 'customizable_joysticks'
      },
      '1.3.1': {
        category: 'rom',
        subcategory: 'controller_mounts'
      },
      '2.1.1': {
        category: 'Strength',
        subcategory: 'adjustable_tension_thumbsticks'
      },
      '2.1.2': {
        category: 'Strength',
        subcategory: 'low_force_buttons'
      }
    };
    
    return presets[code] || {};
  }
};

// Sensory assessment form configuration
export const sensoryRecommendationConfig: FormConfig = {
  tableName: 'sensory_recommendation',
  title: 'Add Sensory Recommendation',
  fields: [
    {
      name: 'code',
      label: 'Code',
      type: 'text',
      required: true,
      placeholder: 'e.g., 1.1.1',
      readOnly: true
    },
    {
      name: 'category',
      label: 'Category',
      type: 'text',
      required: true,
      placeholder: 'e.g., visual, auditory',
      readOnly: true
    },
    {
      name: 'subcategory',
      label: 'Subcategory',
      type: 'text',
      required: true,
      placeholder: 'Specific type within category',
      readOnly: true
    },
    {
      name: 'product',
      label: 'Product Name',
      type: 'text',
      required: true,
      placeholder: 'Product name'
    },
    {
      name: 'price_range',
      label: 'Price Range',
      type: 'text',
      placeholder: 'e.g., $50-$100'
    },
    {
      name: 'website',
      label: 'Website',
      type: 'text',
      placeholder: 'Product website URL'
    },
    {
      name: 'image_url',
      label: 'Image URL',
      type: 'text',
      placeholder: 'Product image URL'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Product description'
    }
  ],
  getPresetValues: (code: string) => {
    const presets: Record<string, Record<string, string>> = {
      '1.1.1': {
        category: 'Visual',
        subcategory: 'text'
      },
      '1.1.2': {
        category: 'Visual',
        subcategory: 'color'
      },
      '1.1.3': {
        category: 'Visual',
        subcategory: 'magnifier'
      },
      '1.1.4': {
        category: 'Visual',
        subcategory: 'night_mode'
      },
      '1.1.5': {
        category: 'Visual',
        subcategory: 'narrator'
      },
      '1.1.6': {
        category: 'Visual',
        subcategory: 'copilot'
      },
      '1.1.7': {
        category: 'Visual',
        subcategory: 'haptic_feedback'
      },
      '1.1.8': {
        category: 'Visual',
        subcategory: 'audio_driven'
      },
      '1.1.9': {
        category: 'Visual',
        subcategory: 'text_to_speech'
      },
      '1.2.1': {
        category: 'Visual',
        subcategory: 'color_blind_modes'
      },
      '1.2.2': {
        category: 'Visual',
        subcategory: 'high_contrast'
      },
      '2.1': {
        category: 'Audio',
        subcategory: 'hearing_accessibility'
      },
      '2.2': {
        category: 'Audio',
        subcategory: 'visual_indicators'
      },
      '3.3.1': {
        category: 'Tactile',
        subcategory: 'pressure_sensitivity'
      },
      '3.3.2': {
        category: 'Tactile',
        subcategory: 'designed_lab'
      }
    };
    
    return presets[code] || {};
  }
};

// Severe impairment alternative device form configuration
export const severeImpairmentConfig: FormConfig = {
  tableName: 'severe_impairment_alter',
  title: 'Add Severe Impairment Alternative',
  fields: [
    {
      name: 'code',
      label: 'Code',
      type: 'text',
      required: true,
      placeholder: 'e.g., 6.3',
      readOnly: true
    },
    {
      name: 'category',
      label: 'Category',
      type: 'text',
      required: true,
      placeholder: 'e.g., eye_tracking, head_mouse',
      readOnly: true
    },
    {
      name: 'subcategory',
      label: 'Subcategory',
      type: 'text',
      required: true,
      placeholder: 'Specific type within category',
      readOnly: true
    },
    {
      name: 'product',
      label: 'Product Name',
      type: 'text',
      required: true,
      placeholder: 'Product name'
    },
    {
      name: 'price_range',
      label: 'Price Range',
      type: 'text',
      placeholder: 'e.g., $50-$100'
    },
    {
      name: 'website',
      label: 'Website',
      type: 'text',
      placeholder: 'Product website URL'
    },
    {
      name: 'image_url',
      label: 'Image URL',
      type: 'text',
      placeholder: 'Product image URL'
    }
  ],
  getPresetValues: (code: string) => {
    const presets: Record<string, Record<string, string>> = {
      '6.1': {
        category: 'Severe',
        subcategory: 'one_hand_console_controller'
      },
      '6.2': {
        category: 'Severe',
        subcategory: 'quad_stick'
      },
      '6.3': {
        category: 'Severe',
        subcategory: 'eye_tracking'
      }
    };
    
    return presets[code] || {};
  }
};

// Adaptive controller form configuration
export const adaptiveControllerConfig: FormConfig = {
  tableName: 'adaptive_controllers',
  title: 'Add Adaptive Controller',
  fields: [
    {
      name: 'category',
      label: 'Category',
      type: 'text',
      required: true,
      placeholder: 'e.g., xbox, playstation',
      readOnly: true
    },
    {
      name: 'product',
      label: 'Product Name',
      type: 'text',
      required: true,
      placeholder: 'Product name'
    },
    {
      name: 'price',
      label: 'Price',
      type: 'text',
      placeholder: 'e.g., $99.99'
    },
    {
      name: 'website',
      label: 'Website',
      type: 'text',
      placeholder: 'Product website URL'
    },
    {
      name: 'image',
      label: 'Image URL',
      type: 'text',
      placeholder: 'Product image URL'
    }
  ],
  getPresetValues: (code: string) => {
    const presets: Record<string, Record<string, string>> = {
      'AC': {
        category: 'Adaptive',
        subcategory: 'controller'
      }
    };
    
    return presets[code] || {};
  }
};

// Adaptive switch form configuration
export const adaptiveSwitchConfig: FormConfig = {
  tableName: 'adaptive_switches',
  title: 'Add Adaptive Switch',
  fields: [
    {
      name: 'category',
      label: 'Category',
      type: 'text',
      required: true,
      placeholder: 'e.g., pressure, sip_puff',
      readOnly: true
    },
    {
      name: 'product',
      label: 'Product Name',
      type: 'text',
      required: true,
      placeholder: 'Product name'
    },
    {
      name: 'price',
      label: 'Price',
      type: 'text',
      placeholder: 'e.g., $99.99'
    },
    {
      name: 'website',
      label: 'Website',
      type: 'text',
      placeholder: 'Product website URL'
    },
    {
      name: 'image',
      label: 'Image URL',
      type: 'text',
      placeholder: 'Product image URL'
    }
  ],
  getPresetValues: (code: string) => {
    const presets: Record<string, Record<string, string>> = {
      'AS': {
        category: 'Sensory',
        subcategory: 'adaptive_switch'
      },
      'AS-1': {
        category: 'Pressure',
        subcategory: 'adaptive_switch'
      }
    };
    
    return presets[code] || {};
  }
};

// Get correct form configuration based on code prefix
export const getFormConfigByCode = (code: string): FormConfig => {
  if (code.startsWith('1.') || code.startsWith('3.') || code.startsWith('4.')) {
    return keyboardRecommendationConfig;
  } else if (code.startsWith('2.')) {
    return physicalRecommendationConfig;
  } else if (code.startsWith('5.')) {
    return sensoryRecommendationConfig;
  } else if (code.startsWith('6.3')) {
    return severeImpairmentConfig;
  } else if (code === 'AS' || code === 'AS-1') {
    return adaptiveSwitchConfig;
  } else if (code === 'AC') {
    return adaptiveControllerConfig;
  } else {
    // Default to keyboard recommendation configuration
    return keyboardRecommendationConfig;
  }
}; 