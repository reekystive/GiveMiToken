import { BrandVariants, createDarkTheme, createLightTheme } from '@fluentui/react-components';

const customBrandRamp: BrandVariants = {
  10: '#070200',
  20: '#261200',
  30: '#401B00',
  40: '#552100',
  50: '#6A2800',
  60: '#7F3000',
  70: '#943900',
  80: '#A94300',
  90: '#BF4C00',
  100: '#D55600',
  110: '#EC6000',
  120: '#FF6D10',
  130: '#FF8946',
  140: '#FFA16D',
  150: '#FFB891',
  160: '#FFCDB2',
};

export const customLightTheme = createLightTheme(customBrandRamp);
export const customDarkTheme = createDarkTheme(customBrandRamp);
