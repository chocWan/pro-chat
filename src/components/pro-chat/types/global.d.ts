import 'antd-style';

import { LobeCustomStylish } from './customStylish';
import { LobeCustomToken } from './customToken';

declare module 'antd-style' {
  export interface CustomToken extends LobeCustomToken {}
  export interface CustomStylish extends LobeCustomStylish {}
}
